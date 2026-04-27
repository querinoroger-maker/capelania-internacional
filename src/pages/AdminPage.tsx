import { useState, useEffect } from 'react';

interface Member {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  baptism_date: string;
  member_since: string;
  status: string;
  photo_url: string;
  created_at: string;
}

const ADMIN_PASSWORD = 'capelania2024'; // Troque para sua senha!

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    full_name: '', email: '', phone: '', address: '',
    birth_date: '', baptism_date: '', member_since: '', status: 'active'
  });

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchMembers();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      fetchMembers();
    } else {
      setError('Incorrect password!');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    setPassword('');
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        setMembers([
          { id: 1, full_name: 'João Silva', email: 'joao@test.com', phone: '(11) 99999-9999', address: 'Rua A, 123', birth_date: '1990-01-01', baptism_date: '2010-05-15', member_since: '2015-01-01', status: 'active', photo_url: '', created_at: '2024-01-01' },
          { id: 2, full_name: 'Maria Santos', email: 'maria@test.com', phone: '(11) 98888-8888', address: 'Rua B, 456', birth_date: '1985-03-20', baptism_date: '2005-08-10', member_since: '2018-06-01', status: 'active', photo_url: '', created_at: '2024-01-02' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await fetch(`/api/members/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    try {
      await fetch(`/api/members/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember),
      });
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      setEditingMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
      const data = await response.json();
      setMembers([...members, { ...newMember, id: data.id } as Member]);
      setShowAddForm(false);
      setNewMember({
        full_name: '', email: '', phone: '', address: '',
        birth_date: '', baptism_date: '', member_since: '', status: 'active'
      });
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const filteredMembers = members.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      }}>
        <div style={{
          background: 'white', padding: '40px', borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#1a1a2e' }}>🔒 Admin Access</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Capelania Internacional</p>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password" placeholder="Enter admin password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '14px 16px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '16px' }}
            />
            {error && <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>}
            <button type="submit" style={{
              padding: '14px', background: '#2563eb', color: 'white', border: 'none',
              borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
        padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0, color: '#1e293b' }}>📊 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#64748b' }}>Welcome, Admin</span>
          <button onClick={() => setShowAddForm(true)} style={{
            padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
          }}>+ Add Member</button>
          <button onClick={logout} style={{
            padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none',
            borderRadius: '8px', cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#dbeafe', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 8px 0' }}>{members.length}</h3>
          <p style={{ color: '#1e40af', margin: 0, fontWeight: '500' }}>Total Members</p>
        </div>
        <div style={{ background: '#dcfce7', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#166534', margin: '0 0 8px 0' }}>{members.filter(m => m.status === 'active').length}</h3>
          <p style={{ color: '#166534', margin: 0, fontWeight: '500' }}>Active</p>
        </div>
        <div style={{ background: '#fef3c7', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#92400e', margin: '0 0 8px 0' }}>{members.filter(m => m.status === 'visitor').length}</h3>
          <p style={{ color: '#92400e', margin: 0, fontWeight: '500' }}>Visitors</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text" placeholder="🔍 Search by name, email or phone..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 20px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading...</p>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Photo</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Phone</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{member.id}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    {member.photo_url ? (
                      <img src={member.photo_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{member.full_name}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{member.email}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{member.phone}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: member.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: member.status === 'active' ? '#166534' : '#991b1b'
                    }}>{member.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    <button onClick={() => setEditingMember(member)} style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(member.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingMember && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Edit Member</h2>
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={editingMember.full_name} onChange={e => setEditingMember({...editingMember, full_name: e.target.value})} placeholder="Full Name" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} placeholder="Email" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} placeholder="Phone" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={editingMember.address} onChange={e => setEditingMember({...editingMember, address: e.target.value})} placeholder="Address" />
            <select style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="visitor">Visitor</option>
            </select>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
              <button onClick={() => setEditingMember(null)} style={{ flex: 1, padding: '12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2>Add New Member</h2>
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={newMember.full_name} onChange={e => setNewMember({...newMember, full_name: e.target.value})} placeholder="Full Name *" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="Email" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} placeholder="Phone" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={newMember.address} onChange={e => setNewMember({...newMember, address: e.target.value})} placeholder="Address" />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} type="date" value={newMember.birth_date} onChange={e => setNewMember({...newMember, birth_date: e.target.value})} />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} type="date" value={newMember.baptism_date} onChange={e => setNewMember({...newMember, baptism_date: e.target.value})} />
            <input style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} type="date" value={newMember.member_since} onChange={e => setNewMember({...newMember, member_since: e.target.value})} />
            <select style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }} value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="visitor">Visitor</option>
            </select>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={handleAdd} style={{ flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add Member</button>
              <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
