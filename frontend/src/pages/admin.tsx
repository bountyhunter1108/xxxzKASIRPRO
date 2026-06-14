import React, { useState } from 'react';
import { AIChatbot } from '../components/AIChatbot';
import { User } from '../types';

export const AdminPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: 'u1',
      name: 'Pemilik (Owner)',
      email: 'ownerpos@pos.com',
      role: 'owner',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-06-13T20:16:00Z'
    },
    {
      id: 'u2',
      name: 'Admin Gudang',
      email: 'admingd@pos.com',
      role: 'admin',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-05-02T00:00:00Z',
      updatedAt: '2026-06-11T14:30:00Z'
    },
    {
      id: 'u3',
      name: 'Admin Keuangan',
      email: 'adminfin@pos.com',
      role: 'keuangan',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-05-03T00:00:00Z',
      updatedAt: '2026-06-05T09:12:00Z'
    },
    {
      id: 'u4',
      name: 'Admin Operasional',
      email: 'adminops@pos.com',
      role: 'supervisor',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-05-04T00:00:00Z',
      updatedAt: '2026-06-05T10:15:00Z'
    },
    {
      id: 'u5',
      name: 'Admin Personalia',
      email: 'adminhr@pos.com',
      role: 'supervisor',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-05-05T00:00:00Z',
      updatedAt: '2026-06-07T11:45:00Z'
    },
    {
      id: 'u6',
      name: 'Admin Sales & Marketing',
      email: 'adminmkt@pos.com',
      role: 'manager',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-05-06T00:00:00Z',
      updatedAt: '2026-06-10T16:20:00Z'
    },
    {
      id: 'u7',
      name: 'kasir',
      email: 'kasir@pos.com',
      role: 'kasir',
      active: true,
      entryStatus: 'entered',
      lastActive: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      createdAt: '2026-05-07T00:00:00Z',
      updatedAt: '2026-06-13T19:58:00Z'
    }
  ]);

  const [activeMenu, setActiveMenu] = useState('Pengguna');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200/50';
      case 'admin':
        return 'bg-violet-50 text-violet-600 border-violet-200/50';
      case 'keuangan':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/50';
      case 'manager':
        return 'bg-orange-50 text-orange-600 border-orange-200/50';
      case 'supervisor':
        return 'bg-teal-50 text-teal-600 border-teal-200/50';
      case 'kasir':
        return 'bg-sky-50 text-sky-600 border-sky-200/50';
      case 'dapur':
        return 'bg-amber-50 text-amber-600 border-amber-200/50';
      default:
        return 'bg-zinc-50 text-zinc-600 border-zinc-200/50';
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Section */}
      <aside className="w-64 bg-zinc-900 text-zinc-400 flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-650 flex items-center justify-center text-white font-bold text-lg">S</div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-wide">SMILE POS</h1>
            <p className="text-[10px] text-zinc-500 font-medium">Enterprise Edition</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { name: 'Dashboard Owner', icon: '📊' },
            { name: 'Kasir POS', icon: '🖥️' },
            { name: 'Produk', icon: '📦' },
            { name: 'Laporan', icon: '📈' },
            { name: 'Pengguna', icon: '👥' },
            { name: 'Pengadaan', icon: '🛒' }
          ].map(item => {
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-650 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] ring-1 ring-indigo-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">PE</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-zinc-200 truncate">Pemilik (Owner)</h4>
            <p className="text-[10px] text-zinc-500 truncate">ownerpos@pos.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-[10px] text-sky-600 font-bold border border-sky-100">
              Sync Aktif
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>📅 Sabtu, 13 Juni 2026, 20.20.10</span>
          </div>
        </header>

        {/* Content Box */}
        <div className="p-8">
          <div className="bg-white rounded-3xl border border-slate-150/70 p-6 shadow-xs">
            {/* Search and Filter Row */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="relative w-96 max-w-full">
                <input
                  type="text"
                  placeholder="Cari nama, email, atau role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-slate-50 px-4 py-3 pl-10 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs">🔍</span>
              </div>

              <button className="px-5 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-xs transition cursor-pointer">
                + Tambah Pengguna
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="pb-4 pl-4">Pengguna</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Terakhir Update</th>
                    <th className="pb-4 pr-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 pl-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-150 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(user.role)}`}>
                          {capitalize(user.role)}
                        </span>
                      </td>
                      <td className="py-4">
                        {user.active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-500">
                        {new Date(user.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition cursor-pointer" title="Log Aktivitas">📜</button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition cursor-pointer" title="Ambil Foto">📷</button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition cursor-pointer" title="Edit Pengguna">✏️</button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition cursor-pointer" title="Bypass Shift">🔗</button>
                          <button className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer" title="Hapus Akun">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Upgraded AI Chatbot component */}
      <AIChatbot appState={{ user: { id: 'u1', name: 'Pemilik (Owner)', role: 'owner' } }} />
    </div>
  );
};

export default AdminPage;