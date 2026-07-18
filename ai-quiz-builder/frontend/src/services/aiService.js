import api from './api';

export const aiService = {
  generateQuiz: (payload) => api.post('/ai/generate-quiz', payload).then((r) => r.data),
  explain: (payload) => api.post('/ai/explain', payload).then((r) => r.data),
};
