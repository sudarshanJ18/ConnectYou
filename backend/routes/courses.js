const express = require('express');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (level && level !== 'all') {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolled.student', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course (protected route for Alumni/Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, duration, level, content, thumbnail } = req.body;

    // Verify user is alumni or admin
    if (!req.user.roles.includes('alumni') && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Not authorized to create courses' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolled.some(e => e.student.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    course.enrolled.push({
      student: req.user.id,
      progress: 0,
      completedContent: [],
      startDate: Date.now()
    });

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { contentId, completed, quizId, score } = req.body;
    const course = await Course.findById(req.params.id);

    const enrollment = course.enrolled.find(e => e.student.toString() === req.user.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
