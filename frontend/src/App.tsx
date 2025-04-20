import { Suspense, lazy } from 'react';
import './App.css';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './hooks/AuthProvider';
import AuthGuard from './routes/AuthGuard';
import ProfessorReview from './apps/professor-review/ProfessorReview';

// Lazy load the PantryPal component with error handling
const PantryPal = lazy(() =>
  import('./apps/pantry-pal/PantryPal').catch(() => ({
    default: () => <NotFound />,
  }))
);

const CourseBoard = lazy(() =>
  import('./apps/course-board/CourseBoard').catch(() => ({
    default: () => <NotFound />,
  }))
);


// Nest protected routes

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path='/home' element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="courses/*" element={<AuthGuard><CourseBoard /></AuthGuard>} />
            <Route path="pantry/*" element={<AuthGuard><PantryPal /></AuthGuard>} />
            <Route path='review' element={<AuthGuard><ProfessorReview /></AuthGuard>} />
            {/* Route for handling unmatched paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
