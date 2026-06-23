import React, { useState, useEffect } from 'react';
import apiFetch from '../../../services/api';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    section: ''
  });

  const fetchClasses = async () => {
    try {
      const res = await apiFetch('/principal/classes');
      const data = await res.json();
      setClasses(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch classes", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({ name: '', section: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setFormData({ name: cls.name, section: cls.section });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await apiFetch(`/principal/classes/${id}`, {
        method: 'DELETE'
      });
      fetchClasses();
    } catch (err) {
      console.error("Failed to delete class", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        await apiFetch(`/principal/classes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create
        await apiFetch('/principal/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (err) {
      console.error("Failed to save class", err);
    }
  };

  if (loading) return <div>Loading classes...</div>;

  return (
    <div className="animate-fade-in" className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Class Management</h2>
        <button 
          onClick={handleCreateNew}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>➕</span> Add New Class
        </button>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', overflow: 'hidden' }}>
        <table className="w-full border-collapse text-left">
          <thead style={{ background: 'rgba(241, 245, 249, 0.8)' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>ID</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>Class Name</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #e2e8f0' }}>Section</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px' }}>#{cls.id}</td>
                <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '600' }}>{cls.name}</td>
                <td style={{ padding: '16px 24px', color: '#334155' }}>
                  <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{cls.section}</span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(cls)} style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', color: '#3b82f6', fontWeight: '600' }}>Edit</button>
                  <button onClick={() => handleDelete(cls.id)} style={{ background: 'transparent', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', fontWeight: '600' }}>Delete</button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No classes found. Add one to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-fade-in" style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>{editingId ? 'Edit Class' : 'Create New Class'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Class Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Class 10" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
              </div>
              <div className="mb-6">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>Section</label>
                <input required type="text" name="section" value={formData.section} onChange={handleInputChange} placeholder="e.g., A, B, Science" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>{editingId ? 'Save Changes' : 'Create Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
