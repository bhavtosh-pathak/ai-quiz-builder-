import api from './api';

export const attemptService = {
  submit: (quizId, payload) => api.post(`/attempts/${quizId}/submit`, payload).then((r) => r.data),
  getLeaderboard: (quizId) => api.get(`/attempts/${quizId}/leaderboard`).then((r) => r.data),
  getQuizAttempts: (quizId) => api.get(`/attempts/${quizId}/all`).then((r) => r.data),
  getMine: () => api.get('/attempts/mine').then((r) => r.data),
  getById: (id) => api.get(`/attempts/${id}`).then((r) => r.data),
};
