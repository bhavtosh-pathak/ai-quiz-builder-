/**
 * Optional seed script. Run with `npm run seed` after setting MONGO_URI.
 * Creates a demo teacher, a demo student, and a published sample quiz
 * so you can explore the app immediately without generating your own data.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({ email: /@demo\.aiquizbuilder\.com$/ }), ]);

  const teacher = await User.create({
    name: 'Demo Teacher',
    email: 'teacher@demo.aiquizbuilder.com',
    password: 'password123',
    role: 'teacher',
  });

  const student = await User.create({
    name: 'Demo Student',
    email: 'student@demo.aiquizbuilder.com',
    password: 'password123',
    role: 'student',
  });

  const quiz = await Quiz.create({
    title: 'JavaScript Fundamentals',
    description: 'A quick warm-up quiz on core JavaScript concepts.',
    subject: 'JavaScript',
    duration: 10,
    status: 'published',
    createdBy: teacher._id,
    questions: [
      {
        questionText: 'What keyword declares a block-scoped variable in JavaScript?',
        options: ['var', 'let', 'define', 'variable'],
        correctAnswer: 'let',
        difficulty: 'easy',
        marks: 1,
      },
      {
        questionText: 'Which method converts a JSON string into a JavaScript object?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.toObject()', 'Object.parse()'],
        correctAnswer: 'JSON.parse()',
        difficulty: 'medium',
        marks: 1,
      },
      {
        questionText: 'What does the "===" operator check?',
        options: [
          'Value only',
          'Reference only',
          'Value and type',
          'Nothing, it is invalid syntax',
        ],
        correctAnswer: 'Value and type',
        difficulty: 'medium',
        marks: 1,
      },
    ],
  });

  console.log('--------------------------------------------------');
  console.log('Seed complete!');
  console.log('Teacher login: teacher@demo.aiquizbuilder.com / password123');
  console.log('Student login: student@demo.aiquizbuilder.com / password123');
  console.log(`Sample quiz code: ${quiz.quizCode}`);
  console.log('--------------------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
