// import { Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { SocketProvider } from './context/SocketContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import ForgotPassword from './pages/forgotpassword';
// import VerifyOTP from './pages/VerifyOTP';
// import ResetPassword from './pages/resetpassword';
// import Landing from './pages/Landing';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import NotFound from './pages/NotFound';
// import Profile from './pages/Profile';
// import LeaderboardPage from './pages/LeaderboardPage';
// import VerifyEmail from "./pages/verify-email";

// import TeacherDashboard from './pages/teacher/TeacherDashboard';
// import MyQuizzes from './pages/teacher/MyQuizzes';
// import CreateQuiz from './pages/teacher/CreateQuiz';
// import AIQuizGenerator from './pages/teacher/AIQuizGenerator';
// import QuizResults from './pages/teacher/QuizResults';

// import StudentDashboard from './pages/student/StudentDashboard';
// import BrowseQuizzes from './pages/student/BrowseQuizzes';
// import JoinQuiz from './pages/student/JoinQuiz';
// import QuizAttempt from './pages/student/QuizAttempt';
// import QuizResult from './pages/student/QuizResult';
// import MyResults from './pages/student/MyResults';

// function App() {
//   return (
//     <SocketProvider>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
//           success: { iconTheme: { primary: '#2F9E64', secondary: '#fff' } },
//           error: { iconTheme: { primary: '#D6455D', secondary: '#fff' } },
//         }}
//       />
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route 
//   path="/forgot-password" 
//   element={<ForgotPassword />} 
// />

// <Route 
//   path="/verify-otp" 
//   element={<VerifyOTP />} 
// />
// <Route 
//   path="/verify-email" 
//   element={<VerifyEmail />} 
// />
// <Route 
//   path="/reset-password" 
//   element={<ResetPassword />} 
// />
//         {/* Teacher */}
//         <Route path="/teacher/dashboard" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
//         <Route path="/teacher/quizzes" element={<ProtectedRoute roles={['teacher']}><MyQuizzes /></ProtectedRoute>} />
//         <Route path="/teacher/quizzes/new" element={<ProtectedRoute roles={['teacher']}><CreateQuiz /></ProtectedRoute>} />
//         <Route path="/teacher/quizzes/:id" element={<ProtectedRoute roles={['teacher']}><CreateQuiz /></ProtectedRoute>} />
//         <Route path="/teacher/quizzes/:id/results" element={<ProtectedRoute roles={['teacher']}><QuizResults /></ProtectedRoute>} />
//         <Route path="/teacher/generate" element={<ProtectedRoute roles={['teacher']}><AIQuizGenerator /></ProtectedRoute>} />
//         <Route path="/teacher/profile" element={<ProtectedRoute roles={['teacher']}><Profile /></ProtectedRoute>} />

//         {/* Student */}
//         <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
//         <Route path="/student/quizzes" element={<ProtectedRoute roles={['student']}><BrowseQuizzes /></ProtectedRoute>} />
//         <Route path="/student/join" element={<ProtectedRoute roles={['student']}><JoinQuiz /></ProtectedRoute>} />
//         <Route path="/student/attempt/:code" element={<ProtectedRoute roles={['student']}><QuizAttempt /></ProtectedRoute>} />
//         <Route path="/student/results" element={<ProtectedRoute roles={['student']}><MyResults /></ProtectedRoute>} />
//         <Route path="/student/results/:id" element={<ProtectedRoute roles={['student']}><QuizResult /></ProtectedRoute>} />
//         <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><Profile /></ProtectedRoute>} />

//         {/* Shared */}
//         <Route path="/attempts/:quizId/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </SocketProvider>
//   );
// }

// export default App;
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/verify-email';
import ForgotPassword from './pages/forgotpassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/resetpassword';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import LeaderboardPage from './pages/LeaderboardPage';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MyQuizzes from './pages/teacher/MyQuizzes';
import CreateQuiz from './pages/teacher/CreateQuiz';
import AIQuizGenerator from './pages/teacher/AIQuizGenerator';
import QuizResults from './pages/teacher/QuizResults';

import StudentDashboard from './pages/student/StudentDashboard';
import BrowseQuizzes from './pages/student/BrowseQuizzes';
import JoinQuiz from './pages/student/JoinQuiz';
import QuizAttempt from './pages/student/QuizAttempt';
import QuizResult from './pages/student/QuizResult';
import MyResults from './pages/student/MyResults';

function App() {
  return (
    <SocketProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#2F9E64', secondary: '#fff' } },
          error: { iconTheme: { primary: '#D6455D', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Teacher */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/quizzes" element={<ProtectedRoute roles={['teacher']}><MyQuizzes /></ProtectedRoute>} />
        <Route path="/teacher/quizzes/new" element={<ProtectedRoute roles={['teacher']}><CreateQuiz /></ProtectedRoute>} />
        <Route path="/teacher/quizzes/:id" element={<ProtectedRoute roles={['teacher']}><CreateQuiz /></ProtectedRoute>} />
        <Route path="/teacher/quizzes/:id/results" element={<ProtectedRoute roles={['teacher']}><QuizResults /></ProtectedRoute>} />
        <Route path="/teacher/generate" element={<ProtectedRoute roles={['teacher']}><AIQuizGenerator /></ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute roles={['teacher']}><Profile /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/quizzes" element={<ProtectedRoute roles={['student']}><BrowseQuizzes /></ProtectedRoute>} />
        <Route path="/student/join" element={<ProtectedRoute roles={['student']}><JoinQuiz /></ProtectedRoute>} />
        <Route path="/student/attempt/:code" element={<ProtectedRoute roles={['student']}><QuizAttempt /></ProtectedRoute>} />
        <Route path="/student/results" element={<ProtectedRoute roles={['student']}><MyResults /></ProtectedRoute>} />
        <Route path="/student/results/:id" element={<ProtectedRoute roles={['student']}><QuizResult /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><Profile /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/attempts/:quizId/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;