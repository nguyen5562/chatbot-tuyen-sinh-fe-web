import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faTrash, faUserPlus, faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../Toast/ToastProvider';

const sampleUsers = [
  { id: '1', username: 'admin', fullname: 'System admin', role: 'admin' },
  { id: '2', username: 'user', fullname: 'Người dùng', role: 'user' },
  { id: '3', username: 'user2', fullname: 'User2', role: 'user' },
  { id: '4', username: 'nguyen', fullname: 'Nguyễn Khôi Nguyên', role: 'user' },
];

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const UserManager: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState(sampleUsers);
  const [newUser, setNewUser] = useState({ username: '', fullname: '', role: 'user' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState({ username: '', fullname: '', role: 'user' });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.fullname.trim()) return;
    setUsers(prev => [...prev, { id: Date.now().toString(), ...newUser }]);
    setNewUser({ username: '', fullname: '', role: 'user' });
    setShowAdd(false);
    showToast('Thêm người dùng thành công!', 'success');
  };
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Xóa người dùng thành công!', 'success');
  };
  const handleEditUser = (user: { id: string; username: string; fullname: string; role: string }) => {
    setEditId(user.id);
    setEditUser({ username: user.username, fullname: user.fullname, role: user.role });
  };
  const handleSaveEdit = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...editUser } : u));
    setEditId(null);
    showToast('Cập nhật người dùng thành công!', 'success');
  };

  const filteredUsers = useMemo(() => {
    let data = users;
    if (roleFilter) data = data.filter(u => u.role === roleFilter);
    if (search) data = data.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.fullname.toLowerCase().includes(search.toLowerCase()));
    return data;
  }, [users, roleFilter, search]);
  const totalPage = Math.ceil(filteredUsers.length / pageSize) || 1;
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-semibold text-base"
          onClick={() => setShowAdd(v => !v)}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Thêm người dùng
        </button>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-10 pr-3 py-2 border rounded bg-white min-w-[200px]"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border rounded px-3 py-2 min-w-[160px]"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">Lọc theo vai trò</option>
            <option value="admin">System Admin</option>
            <option value="user">Người dùng</option>
          </select>
        </div>
      </div>
      {showAdd && (
        <form onSubmit={handleAddUser} className="flex gap-3 mb-6 bg-blue-50 p-4 rounded-xl shadow">
          <input
            className="flex-1 border rounded px-3 py-2"
            type="text"
            placeholder="Họ tên"
            value={newUser.fullname}
            onChange={e => setNewUser(u => ({ ...u, fullname: e.target.value }))}
          />
          <input
            className="flex-1 border rounded px-3 py-2"
            type="text"
            placeholder="Tài khoản"
            value={newUser.username}
            onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
          />
          <select
            className="border rounded px-3 py-2"
            value={newUser.role}
            onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
          >
            <option value="user">Người dùng</option>
            <option value="admin">System Admin</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
            <FontAwesomeIcon icon={faUserPlus} /> Thêm
          </button>
        </form>
      )}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full text-base">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">STT</th>
              <th className="py-3 px-4 text-left">Họ tên</th>
              <th className="py-3 px-4 text-left">Tài khoản</th>
              <th className="py-3 px-4 text-left">Vai trò</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((u, idx) => (
              <tr key={u.id} className="border-b last:border-b-0 hover:bg-blue-50">
                <td className="py-3 px-4">{(page - 1) * pageSize + idx + 1}</td>
                <td className="py-3 px-4">
                  {editId === u.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editUser.fullname}
                      onChange={e => setEditUser(eu => ({ ...eu, fullname: e.target.value }))}
                    />
                  ) : (
                    u.fullname
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === u.id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={editUser.username}
                      onChange={e => setEditUser(eu => ({ ...eu, username: e.target.value }))}
                    />
                  ) : (
                    u.username
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === u.id ? (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={editUser.role}
                      onChange={e => setEditUser(eu => ({ ...eu, role: e.target.value }))}
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">System Admin</option>
                    </select>
                  ) : (
                    u.role === 'admin' ? 'System Admin' : 'Người dùng'
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {editId === u.id ? (
                    <>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2" onClick={() => handleSaveEdit(u.id)}>
                        Lưu
                      </button>
                      <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400" onClick={() => setEditId(null)}>
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mr-2" onClick={() => handleEditUser(u)}>
                        <FontAwesomeIcon icon={faUserEdit} /> Sửa
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2" onClick={() => handleDeleteUser(u.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Xoá
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {pagedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">Không có người dùng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-2 text-base">
        <div>
          Số dòng trên mỗi trang:
          <select
            className="border rounded px-2 py-1 ml-2"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-blue-100 disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span>Trang {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filteredUsers.length)} của {filteredUsers.length}</span>
          <button
            className="p-2 rounded hover:bg-blue-100 disabled:opacity-50"
            disabled={page === totalPage}
            onClick={() => setPage(p => Math.min(totalPage, p + 1))}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManager; 