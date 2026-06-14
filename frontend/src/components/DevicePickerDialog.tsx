import React, { useState } from 'react';

interface PrinterOption {
  id: string;
  name: string;
  type: 'USB' | 'Bluetooth' | 'LAN';
  status: 'online' | 'offline';
  address?: string;
}

export const DevicePickerDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [printers, setPrinters] = useState<PrinterOption[]>([
    { id: 'p1', name: 'GP-5890x Series (Default)', type: 'USB', status: 'online' },
    { id: 'p2', name: 'EPSON TM-T82 Bluetooth', type: 'Bluetooth', status: 'online', address: '00:11:22:33:FF:EE' },
    { id: 'p3', name: 'Kitchen LAN Printer', type: 'LAN', status: 'offline', address: '192.168.1.100' }
  ]);

  const [selectedId, setSelectedId] = useState('p1');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      alert('Pencarian perangkat selesai! Tidak ada printer thermal baru yang ditemukan.');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900/60 flex items-center justify-center p-4">
      <div className="bg-white w-[400px] rounded-[32px] p-6 shadow-2xl border border-slate-100 flex flex-col text-left font-sans animate-[scaleUp_0.25s_ease-out]">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Koneksi Perangkat Printer</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pilih printer thermal dan konfigurasi laci kasir</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full cursor-pointer"
          >
            ❌
          </button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto mb-6 max-h-60 pr-1">
          {printers.map((pr) => {
            const isSelected = selectedId === pr.id;
            return (
              <div
                key={pr.id}
                onClick={() => setSelectedId(pr.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50/30' 
                    : 'border-slate-150 hover:border-slate-300'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{pr.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Metode: {pr.type} {pr.address ? `• ${pr.address}` : ''}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase ${
                  pr.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {pr.status}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex-1 py-3 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {isSearching ? 'Mencari...' : 'Cari Perangkat'}
          </button>
          <button
            onClick={() => {
              alert('Printer Berhasil Terkoneksi!');
              onClose();
            }}
            className="flex-1 py-3 text-white bg-indigo-650 hover:bg-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Hubungkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevicePickerDialog;