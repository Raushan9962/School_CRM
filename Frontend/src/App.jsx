import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/student" element={<StudentLogin />} />
      {/* Fallback dashboard route to show successful login routing */}
      <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold">Welcome to Dashboard</div>} />
    </Routes>
  );
}

export default App;