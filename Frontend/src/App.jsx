import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import SuperAdmin from './pages/SuperAdmin/SuperAdmin';
import SchoolRegister from './pages/SuperAdmin/SchoolRegister';
import SchoolAdminDashboard from './pages/SchoolAdmin/SchoolAdminDashboard';
import PrincipalDashboard from './pages/Principal/PrincipalDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import AccountantDashboard from './pages/Accountant/AccountantDashboard';
import TransportDashboard from './pages/Transport/TransportDashboard';
import LibrarianDashboard from './pages/Librarian/LibrarianDashboard';
import ReceptionistDashboard from './pages/Receptionist/ReceptionistDashboard';
import LabAssistantDashboard from './pages/LabAssistant/LabAssistantDashboard';
import ParentDashboard from './pages/Parent/ParentDashboard';
import AdmissionForm from './pages/Public/AdmissionForm';
import InvoicePayment from './pages/Public/InvoicePayment';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/admission" element={<AdmissionForm />} />
      <Route path="/invoice/:id" element={<InvoicePayment />} />
      <Route path="/login/student" element={<StudentLogin />} />

      {/* Protected routes */}
      <Route path="/SuperAdmin" element={<PrivateRoute allowedRoles={['superadmin']}><SuperAdmin /></PrivateRoute>} />
      <Route path="/register-school" element={<PrivateRoute allowedRoles={['superadmin']}><SchoolRegister /></PrivateRoute>} />
      <Route path="/SchoolAdminDashboard" element={<PrivateRoute allowedRoles={['schooladmin']}><SchoolAdminDashboard /></PrivateRoute>} />
      <Route path="/PrincipalDashboard" element={<PrivateRoute allowedRoles={['principal']}><PrincipalDashboard /></PrivateRoute>} />
      <Route path="/StudentDashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
      <Route path="/TeacherDashboard" element={<PrivateRoute allowedRoles={['teacher']}><TeacherDashboard /></PrivateRoute>} />
      <Route path="/AccountantDashboard" element={<PrivateRoute allowedRoles={['accountant']}><AccountantDashboard /></PrivateRoute>} />
      <Route path="/TransportDashboard" element={<PrivateRoute allowedRoles={['transport']}><TransportDashboard /></PrivateRoute>} />
      <Route path="/LibrarianDashboard" element={<PrivateRoute allowedRoles={['librarian']}><LibrarianDashboard /></PrivateRoute>} />
      <Route path="/ReceptionistDashboard" element={<PrivateRoute allowedRoles={['receptionist']}><ReceptionistDashboard /></PrivateRoute>} />
      <Route path="/LabAssistantDashboard" element={<PrivateRoute allowedRoles={['labassistant']}><LabAssistantDashboard /></PrivateRoute>} />
      <Route path="/ParentDashboard" element={<PrivateRoute allowedRoles={['parent']}><ParentDashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;