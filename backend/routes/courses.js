const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    if (level) {
      query.level = level;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .select('-content -quizzes');
    res.json(courses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolled.student', 'name email');
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create course (Alumni/Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, duration, level, content, thumbnail } = req.body;
    
    // Verify user is alumni or admin
    if (!req.user.roles.includes('alumni') && !req.user.roles.includes('admin')) {
      return res.status(403).json({ msg: 'Not authorized to create courses' });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      instructor: req.user.id,
      duration,
      level,
      content,
      thumbnail
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolled.some(e => e.student.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Already enrolled' });
    }

    course.enrolled.push({
      student: req.user.id,
      progress: 0,
      completedContent: [],
      startDate: Date.now()
    });

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update course progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { contentId, completed, quizId, score } = req.body;
    const course = await Course.findById(req.params.id);
    
    const enrollment = course.enrolled.find(e => e.student.toString() === req.user.id);
    if (!enrollment) {
      return res.status(404).json({ msg: 'Not enrolled in this course' });
    }

    if (completed) {
      enrollment.completedContent.push(contentId);
    }
    if (quizId) {
      enrollment.quizScores.push({ quizId, score });
    }

    // Calculate progress
    const totalContent = course.content.length;
    enrollment.progress = (enrollment.completedContent.length / totalContent) * 100;
    enrollment.lastAccessed = Date.now();

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;