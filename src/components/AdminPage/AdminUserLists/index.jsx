import React, { useEffect, useState, useContext } from "react";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import toast from "react-hot-toast";

const Index = () => {
  const { loading, apiRequest } = useContext(AuthApi);
  const [users, setUsers] = useState([]);

  // ✅ Fetch semua user
  const fetchUsers = async () => {
    try {
      const response = await apiRequest('admin/users', 'GET'); // auto token admin
      setUsers(response.data); // ✅ Ambil array-nya langsung
    } catch (error) {
      console.error(error.response);
      toast.error("Gagal mengambil data user");
    }
  };

  // ✅ Hapus user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    try {
      await apiRequest(`admin/users/${id}`, 'DELETE');
      toast.success("User berhasil dihapus");
      fetchUsers(); // Refresh list user
    } catch (error) {
      console.error(error.response);
      toast.error("Gagal menghapus user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Dashboard Admin 👑
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg table-auto rounded-xl">
          <thead>
            <tr className="text-white bg-purple-500">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="text-center border-b">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  Tidak ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
