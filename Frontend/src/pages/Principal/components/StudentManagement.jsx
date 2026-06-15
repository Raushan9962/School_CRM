import React, { useState, useEffect } from 'react';
import StudentProfile from './StudentProfile';

const StudentManagement = ({ activeAction }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Views
  const [viewingProfileId, setViewingProfileId] = useState(null);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  
  const [activeStudent, setActiveStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Form Data for various actions
  const [formData, setFormData] = useState({
    name: '', email: '', admissionNo: '', rollNumber: '', classId: '', section: '', parentPhone: ''
  });
  const [promoteData, setPromoteData] = useState({ classId: '', section: '' });
  const [transferData, setTransferData] = useState({ reason: '', date: new Date().toISOString().split('T')[0] });
  
  // ID Card Edit State
  const [idCardData, setIdCardData] = useState(null);
  const [isEditingIdCard, setIsEditingIdCard] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/principal/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('API not ready');
      const json = await res.json();
      setStudents(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (activeAction === 'student_add') handleCreateNew();
    else setShowModal(false);
  }, [activeAction]);

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', admissionNo: '', rollNumber: '', classId: '', section: '', parentPhone: '' });
    setShowModal(true);
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setFormData({
      name: s.name, email: s.email, admissionNo: s.admissionNo, rollNumber: s.rollNumber, 
      classId: s.className.replace('Class ', ''), section: s.section, parentPhone: s.phone
    });
    setShowModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/principal/students/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        });
      } else {
        await fetch('http://localhost:5000/api/principal/students', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  const openPromote = (s) => {
    setActiveStudent(s);
    setPromoteData({ classId: '', section: '' });
    setShowPromoteModal(true);
  };

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/principal/students/${activeStudent.id}/promote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(promoteData)
      });
      setShowPromoteModal(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const openTransfer = (s) => {
    setActiveStudent(s);
    setTransferData({ reason: '', date: new Date().toISOString().split('T')[0] });
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/principal/students/${activeStudent.id}/transfer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(transferData)
      });
      setShowTransferModal(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const openIdCard = (s) => {
    setActiveStudent(s);
    setIdCardData({ ...s });
    setIsEditingIdCard(false);
    setShowIdCardModal(true);
  };

  const handleSendIdCard = () => {
    alert("✅ Sent to Student's Dashboard!");
    setShowIdCardModal(false);
  };

  // If viewing a profile, render ONLY the profile component
  if (viewingProfileId) {
    return <StudentProfile studentId={viewingProfileId} onBack={() => setViewingProfileId(null)} />;
  }

  return (
    <div className="p-6 animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-indigo-950 m-0">👨‍🎓 Student List</h2>
        <div className="flex gap-3 flex-wrap">
          <ActionBtn text="Add New Student" icon="➕" onClick={handleCreateNew} color="bg-blue-600" />
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
        {loading ? <p className="text-slate-500">Loading students...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-100/80">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Photo</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Admission No</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Name</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Class</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Section</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Roll No</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Attendance</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-500 border-b border-slate-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${s.section === 'Transferred' ? 'opacity-50' : ''}`}>
                    <td className="p-4 text-2xl text-center">👤</td>
                    <td className="p-4 text-slate-500 font-semibold">{s.admissionNo}</td>
                    <td className="p-4 font-bold text-slate-800">{s.name}</td>
                    <td className="p-4 text-slate-600">{s.className || 'N/A'}</td>
                    <td className="p-4"><span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">{s.section || 'N/A'}</span></td>
                    <td className="p-4 text-slate-500">{s.rollNumber}</td>
                    <td className="p-4 font-bold text-emerald-500">92%</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${s.section === 'Transferred' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.section === 'Transferred' ? 'Transferred' : 'Active'}</span></td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setViewingProfileId(s.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow">View Profile</button>
                        <button onClick={() => handleEdit(s)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded transition-colors shadow">Edit</button>
                        <button onClick={() => openPromote(s)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow" disabled={s.section === 'Transferred'}>Promote</button>
                        <button onClick={() => openTransfer(s)} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow" disabled={s.section === 'Transferred'}>Transfer</button>
                        <button onClick={() => openIdCard(s)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow">Print ID Card</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-400">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingId ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSaveStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label><input required type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">Admission Number</label><input required type="text" name="admissionNo" value={formData.admissionNo} onChange={(e) => setFormData({...formData, admissionNo: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">Roll Number</label><input required type="text" name="rollNumber" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">Class ID</label><input required type="number" name="classId" value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">Section</label><input required type="text" name="section" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-500 mb-1">Parent Phone</label><input required type="text" name="parentPhone" value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Promote Student</h3>
            <p className="text-slate-500 text-sm mb-6">Promoting {activeStudent?.name}</p>
            <form onSubmit={handlePromoteSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">New Class ID</label>
                <input required type="number" value={promoteData.classId} onChange={(e) => setPromoteData({...promoteData, classId: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">New Section</label>
                <input required type="text" value={promoteData.section} onChange={(e) => setPromoteData({...promoteData, section: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPromoteModal(false)} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/30">Promote</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🚪</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Transfer Student</h3>
            <p className="text-slate-500 text-sm mb-6">Initiating transfer for {activeStudent?.name}</p>
            <form onSubmit={handleTransferSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Transfer Date</label>
                <input required type="date" value={transferData.date} onChange={(e) => setTransferData({...transferData, date: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Reason for Transfer</label>
                <textarea required rows="3" value={transferData.reason} onChange={(e) => setTransferData({...transferData, reason: e.target.value})} className="w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-red-500"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/30">Confirm Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      {showIdCardModal && idCardData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          
          <div className="flex justify-between w-full max-w-md mb-4 text-white">
            <h3 className="text-xl font-bold">Student ID Card</h3>
            <button onClick={() => setShowIdCardModal(false)} className="text-slate-300 hover:text-white font-bold">✕ Close</button>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-md border border-slate-200 mb-6 animate-fade-in relative">
            <div className="bg-indigo-600 p-4 text-center text-white">
              <h2 className="font-black text-xl tracking-wider">MODERN PUBLIC SCHOOL</h2>
              <p className="text-xs text-indigo-200">Excellence in Education</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="w-32 h-32 bg-slate-100 rounded-lg border-4 border-white shadow-md flex items-center justify-center text-6xl mb-4 -mt-12">👤</div>
              
              {isEditingIdCard ? (
                <div className="w-full space-y-3 mb-4">
                  <input className="w-full text-center text-2xl font-bold text-slate-800 border-b border-indigo-200 outline-none" value={idCardData.name} onChange={(e) => setIdCardData({...idCardData, name: e.target.value})} />
                  <div className="flex gap-2">
                    <input className="flex-1 text-center font-bold text-indigo-600 border-b border-indigo-100 outline-none" value={idCardData.className} onChange={(e) => setIdCardData({...idCardData, className: e.target.value})} />
                    <input className="flex-1 text-center font-bold text-indigo-600 border-b border-indigo-100 outline-none" value={idCardData.section} onChange={(e) => setIdCardData({...idCardData, section: e.target.value})} />
                  </div>
                  <input className="w-full text-center text-slate-500 border-b border-slate-200 outline-none text-sm" value={idCardData.admissionNo} onChange={(e) => setIdCardData({...idCardData, admissionNo: e.target.value})} />
                </div>
              ) : (
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">{idCardData.name}</h3>
                  <p className="text-indigo-600 font-bold tracking-wide mt-1">{idCardData.className} - Section {idCardData.section}</p>
                  <p className="text-slate-500 text-sm mt-2">Adm No: <span className="font-bold text-slate-700">{idCardData.admissionNo}</span></p>
                  <p className="text-slate-500 text-sm">Roll No: <span className="font-bold text-slate-700">{idCardData.rollNumber}</span></p>
                </div>
              )}

              <div className="mt-4 border-t border-slate-200 pt-4 w-full flex flex-col items-center">
                <div className="h-10 w-48 bg-slate-800 rounded flex flex-col items-center justify-center overflow-hidden">
                  <div className="w-full flex justify-between px-1"><div className="w-1 bg-white h-8"></div><div className="w-2 bg-white h-8"></div><div className="w-1 bg-white h-8"></div><div className="w-3 bg-white h-8"></div><div className="w-1 bg-white h-8"></div><div className="w-2 bg-white h-8"></div><div className="w-4 bg-white h-8"></div><div className="w-1 bg-white h-8"></div><div className="w-2 bg-white h-8"></div><div className="w-1 bg-white h-8"></div></div>
                </div>
                <p className="text-[10px] tracking-[0.2em] mt-1 text-slate-400">STUDENT ID</p>
              </div>
            </div>
            <div className="bg-slate-50 p-2 text-center text-xs text-slate-400 font-semibold border-t border-slate-100">
              Valid for Academic Year 2026-2027
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-md">
            {isEditingIdCard ? (
              <button onClick={() => setIsEditingIdCard(false)} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-emerald-600">Save Changes</button>
            ) : (
              <button onClick={() => setIsEditingIdCard(true)} className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-slate-800">Edit Details</button>
            )}
            <button onClick={() => setShowIdCardModal(false)} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-red-600">Delete (Discard)</button>
            <button onClick={handleSendIdCard} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-purple-700 shadow-purple-600/50 flex items-center justify-center gap-2">
              🖨️ Print / Send
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

const ActionBtn = ({ text, icon, onClick, color }) => (
  <button onClick={onClick} className={`${color} text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-1 transition-transform shadow-lg shadow-black/10`}>
    <span>{icon}</span> {text}
  </button>
);

export default StudentManagement;
