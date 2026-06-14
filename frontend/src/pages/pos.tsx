import React, { useState } from 'react';
import { AIChatbot } from '../components/AIChatbot';
import { Product, Transaction } from '../types';

export const PosPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('Kasir POS');
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p1',
      sku: 'SKU001',
      name: 'Kopi Susu Gula Aren',
      category: 'Minuman',
      cost: 8000,
      price: 18000,
      stock: 45,
      minStock: 10,
      taxIncluded: true,
      openPrice: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'p2',
      sku: 'SKU002',
      name: 'Roti Bakar Cokelat Keju',
      category: 'Makanan',
      cost: 10000,
      price: 22000,
      stock: 20,
      minStock: 5,
      taxIncluded: true,
      openPrice: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'p3',
      sku: 'SKU003',
      name: 'Indomie Goreng Double Telur',
      category: 'Makanan',
      cost: 7000,
      price: 15000,
      stock: 6,
      minStock: 8, // Low stock warning!
      taxIncluded: true,
      openPrice: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'p4',
      sku: 'SKU004',
      name: 'Es Teh Manis Jumbo',
      category: 'Minuman',
      cost: 1500,
      price: 6000,
      stock: 120,
      minStock: 15,
      taxIncluded: true,
      openPrice: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as any
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = 0; // Simulated member discount or loyalty points deduction
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal - discount + tax;

  const filteredProducts = products.filter(p => 
    p.active && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          <div className="w-10 h-10 rounded-full bg-zinc-850 flex items-center justify-center text-white font-bold text-sm">KA</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-zinc-200 truncate">Sesi Kasir</h4>
            <p className="text-[10px] text-zinc-500 truncate">kasir@pos.com</p>
          </div>
        </div>
      </aside>

      {/* Main Catalog View */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header Widget */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Kasir Point-of-Sale</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse"></span>
              Online
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-[10px] text-indigo-600 font-bold border border-indigo-100">
              ☕ Shift Terbuka (Modal: Rp 150.000)
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>📅 Sabtu, 13 Juni 2026, 20.21.32</span>
          </div>
        </header>

        {/* Catalog Search & Product Grid */}
        <div className="flex-1 p-8 flex flex-col min-h-0 overflow-y-auto">
          <div className="mb-6 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="relative w-96 max-w-full">
              <input
                type="text"
                placeholder="Cari menu makanan, minuman, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold text-slate-700 bg-white px-4 py-3 pl-10 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs">🔍</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-3 py-1.5 rounded-xl">Semua</span>
              <span className="text-xs font-semibold text-slate-500 hover:bg-slate-200/30 px-3 py-1.5 rounded-xl cursor-pointer">Makanan</span>
              <span className="text-xs font-semibold text-slate-500 hover:bg-slate-200/30 px-3 py-1.5 rounded-xl cursor-pointer">Minuman</span>
            </div>
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => {
              const isLowStock = p.stock <= p.minStock;
              return (
                <div 
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`bg-white rounded-3xl border border-slate-150/70 p-5 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isLowStock ? 'ring-1 ring-amber-400/20' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{p.category}</span>
                      {isLowStock && (
                        <span className="bg-amber-50 border border-amber-100 text-amber-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md animate-pulse">
                          Stok Menipis
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 mb-1 leading-snug">{p.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mb-2">SKU: {p.sku}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-50">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block mb-0.5">HARGA</span>
                      <span className="text-xs font-extrabold text-indigo-600">Rp {p.price.toLocaleString('id-ID')}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                      Sisa: {p.stock}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Shopping Cart Section on the Right */}
      <aside className="w-96 bg-white border-l border-slate-150 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Keranjang Belanja</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cart.length} item unik dipilih</p>
          </div>
          <button 
            onClick={clearCart}
            className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
          >
            Kosongkan
          </button>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scroll">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <span className="text-3xl mb-2">🛒</span>
              <p className="text-xs font-bold">Keranjang masih kosong</p>
              <p className="text-[10px] text-slate-400 mt-1">Klik item menu di samping untuk menambahkan.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Rp {item.product.price.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-1.5 py-1">
                  <button 
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-bold text-slate-700 min-w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary Footer */}
        <div className="p-6 border-t border-slate-150 bg-slate-50/50 flex-shrink-0">
          <div className="space-y-2.5 text-xs font-semibold text-slate-500 mb-5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%)</span>
              <span className="text-slate-700">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-150 font-bold text-sm text-slate-800">
              <span>Total Tagihan</span>
              <span className="text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {(['cash', 'qris', 'transfer'] as const).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 rounded-xl text-[10px] font-extrabold uppercase border transition cursor-pointer ${
                  paymentMethod === method
                    ? 'bg-indigo-650 text-white border-indigo-600 shadow-3xs'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <button
            onClick={() => cart.length > 0 && setShowCheckoutModal(true)}
            disabled={cart.length === 0}
            className={`w-full py-4 text-white text-xs font-bold rounded-2xl shadow-xs transition duration-200 ${
              cart.length > 0 ? 'bg-indigo-650 hover:bg-indigo-700 cursor-pointer' : 'bg-slate-350 cursor-not-allowed'
            }`}
          >
            PROSES PEMBAYARAN
          </button>
        </div>
      </aside>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-[400px] rounded-[32px] p-6 shadow-2xl border border-slate-100 flex flex-col text-left font-sans animate-[scaleUp_0.25s_ease-out]">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wider">Metode Pembayaran: {paymentMethod.toUpperCase()}</h3>
            
            {paymentMethod === 'cash' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Uang Tunai Diterima</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Masukkan jumlah pembayaran..."
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                {Number(cashAmount) >= total && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center text-xs font-bold text-emerald-800">
                    <span>Kembalian</span>
                    <span>Rp {(Number(cashAmount) - total).toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center space-y-4 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-500">Scan QRIS Dinamis berikut:</span>
                <div className="w-40 h-40 bg-zinc-200 border-4 border-white shadow-2xs flex items-center justify-center font-bold text-sm">
                  QR CODE SCANNER
                </div>
                <span className="text-xs font-bold text-indigo-650">Nominal: Rp {total.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert('Transaksi Berhasil Disimpan!');
                  clearCart();
                  setShowCheckoutModal(false);
                  setCashAmount('');
                }}
                disabled={paymentMethod === 'cash' && Number(cashAmount) < total}
                className={`flex-1 py-3 text-white rounded-xl text-xs font-bold transition ${
                  paymentMethod === 'cash' && Number(cashAmount) < total 
                    ? 'bg-slate-350 cursor-not-allowed' 
                    : 'bg-indigo-650 hover:bg-indigo-700 cursor-pointer'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgraded AI Chatbot component */}
      <AIChatbot appState={{ user: { id: 'u7', name: 'kasir', role: 'kasir' }, clearCart }} />
    </div>
  );
};

export default PosPage;