// @type can be one of 'arrayOfObjects' | 'object' | 'element'

const homepageSchema = {
  currentCourse: {
    type: 'object'
  },
  currentTopicComponent: {
    type: 'element'
  },
  currentTopicComponentDetail: {
    type: 'object'
  },
  totalChapters: {
    type: 'element'
  },
  totalTopics: {
    type: 'element'
  }
}

const schema = {
  chapter: {
    children: ['topic'],
    alias: ['chapters', 'addToChapter'],
    type: 'arrayOfObjects'
  },
  topic: {
    children: ['learningObjective'],
    alias: ['topics'],
    type: 'arrayOfObjects'
  },
  learningObjective: {
    type: 'arrayOfObjects',
    children: ['message'],
    alias: ['learningObjectives']
  },
  userVideo: {
    type: 'arrayOfObjects',
    children: ['topic'],
    alias: ['userVideos']
  },
  userLearningObjective: {
    type: 'arrayOfObjects',
    children: ['learningObjective'],
    alias: ['userLearningObjectives']
  },
  message: {
    type: 'arrayOfObjects',
    alias: ['messages']
  },
  question: {
    type: 'arrayOfObjects'
  },
  userQuiz: {
    type: 'arrayOfObjects',
    alias: ['userQuizs'],
    children: ['question']
  },
  ...homepageSchema
}

export default schema
