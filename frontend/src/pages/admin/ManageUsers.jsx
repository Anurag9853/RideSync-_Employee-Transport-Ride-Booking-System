import React, { useEffect, useState } from 'react';
import { apiGetAllUsers, apiDeleteUser } from '../../api/axiosInstance.js';
import { TableSkeleton } from '../../components/common/LoadingSkeleton.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useToast } from '../../hooks/useToast.js';
import '../../styles/manage-table.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);
  const { showToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [page]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await apiGetAllUsers({ page, size });
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      return;
    }
    try {
      await apiDeleteUser(id);
      showToast('User deleted successfully', 'success');
      loadUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete user', 'error');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">View and manage all system users</p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No Users" message="No users found in the system" />
      ) : (
        <>
          <div className="manage-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Total Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <StatusBadge status={user.role} type="role" />
                    </td>
                    <td>{user.totalBookings || 0}</td>
                    <td>
                      <button
                        className="btn-link danger"
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
        </>
      )}
    </div>
  );
}
