import api from './api';

export const quizService = {
  create: (payload) => api.post('/quizzes', payload).then((r) => r.data),
  getMine: (params) => api.get('/quizzes/mine', { params }).then((r) => r.data),
  getAvailable: (params) => api.get('/quizzes/available', { params }).then((r) => r.data),
  getById: (id) => api.get(`/quizzes/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/quizzes/${id}`, payload).then((r) => r.data),
  deleteQuestion: (id, questionId) => api.delete(`/quizzes/${id}/questions/${questionId}`).then((r) => r.data),
  publish: (id) => api.patch(`/quizzes/${id}/publish`).then((r) => r.data),
  close: (id) => api.patch(`/quizzes/${id}/close`).then((r) => r.data),
  remove: (id) => api.delete(`/quizzes/${id}`).then((r) => r.data),
  joinByCode: (code) => api.get(`/quizzes/join/${code}`).then((r) => r.data),
};
