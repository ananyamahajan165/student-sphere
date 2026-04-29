import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const destination = user?.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student';
  return <Navigate to={destination} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/dashboard/mentor" element={<Dashboard />} />
        <Route path="/dashboard/student" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
