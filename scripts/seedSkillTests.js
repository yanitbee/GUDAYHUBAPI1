const mongoose = require('mongoose');
const SkillTest = require('./models/SkillTest');

const skillTests = [
  {
    skill: 'JavaScript',
    questions: [
      {
        question: 'What is a closure?',
        options: ['A function combined with its lexical environment', 'A block of code', 'A loop', 'None of the above'],
        correctOption: 0,
      },
      {
        question: 'What is hoisting?',
        options: ['A feature in ES6', 'A default behavior of moving declarations to the top', 'A type of error', 'None of the above'],
        correctOption: 1,
      },
    ],
    duration: 10,
  },
  {
    skill: 'React',
    questions: [
      {
        question: 'What is a hook?',
        options: ['A component', 'A state management tool', 'A special function that lets you use state and other features', 'None of the above'],
        correctOption: 2,
      },
      {
        question: 'What is JSX?',
        options: ['JavaScript XML', 'A templating engine', 'A CSS preprocessor', 'None of the above'],
        correctOption: 0,
      },
    ],
    duration: 10,
  },
];

const seedDB = async () => {
  try {
    await SkillTest.deleteMany({});
    await SkillTest.insertMany(skillTests);
    console.log('Database seeded');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
  }
};

module.exports = seedDB;
