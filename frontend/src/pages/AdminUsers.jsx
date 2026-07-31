import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleMakeAdmin = async (id) => {
    if (window.confirm('Make this user an admin?')) {
      try {
        await adminAPI.makeAdmin(id);
        toast.success('User is now an admin!');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error making user admin');
      }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="admin-header">
          <h1>Manage Users</h1>
          <span className="user-count">Total: {users.length} users</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.gender || 'N/A'}</td>
                    <td>
                      <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        {/* {!user.isAdmin && (
                          <button 
                            className="btn-make-admin"
                            onClick={() => handleMakeAdmin(user._id)}
                          >
                            Make Admin
                          </button>
                        )} */}
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;