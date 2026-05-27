import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import SuperAdmin from './pages/SuperAdmin/SuperAdmin';
import SchoolRegister from './pages/SuperAdmin/SchoolRegister';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/SuperAdmin" element={<SuperAdmin />} />
      <Route path="/register-school" element={<SchoolRegister />} />
    </Routes>
  );
}

export default App;