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
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admission" element={<AdmissionForm />} />
      <Route path="/invoice/:id" element={<InvoicePayment />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/SuperAdmin" element={<SuperAdmin />} />
      <Route path="/register-school" element={<SchoolRegister />} />
      <Route path="/SchoolAdminDashboard" element={<SchoolAdminDashboard />} />
      <Route path="/PrincipalDashboard" element={<PrincipalDashboard />} />
      <Route path="/StudentDashboard" element={<StudentDashboard />} />
      <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
      <Route path="/AccountantDashboard" element={<AccountantDashboard />} />
      <Route path="/TransportDashboard" element={<TransportDashboard />} />
      <Route path="/LibrarianDashboard" element={<LibrarianDashboard />} />
      <Route path="/ReceptionistDashboard" element={<ReceptionistDashboard />} />
      <Route path="/LabAssistantDashboard" element={<LabAssistantDashboard />} />
      <Route path="/ParentDashboard" element={<ParentDashboard />} />
    </Routes>
  );
}

export default App;