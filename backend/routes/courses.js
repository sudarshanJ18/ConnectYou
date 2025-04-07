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
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, category, duration,
      level, content, thumbnail, price
    } = req.body;

    if (!req.user || !["instructor", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access: Only instructors or admins allowed" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      instructor: req.user.id,
      duration,
      level,
      content,
      thumbnail,
      price // ✅ this was missing
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

router.put('/:id/progress', auth, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Authenticated User:", req.user);

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    console.log("Course Enrollments:", course.enrolled.map(e => e.student.toString()));

    const enrollment = course.enrolled.find(
      e => e.student.toString() === req.user.id.toString()
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    const { contentId, completed, quizId, score } = req.body;

    if (completed && contentId && !enrollment.completedContent.includes(contentId)) {
      enrollment.completedContent.push(contentId);
    }

    if (quizId) {
      enrollment.quizScores.push({ quizId, score });
    }

    const totalLessons = course.modules.reduce((total, mod) => total + mod.lessons.length, 0);
    enrollment.progress = (enrollment.completedContent.length / totalLessons) * 100;
    enrollment.lastAccessed = new Date();

    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
