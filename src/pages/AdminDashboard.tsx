import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
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
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated]);

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

  const handleEdit = (member: Member) => {
    setEditingMember(member);
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

  if (!isAuthenticated) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📊 Admin Dashboard</h1>
        <div style={styles.headerActions}>
          <span style={styles.welcome}>Welcome, Admin</span>
          <button onClick={() => setShowAddForm(true)} style={styles.addBtn}>+ Add Member</button>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>{members.length}</h3>
          <p style={styles.statLabel}>Total Members</p>
        </div>
        <div style={{...styles.statCard, background: '#dcfce7'}}>
          <h3 style={{...styles.statNumber, color: '#166534'}}>{members.filter(m => m.status === 'active').length}</h3>
          <p style={{...styles.statLabel, color: '#166534'}}>Active</p>
        </div>
        <div style={{...styles.statCard, background: '#fef3c7'}}>
          <h3 style={{...styles.statNumber, color: '#92400e'}}>{members.filter(m => m.status === 'visitor').length}</h3>
          <p style={{...styles.statLabel, color: '#92400e'}}>Visitors</p>
        </div>
      </div>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Photo</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id} style={styles.tr}>
                  <td style={styles.td}>{member.id}</td>
                  <td style={styles.td}>
                    {member.photo_url ? (
                      <img src={member.photo_url} alt="" style={styles.photo} />
                    ) : (
                      <div style={styles.noPhoto}>👤</div>
                    )}
                  </td>
                  <td style={styles.td}>{member.full_name}</td>
                  <td style={styles.td}>{member.email}</td>
                  <td style={styles.td}>{member.phone}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: member.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: member.status === 'active' ? '#166534' : '#991b1b',
                    }}>
                      {member.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(member)} style={styles.editBtn}>✏️ Edit</button>
                    <button onClick={() => handleDelete(member.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingMember && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Edit Member</h2>
            <input style={styles.modalInput} value={editingMember.full_name} onChange={e => setEditingMember({...editingMember, full_name: e.target.value})} placeholder="Full Name" />
            <input style={styles.modalInput} value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} placeholder="Email" />
            <input style={styles.modalInput} value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} placeholder="Phone" />
            <input style={styles.modalInput} value={editingMember.address} onChange={e => setEditingMember({...editingMember, address: e.target.value})} placeholder="Address" />
            <select style={styles.modalInput} value={editingMember.status} onChange={e => setEditingMember({...editingMember, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="visitor">Visitor</option>
            </select>
            <div style={styles.modalButtons}>
              <button onClick={handleSaveEdit} style={styles.saveBtn}>Save</button>
              <button onClick={() => setEditingMember(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Add New Member</h2>
            <input style={styles.modalInput} value={newMember.full_name} onChange={e => setNewMember({...newMember, full_name: e.target.value})} placeholder="Full Name *" />
            <input style={styles.modalInput} value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} placeholder="Email" />
            <input style={styles.modalInput} value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} placeholder="Phone" />
            <input style={styles.modalInput} value={newMember.address} onChange={e => setNewMember({...newMember, address: e.target.value})} placeholder="Address" />
            <input style={styles.modalInput} type="date" value={newMember.birth_date} onChange={e => setNewMember({...newMember, birth_date: e.target.value})} />
            <input style={styles.modalInput} type="date" value={newMember.baptism_date} onChange={e => setNewMember({...newMember, baptism_date: e.target.value})} />
            <input style={styles.modalInput} type="date" value={newMember.member_since} onChange={e => setNewMember({...newMember, member_since: e.target.value})} />
            <select style={styles.modalInput} value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="visitor">Visitor</option>
            </select>
            <div style={styles.modalButtons}>
              <button onClick={handleAdd} style={styles.saveBtn}>Add Member</button>
              <button onClick={() => setShowAddForm(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', maxWidth: '1400px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: '24px', margin: 0, color: '#1e293b' },
  headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  welcome: { color: '#64748b' },
  addBtn: { padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  logoutBtn: { padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#dbeafe', padding: '24px', borderRadius: '12px', textAlign: 'center' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 8px 0' },
  statLabel: { color: '#1e40af', margin: 0, fontWeight: '500' },
  searchBox: { marginBottom: '20px' },
  searchInput: { width: '100%', padding: '14px 20px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
  tableContainer: { background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#f1f5f9' },
  th: { padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '14px 16px', color: '#334155' },
  photo: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
  noPhoto: { width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  editBtn: { padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  loading: { textAlign: 'center', padding: '40px', color: '#64748b' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
  modalInput: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' },
  modalButtons: { display: 'flex', gap: '12px', marginTop: '16px' },
  saveBtn: { flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { flex: 1, padding: '12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
};