import React, { useState } from 'react';
import { AIChatbot } from '../components/AIChatbot';

export const OwnerPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard Owner');
  
  // Mock Data for Owner Dashboard
  const stats = [
    { title: 'Omset Hari Ini', value: 'Rp 2.450.000', change: '+12.5%', isPositive: true },
    { title: 'Transaksi Berhasil', value: '38 Transaksi', change: '+4.2%', isPositive: true },
    { title: 'Laba Bersih', value: 'Rp 1.120.000', change: '+15.1%', isPositive: true },
    { title: 'Produk Terjual', value: '142 Item', change: '-2.4%', isPositive: false }
  ];

  const recentTransactions = [
    { id: 'TX-9402', time: '19.45', cashier: 'kasir', total: 46000, status: 'Lunas', method: 'QRIS' },
    { id: 'TX-9401', time: '19.30', cashier: 'kasir', total: 125000, status: 'Lunas', method: 'Tunai' },
    { id: 'TX-9400', time: '18.55', cashier: 'kasir', total: 60000, status: 'Lunas', method: 'QRIS' },
    { id: 'TX-9399', time: '18.15', cashier: 'kasir', total: 18000, status: 'Dibatalkan', method: 'Tunai' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
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

      {/* Main Panel View */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Dashboard Bisnis Owner</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse"></span>
              Koneksi Jaringan Stabil
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>📅 Sabtu, 13 Juni 2026, 20.21.32</span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-150/70 shadow-2xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.title}</p>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">{stat.value}</h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${
                  stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {stat.change} dari kemarin
                </span>
              </div>
            ))}
          </div>

          {/* Core Analytics Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart Mockup */}
            <div className="bg-white rounded-3xl p-6 border border-slate-150/70 lg:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-4">Grafik Penjualan Mingguan</h4>
                <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-semibold text-xs">
                  Chart.js Render (Revenue & Laba Bersih)
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-650"></span>Omset</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Laba</span>
              </div>
            </div>

            {/* Popular Items list */}
            <div className="bg-white rounded-3xl p-6 border border-slate-150/70 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-4">5 Menu Terlaris</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Kopi Susu Gula Aren', count: 48, pct: '75%' },
                    { name: 'Roti Bakar Cokelat Keju', count: 32, pct: '50%' },
                    { name: 'Es Teh Manis Jumbo', count: 24, pct: '38%' },
                    { name: 'Indomie Goreng Double Telur', count: 18, pct: '28%' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{item.name}</span>
                        <span>{item.count} Porsi</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: item.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-150/70">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-4">Transaksi Terakhir Hari Ini</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="pb-3 pl-2">ID Transaksi</th>
                    <th className="pb-3">Waktu</th>
                    <th className="pb-3">Kasir</th>
                    <th className="pb-3">Metode</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="text-xs font-semibold text-slate-600">
                      <td className="py-3.5 pl-2 font-bold text-slate-800">{tx.id}</td>
                      <td className="py-3.5">{tx.time}</td>
                      <td className="py-3.5">{tx.cashier}</td>
                      <td className="py-3.5">{tx.method}</td>
                      <td className="py-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                          tx.status === 'Lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2 font-bold text-indigo-600">Rp {tx.total.toLocaleString('id-ID')}</td>
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

export default OwnerPage;