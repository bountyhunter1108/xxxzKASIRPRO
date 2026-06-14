import React, { useState } from 'react';
import { AIChatbot } from '../components/AIChatbot';

interface KitchenOrder {
  id: string;
  txId: string;
  time: string;
  items: { name: string; qty: number; note?: string }[];
  status: 'pending' | 'preparing' | 'completed';
}

export const DapurPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Kasir POS');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: 'K-01',
      txId: 'TX-9402',
      time: '19.45',
      items: [
        { name: 'Kopi Susu Gula Aren', qty: 2, note: 'Less sugar, extra ice' },
        { name: 'Roti Bakar Cokelat Keju', qty: 1 }
      ],
      status: 'preparing'
    },
    {
      id: 'K-02',
      txId: 'TX-9403',
      time: '19.48',
      items: [
        { name: 'Indomie Goreng Double Telur', qty: 1, note: 'Pedas sedang' },
        { name: 'Es Teh Manis Jumbo', qty: 1 }
      ],
      status: 'pending'
    }
  ]);

  const updateOrderStatus = (id: string, nextStatus: 'preparing' | 'completed') => {
    setOrders(prev => 
      prev.map(o => o.id === id ? { ...o, status: nextStatus } : o)
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
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
          <div className="w-10 h-10 rounded-full bg-zinc-850 flex items-center justify-center text-white font-bold text-sm">DA</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-zinc-200 truncate">Kasir Dapur</h4>
            <p className="text-[10px] text-zinc-500 truncate">dapur@pos.com</p>
          </div>
        </div>
      </aside>

      {/* Main Panel View */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Antrian Pesanan Dapur</h2>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}
            >
              🔊 Notifikasi Suara: {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>📅 Sabtu, 13 Juni 2026, 20.21.32</span>
          </div>
        </header>

        {/* Kitchen Orders Grid */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Antrian Aktif ({orders.filter(o => o.status !== 'completed').length} Order)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
              if (order.status === 'completed') return null;
              return (
                <div 
                  key={order.id} 
                  className={`bg-white rounded-3xl p-6 border shadow-2xs flex flex-col justify-between ${
                    order.status === 'preparing' ? 'border-indigo-400 ring-1 ring-indigo-50/50' : 'border-slate-150/70'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50">
                      <div>
                        <span className="text-[11px] font-extrabold text-slate-850 block">ANTRIAN {order.id}</span>
                        <span className="text-[9px] font-semibold text-slate-400 mt-0.5">{order.txId} • Waktu {order.time}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        order.status === 'preparing' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status === 'preparing' ? 'Sedang Dibuat' : 'Menunggu'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{item.name}</span>
                            <span>x {item.qty}</span>
                          </div>
                          {item.note && (
                            <p className="text-[10px] text-amber-600 font-semibold bg-amber-50/50 px-2 py-1 rounded-lg mt-1">
                              📝 Catatan: {item.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 pt-4 border-t border-slate-50">
                    {order.status === 'pending' ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Mulai Siapkan
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Selesai Siapkan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Upgraded AI Chatbot component */}
      <AIChatbot appState={{ user: { id: 'u8', name: 'kasir dapur', role: 'dapur' } }} />
    </div>
  );
};

export default DapurPage;