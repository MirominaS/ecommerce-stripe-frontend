import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContex";
import { getAdminUsers, updateAdminUser } from "../../services/adminService";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";
import { FaAngleDoubleLeft } from "react-icons/fa";
import "./AdminUsers.css";
import UserDetailsModal from "../../components/UserDetailsModal/UserDetailsModal";
import AlertModal from "../../components/AlertModal/AlertModal";
import { showError, showSuccess } from "../../utils/toast";

const AdminUsers = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    isActive: true,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUser, setShowUser] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    showCancel: false,
    onConfirm: null,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAdminUsers(token, {
        page,
        limit: 10,
        search,
      });

      setUsers(data.users);

      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  };
  const handleUpdate = () => {
    setAlertModal({
      isOpen: true,
      title: "Update User",
      message: "Are you sure you want to save these changes?",
      type: "warning",
      showCancel: true,

      onConfirm: async () => {
        setAlertModal((prev) => ({
          ...prev,
          isOpen: false,
        }));

        try {
          await updateAdminUser(token, editingUser._id, formData);

          setEditingUser(null);

          setFormData({
            name: "",
            email: "",
            role: "customer",
            isActive: true,
          });

          fetchUsers();

          showSuccess("User updated successfully.")
        } catch (error) {
          console.log(error);

          showError("Failed to update user")
        }
      },
    });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUser(true);
  };

  const closeUserModel = () => {
    setSelectedUser(null);
    setShowUser(false);
  };

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <h1>Users</h1>

        <p>Manage customer and admin accounts</p>
      </div>

      {/* SEARCH */}

      <div className="admin-users-filters">
        <input
          className="admin-users-search"
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* TABLE */}

      {loading ? (
        <div className="users-loading">Loading...</div>
      ) : (
        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>

                  <td>
                    <span
                      className={`user-status ${
                        user.isActive ? "active" : "inactive"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="view-btn"
                        onClick={() => handleViewUser(user)}
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}

      <div className="admin-users-pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          <FaAngleDoubleLeft />
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <FaAngleDoubleRight />
        </button>
      </div>

      {/* MODAL */}

      {editingUser && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <h2>Edit User</h2>

            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Name"
            />

            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="Email"
            />

            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                })
              }
            >
              <option value="customer">Customer</option>

              <option value="admin">Admin</option>
            </select>

            <select
              value={formData.isActive}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>

              <option value="false">Inactive</option>
            </select>

            <div className="edit-modal-actions">
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUser && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={closeUserModel} />
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        showCancel={alertModal.showCancel}
        onConfirm={alertModal.onConfirm}
        onClose={() =>
          setAlertModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
    </div>
  );
};

export default AdminUsers;
