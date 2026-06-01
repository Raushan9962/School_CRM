import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import SuperAdmin from './pages/SuperAdmin/SuperAdmin';
import SchoolRegister from './pages/SuperAdmin/SchoolRegister';
import SchoolAdminDashboard from './pages/SchoolAdmin/SchoolAdminDashboard';
import PrincipalDashboard from './pages/Principal/PrincipalDashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/SuperAdmin" element={<SuperAdmin />} />
      <Route path="/register-school" element={<SchoolRegister />} />
      <Route path="/SchoolAdminDashboard" element={<SchoolAdminDashboard />} />
      <Route path="/PrincipalDashboard" element={<PrincipalDashboard />} />
    </Routes>
  );
}

export default App;