const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');

const sampleData = {
  subjects: [
    { name: 'Mathematics', description: 'Basic mathematics concepts and problem solving' },
    { name: 'Physics', description: 'Fundamental physics principles and applications' },
    { name: 'Chemistry', description: 'Chemical reactions and properties of matter' }
  ],
  chapters: [
    { name: 'Algebra', subject: 'Mathematics', description: 'Basic algebraic concepts' },
    { name: 'Geometry', subject: 'Mathematics', description: 'Study of shapes and spaces' },
    { name: 'Mechanics', subject: 'Physics', description: 'Study of motion and forces' },
    { name: 'Thermodynamics', subject: 'Physics', description: 'Study of heat and energy' },
    { name: 'Organic Chemistry', subject: 'Chemistry', description: 'Study of carbon compounds' },
    { name: 'Inorganic Chemistry', subject: 'Chemistry', description: 'Study of non-carbon compounds' }
  ],
  questions: [
    {
      subject: 'Mathematics',
      chapter: 'Algebra',
      question: 'What is the value of x in the equation 2x + 5 = 13?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: '2x + 5 = 13\n2x = 8\nx = 4'
    },
    {
      subject: 'Physics',
      chapter: 'Mechanics',
      question: 'What is the SI unit of force?',
      options: ['Joule', 'Newton', 'Pascal', 'Watt'],
      correctAnswer: 1,
      explanation: 'The Newton (N) is the SI unit of force, defined as the force needed to accelerate one kilogram of mass at the rate of one meter per second squared.'
    },
    {
      subject: 'Chemistry',
      chapter: 'Organic Chemistry',
      question: 'What is the general formula for alkanes?',
      options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnH2n+1'],
      correctAnswer: 1,
      explanation: 'Alkanes have the general formula CnH2n+2, where n is the number of carbon atoms.'
    }
  ]
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Created admin user');

    // Create subjects
    const subjects = await Subject.insertMany(sampleData.subjects);
    console.log('Created subjects');

    // Create chapters
    const chapters = await Chapter.insertMany(
      sampleData.chapters.map(chapter => ({
        ...chapter,
        subject: subjects.find(s => s.name === chapter.subject)._id
      }))
    );
    console.log('Created chapters');

    // Create questions
    const questions = await Question.insertMany(
      sampleData.questions.map(question => ({
        ...question,
        subject: subjects.find(s => s.name === question.subject)._id,
        chapter: chapters.find(c => c.name === question.chapter)._id
      }))
    );
    console.log('Created questions');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 