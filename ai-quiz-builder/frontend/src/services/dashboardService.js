import api from './api';

export const dashboardService = {
  getTeacherStats: () => api.get('/dashboard/teacher').then((r) => r.data),
  getStudentStats: () => api.get('/dashboard/student').then((r) => r.data),
};
