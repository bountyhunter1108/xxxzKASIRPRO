// TSX React Chatbot Component - Upgraded AI reasoning logic
import React, { useState, useEffect, useRef } from 'react';

// Inline Icon component to avoid external dependency issues
const Icon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 16, className = '' }) => {
  const sizeStyle = { width: size, height: size };
  switch (name) {
    case 'clock':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'plus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'x':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'trash':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      );
    case 'edit-2':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    case 'send':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case 'message-square':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={sizeStyle} className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
};

const DB_KEY = 'smile_pos_db';
const getDB = (): any => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  } catch (e) {
    return {};
  }
};

const saveDB = (db: any): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {}
};

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string | Date;
  edited?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export const AIChatbot: React.FC<{ appState: any }> = ({ appState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<number, boolean>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const welcomeMsg: Message = { 
    id: 1, 
    sender: 'bot', 
    text: 'Halo! Saya AI Smile POS Assistant. Ada yang bisa saya bantu hari ini seputar penggunaan sistem atau kendala operasional toko?', 
    timestamp: new Date().toISOString() 
  };
  
  const [messages, setMessages] = useState<Message[]>([welcomeMsg]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const getChatSessions = (): ChatSession[] => {
    const db = getDB();
    return (db.chatHistory || []).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const saveCurrentSession = (msgs: Message[]) => {
    if (!msgs || msgs.length <= 1) return;
    const db = getDB();
    db.chatHistory = db.chatHistory || [];
    const sessionId = activeSessionId || ('chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
    const userMsgs = msgs.filter(m => m.sender === 'user');
    const title = userMsgs.length > 0 ? userMsgs[0].text.slice(0, 50) : 'Sesi Chat Baru';
    const existingIdx = db.chatHistory.findIndex((s: any) => s.id === sessionId);
    
    const sessionData: ChatSession = {
      id: sessionId,
      title: title,
      messages: msgs.map(m => ({ 
        ...m, 
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp 
      })),
      createdAt: existingIdx >= 0 ? db.chatHistory[existingIdx].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: msgs.length
    };

    if (existingIdx >= 0) {
      db.chatHistory[existingIdx] = sessionData;
    } else {
      db.chatHistory.unshift(sessionData);
    }
    if (db.chatHistory.length > 100) db.chatHistory = db.chatHistory.slice(0, 100);
    saveDB(db);
    if (!activeSessionId) setActiveSessionId(sessionId);
    return sessionId;
  };

  const loadSession = (sessionId: string) => {
    const db = getDB();
    const session = (db.chatHistory || []).find((s: any) => s.id === sessionId);
    if (session) {
      const restored = session.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      setMessages(restored);
      setActiveSessionId(sessionId);
      setShowHistory(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    const db = getDB();
    db.chatHistory = (db.chatHistory || []).filter((s: any) => s.id !== sessionId);
    saveDB(db);
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([welcomeMsg]);
    }
  };

  const startNewChat = () => {
    if (messages.length > 1) saveCurrentSession(messages);
    setActiveSessionId(null);
    setMessages([welcomeMsg]);
    setShowHistory(false);
  };

  const deleteMessage = (msgId: number) => {
    setMessages(prev => {
      const updated = prev.filter(m => m.id !== msgId);
      if (activeSessionId && updated.length > 1) {
        setTimeout(() => saveCurrentSession(updated), 50);
      }
      return updated;
    });
  };

  const startEditMessage = (msg: Message) => {
    setEditingMsgId(msg.id);
    setEditText(msg.text);
  };

  const confirmEditMessage = () => {
    if (!editText.trim() || editingMsgId === null) return;
    setMessages(prev => {
      const msgIdx = prev.findIndex(m => m.id === editingMsgId);
      if (msgIdx < 0) return prev;
      const updated = prev.slice(0, msgIdx);
      const editedMsg: Message = { ...prev[msgIdx], text: editText.trim(), edited: true };
      updated.push(editedMsg);
      
      if (editedMsg.sender === 'user') {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const replyText = getAIResponse(editedMsg.text);
            const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: replyText, timestamp: new Date().toISOString() };
            setIsTyping(false);
            setMessages(p => {
              const newMsgs = [...p, botMsg];
              setTimeout(() => saveCurrentSession(newMsgs), 50);
              return newMsgs;
            });
          }, 400);
        }, 50);
      }
      return updated;
    });
    setEditingMsgId(null);
    setEditText('');
  };

  const quickQuestions = [
    "Cara masuk Mode Panik?",
    "Bagaimana koneksi printer?",
    "Apa itu Buka/Tutup Shift?",
    "Solusi stok menipis?",
    "Cek omset hari ini",
    "Daftar perintah AI"
  ];

  const getAIResponse = (query: string): string => {
    const text = query.toLowerCase().trim();
    const db = getDB();
    
    const formatReply = (thought: string, reply: string) => `<thought>${thought}</thought>\n${reply}`;

    const generateThought = (steps: string[]) => {
      return [
        `[Intent Analysis] User asks: "${query}"`,
        `[Core Entity Classification] Classifying core operational entities in POS database.`,
        ...steps,
        `[Compiling Response] Formulating highly professional, step-by-step Indonesian operational guide.`
      ].join('\n');
    };

    // General Math Solver
    if (/^[\d\s+\-*/().%]+$/.test(text.replace(/[a-z]/g, '')) && (text.includes('+') || text.includes('-') || text.includes('*') || text.includes('/') || text.includes('%'))) {
      try {
        const expr = text.replace(/[^0-9+\-*/().%]/g, '').replace(/%/g, '/100');
        const result = Function(`"use strict"; return (${expr})`)();
        return formatReply(
          generateThought([
            `[Mathematical Solver] Detected math expression: "${expr}"`,
            `[Execution] Evaluating expression safely using browser JS VM context.`,
            `[Result] Computed value: ${result}`
          ]),
          `🔢 **Hasil Perhitungan Matematika**:\n\nHasil dari \`${query}\` adalah **${result.toLocaleString('id-ID')}**.\n\nJika ini berkaitan dengan margin keuntungan, HPP, atau diskon belanja, Anda dapat memasukkan nilai tersebut langsung ke kolom transaksi.`
        );
      } catch (e) {}
    }

    // Business Logic Solver (Margin, markup)
    if (text.includes('laba') || text.includes('margin') || text.includes('keuntungan')) {
      if (text.includes('cara hitung') || text.includes('rumus')) {
        return formatReply(
          generateThought([
            `[Accounting Solver] Requesting profit margin / markup formula.`,
            `[Lookup] Retrieving financial accounting standards.`
          ]),
          `📈 **Rumus & Perhitungan Keuntungan Toko**:\n\n` +
          `1. **Laba Kotor** = Harga Jual - Harga Modal (HPP)\n` +
          `2. **Persentase Margin Laba** = (Laba Kotor / Harga Jual) x 100%\n` +
          `3. **Markup Persen** = (Laba Kotor / Harga Modal) x 100%\n\n` +
          `*Contoh*: Jika modal barang Rp 10.000 dan dijual Rp 15.000:\n` +
          `- Laba Kotor = Rp 5.000\n` +
          `- Margin Laba = (5.000 / 15.000) x 100% = **33.33%**\n` +
          `- Markup = (5.000 / 10.000) x 100% = **50%**`
        );
      }
    }

    // 1. ACTION COMMANDS
    if (text.includes('masuk mode panik') || text.includes('mode panik') || text.includes('darurat') || text.includes('kalkulator darurat')) {
      setTimeout(() => { if (appState.setIsPanicMode) appState.setIsPanicMode(true); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] User triggered emergency panic mode disguise.`,
          `[Call] Invoking appState.setIsPanicMode(true).`
        ]),
        "🚨 **Siaga!** Saya telah mengaktifkan **Mode Panik (Kalkulator Darurat)** secara instan. Layar kasir Anda telah disamarkan.\n\n*Petunjuk Penyamaran*:\n- Gunakan kalkulator seperti biasa untuk bertransaksi palsu di depan orang yang mencurigakan.\n- Ketik kode rahasia **911** lalu tekan tombol **=** (sama dengan) pada kalkulator untuk kembali ke sistem utama."
      );
    }
    if (text.includes('tutup shift') || text.includes('jalankan tutup shift')) {
      setTimeout(() => { if (appState.setShowTutupShiftModal) appState.setShowTutupShiftModal(true); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Initiating closing shift audit sequence.`,
          `[Call] Invoking appState.setShowTutupShiftModal(true).`
        ]),
        "🔒 **Alur Tutup Shift Kasir Dimulai**\n\nSaya telah membuka jendela **Audit & Penutupan Shift**.\nSilakan hitung uang fisik di laci kas Anda, lalu masukkan jumlahnya di form yang telah disediakan untuk melihat analisis selisih kas."
      );
    }
    if (text.includes('sinkron database') || text.includes('sync database') || text.includes('sinkronisasi') || text.includes('singkron')) {
      setTimeout(() => { if (appState.setShowSyncModal) appState.setShowSyncModal(true); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Accessing Supabase real-time cloud synchronization.`,
          `[Call] Invoking appState.setShowSyncModal(true).`
        ]),
        "☁️ **Penyelarasan Cloud Database**\n\nJendela sinkronisasi cloud database **Supabase** telah dibuka. Di sini Anda dapat memantau status jaringan, melakukan push/pull manual, dan menyinkronkan data offline localStorage Anda."
      );
    }
    if (text.includes('kosongkan keranjang') || text.includes('bersihkan keranjang')) {
      setTimeout(() => { if (appState.clearCart) appState.clearCart(); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Clearing active shopping cart data.`,
          `[Call] Invoking appState.clearCart().`
        ]),
        "🛒 **Keranjang Dikosongkan**\n\nSeluruh item belanjaan di keranjang kasir telah berhasil dibersihkan. Anda siap memulai transaksi baru."
      );
    }
    if (text.includes('kunci layar') || text.includes('lock screen')) {
      setTimeout(() => { if (appState.lockScreen) appState.lockScreen(); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Locking the POS system interface.`,
          `[Call] Invoking appState.lockScreen().`
        ]),
        "🔐 **Sistem Dikunci**\n\nLayar kasir Anda telah berhasil dikunci untuk mengamankan sesi aktif Anda. Silakan masukkan password akun Anda untuk membuka kunci kembali."
      );
    }
    if (text.includes('buka laporan')) {
      setTimeout(() => { if (appState.setPage) appState.setPage('reports'); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Redirecting to reports dashboard.`,
          `[Call] Invoking appState.setPage('reports').`
        ]),
        "📈 **Navigasi Sukses!** Anda dialihkan ke halaman **Laporan & Analitik Keuangan**."
      );
    }
    if (text.includes('buka produk')) {
      setTimeout(() => { if (appState.setPage) appState.setPage('products'); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Redirecting to inventory catalog.`,
          `[Call] Invoking appState.setPage('products').`
        ]),
        "📦 **Navigasi Sukses!** Anda dialihkan ke halaman **Manajemen Inventaris Produk**."
      );
    }
    if (text.includes('buka kasir') || text.includes('buka pos')) {
      setTimeout(() => { if (appState.setPage) appState.setPage('pos'); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Redirecting to POS checkout screen.`,
          `[Call] Invoking appState.setPage('pos').`
        ]),
        "🖥️ **Navigasi Sukses!** Anda dialihkan ke halaman utama **Kasir POS**."
      );
    }
    if (text.includes('buka pembelian') || text.includes('buka pengadaan')) {
      setTimeout(() => { if (appState.setPage) appState.setPage('purchases'); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Redirecting to purchases module.`,
          `[Call] Invoking appState.setPage('purchases').`
        ]),
        "🛒 **Navigasi Sukses!** Anda dialihkan ke halaman **Pengadaan Barang (Pembelian)**."
      );
    }
    if (text.includes('buka user') || text.includes('buka akun') || text.includes('buka karyawan')) {
      setTimeout(() => { if (appState.setPage) appState.setPage('users'); }, 50);
      return formatReply(
        generateThought([
          `[Command execution] Redirecting to user management.`,
          `[Call] Invoking appState.setPage('users').`
        ]),
        "👥 **Navigasi Sukses!** Anda dialihkan ke halaman **Manajemen Akun Pengguna & Otoritas**."
      );
    }

    // 2. LIVE QUERY RESPONSES
    if (text.includes('online') || text.includes('siapa saja yang on') || text.includes('user on') || text.includes('siapa yang on')) {
      const now = Date.now();
      const activeUsers = (db.users || []).filter((u: any) => {
        if (u.entryStatus === 'entered') {
          if (u.lastActive) {
            const diff = now - new Date(u.lastActive).getTime();
            return diff < 2 * 60 * 1000;
          }
          return true;
        }
        if (u.lastActive) {
          const diff = now - new Date(u.lastActive).getTime();
          return diff < 2 * 60 * 1000;
        }
        return false;
      });
      const curUser = appState.user;
      if (curUser && !activeUsers.some((u: any) => u.id === curUser.id || u.name === curUser.name)) {
        activeUsers.push({ ...curUser, entryStatus: 'entered' });
      }
      if (activeUsers.length === 0) {
        return formatReply(
          generateThought([`[Lookup] Fetching active sessions.`, `[Status] No users found online.`]),
          "🟢 **Status Pengguna Online**\n\nSaat ini tidak ada pengguna yang terdeteksi online selain sesi Anda."
        );
      }
      const list = activeUsers.map((u: any) => {
        const roleStr = u.role ? u.role.toUpperCase() : 'STAFF';
        const status = u.entryStatus === 'entered' ? 'Aktif (Sedang Membuka Menu)' : 'Aktif Baru-baru Ini';
        return `- **${u.name}** (${roleStr}) - *${status}*`;
      }).join('\n');
      return formatReply(
        generateThought([`[Lookup] Fetching active user sessions.`, `[Result] Found ${activeUsers.length} online.`]),
        `🟢 **Pengguna Sedang Online (${activeUsers.length} Orang)**:\n\n${list}\n\n*Catatan: Status diupdate secara langsung (real-time) berdasarkan sesi aktif saat ini.*`
      );
    }

    if (text.includes('admin') || text.includes('owner') || text.includes('pengelola') || text.includes('user') || text.includes('pengguna') || text.includes('karyawan') || text.includes('staf') || text.includes('staff') || text.includes('siapa kasir')) {
      const userList = db.users || [];
      const list = userList.map((u: any) => `- **${u.name}** (${u.role ? u.role.toUpperCase() : 'STAFF'}) - *${u.active ? 'Aktif' : 'Nonaktif'}*`).join('\n');
      return formatReply(
        generateThought([`[Lookup] Reading user list from database.`, `[Result] Loaded ${userList.length} records.`]),
        `👥 **Daftar Akun Pengguna & Karyawan Toko (${userList.length} Orang)**:\n\n${list || 'Tidak ada pengguna terdaftar.'}`
      );
    }

    if (text.includes('log audit') || text.includes('audit terbaru') || text.includes('log keamanan') || text.includes('aktivitas terbaru')) {
      const logs = (db.auditLogs || []).slice(0, 5);
      if (logs.length === 0) {
        return formatReply(
          generateThought([`[Lookup] Fetching security audit logs.`, `[Result] Empty database.`]),
          "🛡️ **Log Keamanan & Audit**\n\nBelum ada log audit keamanan yang terekam di sistem."
        );
      }
      const list = logs.map((l: any) => {
        const timeStr = new Date(l.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date(l.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return `- **[${dateStr} ${timeStr}]** **${l.user}** (${l.role ? l.role.toUpperCase() : 'STAFF'}): *${l.action}* -> ${l.details}`;
      }).join('\n');
      return formatReply(
        generateThought([`[Lookup] Fetching recent audit logs.`, `[Result] Loaded ${logs.length} items.`]),
        `🛡️ **5 Log Audit & Keamanan Terbaru**:\n\n${list}\n\n*Catatan: Log keamanan dicatat secara otomatis untuk setiap tindakan administratif/sensitif.*`
      );
    }

    if (text.includes('pelanggan terloyal') || text.includes('member terloyal') || text.includes('daftar member') || text.includes('loyalitas')) {
      const membersList = db.members || [];
      if (membersList.length === 0) {
        return formatReply(
          generateThought([`[Lookup] Reading member loyalty base.`, `[Result] Empty.`]),
          "👥 **Program Loyalty & Keanggotaan**\n\nSaat ini belum ada member terdaftar dalam database CRM."
        );
      }
      const sortedMembers = [...membersList].sort((a: any, b: any) => (b.points || 0) - (a.points || 0)).slice(0, 5);
      const list = sortedMembers.map((m: any, i: number) => `${i+1}. **${m.name}** (${m.phone || '-'}) - **${m.points || 0}** Poin`).join('\n');
      return formatReply(
        generateThought([`[Lookup] Reading members.`, `[Sort] Ordering by points descending.`]),
        `👥 **Total Member Terdaftar**: ${membersList.length} orang\n\n🏆 **5 Member Terloyal (Poin Tertinggi)**:\n\n${list}\n\n*Saran*: Tawarkan promo/voucher belanja khusus kepada member terloyal untuk meningkatkan retensi pelanggan.`
      );
    }

    if (text.includes('kasir aktif') || text.includes('shift aktif') || text.includes('petugas kasir')) {
      const activeShift = (db.shifts || []).find((s: any) => s.status === 'open');
      if (activeShift) {
        return formatReply(
          generateThought([`[Lookup] Retrieving active cash register shift.`]),
          `🔑 **Shift Kasir Aktif**:\n\n` +
          `- **Petugas Kasir**: **${activeShift.cashierName}**\n` +
          `- **Mulai Shift**: ${new Date(activeShift.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}\n` +
          `- **Modal Awal**: Rp ${(activeShift.startCash || 0).toLocaleString('id-ID')}\n` +
          `- **Saldo Laci Sekarang**: Rp ${(activeShift.actualCash || activeShift.expectedCash || 0).toLocaleString('id-ID')}\n` +
          `- **Status**: Berjalan & Aktif`
        );
      }
      if (appState.activeShift) {
        return formatReply(
          generateThought([`[Lookup] Retrieving shift from AppState.`]),
          `🔑 **Shift Kasir Aktif**:\n\n` +
          `- **Petugas Kasir**: **${appState.activeShift.cashierName}**\n` +
          `- **Mulai Shift**: ${new Date(appState.activeShift.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}\n` +
          `- **Modal Awal**: Rp ${(appState.activeShift.startBalance || 0).toLocaleString('id-ID')}\n` +
          `- **Status**: Berjalan & Aktif`
        );
      }
      return formatReply(
        generateThought([`[Lookup] Retrieving shifts database.`]),
        "ℹ️ **Shift Kasir Tutup**\n\nSaat ini belum ada shift kasir yang sedang berjalan. Silakan buka shift baru terlebih dahulu di menu Kasir POS."
      );
    }

    if (text.includes('omset') || text.includes('penjualan hari ini') || text.includes('untung') || text.includes('laba')) {
      const todayStr = new Date().toLocaleDateString('en-CA');
      const todayTx = (db.transactions || []).filter((t: any) => {
        const d = new Date(t.date || t.timestamp);
        return d.toLocaleDateString('en-CA') === todayStr && t.deleted !== true;
      });
      const rev = todayTx.reduce((sum: number, t: any) => sum + (t.total || 0), 0);
      const prf = todayTx.reduce((sum: number, t: any) => sum + (t.profit || 0), 0);
      return formatReply(
        generateThought([`[Lookup] Fetching today's transactions.`, `[Compute] Revenue: ${rev}, Profit: ${prf}`]),
        `📊 **Laporan Penjualan Hari Ini (${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})**:\n\n` +
        `- **Total Transaksi**: ${todayTx.length} kali\n` +
        `- **Total Omset Kotor**: Rp ${rev.toLocaleString('id-ID')}\n` +
        `- **Estimasi Laba Bersih**: Rp ${prf.toLocaleString('id-ID')}\n\n` +
        `*Catatan: Data dihitung secara real-time berdasarkan database lokal perangkat Anda saat ini.*`
      );
    }

    if (text.includes('stok menipis') || text.includes('barang habis') || text.includes('stok kritis')) {
      const lowStock = (db.products || []).filter((p: any) => p.active !== false && (p.stock || 0) <= (p.minStock || 5));
      if (lowStock.length === 0) {
        return formatReply(
          generateThought([`[Inventory] Checking products against threshold.`]),
          "✅ **Kondisi Stok Aman!**\n\nSetelah memeriksa database, semua produk aktif saat ini memiliki jumlah stok yang aman di atas batas minimum."
        );
      }
      const list = lowStock.slice(0, 8).map((p: any) => `- **${p.name}**: Sisa **${p.stock}** unit (Batas minimum: ${p.minStock || 5} unit)`).join('\n');
      return formatReply(
        generateThought([`[Inventory] Found ${lowStock.length} low stock items.`, `[List] Compiling top 8.`]),
        `⚠️ **Peringatan Stok Kritis!**\n\nTerdapat **${lowStock.length} produk** yang berada di bawah batas minimum stok aman. Berikut daftar teratas:\n\n${list}\n\n*Saran Tindakan*: Segera buat daftar pengadaan baru di menu **Pembelian** untuk restok barang.`
      );
    }

    if (text.includes('best seller') || text.includes('terlaris') || text.includes('paling laku') || text.includes('paling laris')) {
      const productSales: Record<string, number> = {};
      (db.transactions || []).forEach((t: any) => {
        if (t.deleted !== true) {
          (t.items || []).forEach((item: any) => {
            productSales[item.name] = (productSales[item.name] || 0) + (item.qty || item.quantity || 0);
          });
        }
      });
      const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (sorted.length === 0) {
        return formatReply(
          generateThought([`[Compute] Aggregating sales quantities.`]),
          "ℹ️ **Belum Ada Data Penjualan**\n\nSistem belum merekam transaksi penjualan untuk menghitung produk terlaris. Lakukan beberapa transaksi terlebih dahulu!"
        );
      }
      const list = sorted.map((s, i) => `${i+1}. **${s[0]}** - Terjual ${s[1]} unit`).join('\n');
      return formatReply(
        generateThought([`[Compute] Aggregating transaction item counts.`, `[Sort] Compiling top 5.`]),
        `🏆 **5 Produk Terlaris (Best Sellers)**:\n\n${list}\n\n*Catatan: Peringkat ini dihitung secara real-time dari data transaksi lokal.*`
      );
    }

    // 3. OPERATIONAL MANUALS
    if (text.includes('koneksi printer') || text.includes('printer') || text.includes('struk') || text.includes('thermal') || text.includes('cetak')) {
      return formatReply(
        generateThought([`[Manual] Loading thermal printing setup instructions.`]),
        "📠 **Panduan Koneksi Printer Thermal & Laci Kasir (Cash Drawer)**\n\n" +
        "**1. Menghubungkan Printer**:\n" +
        "- Klik ikon **Printer** 📠 di kanan atas header.\n" +
        "- Pilih metode koneksi: **USB**, **Bluetooth**, atau **LAN/Wi-Fi**.\n" +
        "- Nyalakan printer thermal Anda (ukuran kertas 58mm atau 80mm).\n" +
        "- Klik **Cari Perangkat** / **Hubungkan** dan pilih printer Anda.\n\n" +
        "**2. Menghubungkan Laci Kasir (Cash Drawer)**:\n" +
        "- Hubungkan kabel RJ11 dari laci kasir langsung ke port RJ11 di belakang printer thermal.\n" +
        "- Laci kasir akan terbuka secara otomatis setiap kali Anda mencetak struk belanja.\n\n" +
        "**3. Pemecahan Masalah (Troubleshooting)**:\n" +
        "- Pastikan kabel USB tidak longgar, atau Bluetooth HP/PC dalam kondisi aktif.\n" +
        "- Berikan izin akses port peramban (browser) jika muncul prompt keamanan."
      );
    }

    if (text.includes('scanner') || text.includes('barcode') || text.includes('kamera') || text.includes('camera') || text.includes('scan')) {
      return formatReply(
        generateThought([`[Manual] Loading barcode scanner integration manuals.`]),
        "🔍 **Panduan Scanner & Barcode Reader**\n\n" +
        "Smile POS mendukung 2 jenis scanner:\n\n" +
        "**1. Scanner Fisik (USB/Wireless Handheld)**:\n" +
        "- Cukup colokkan scanner ke PC/HP Anda. Scanner fisik bekerja seperti keyboard otomatis.\n" +
        "- Fokuskan kursor pada input pencarian barang, lalu tembak barcode barang. Sistem otomatis memasukkannya ke keranjang POS.\n\n" +
        "**2. Kamera Scanner (Webcam/Kamera HP)**:\n" +
        "- Klik tombol **Kamera/Barcode** di POS kasir untuk mengaktifkan webcam/kamera HP.\n" +
        "- **PENTING**: Sistem wajib berjalan di protokol aman (**HTTPS** atau **localhost**) agar browser mengizinkan akses kamera.\n" +
        "- Pastikan pencahayaan cukup dan barcode tidak buram. Jika kamera macet, segarkan halaman (refresh) dan berikan izin akses kamera."
      );
    }

    // FALLBACK GENERAL INTELLIGENT REPLY (No operational restrictions)
    const posKeywords = [
      'pos', 'smile', 'kasir', 'printer', 'scanner', 'struk', 'panik', 'panic', 'shift', 'stok',
      'produk', 'laporan', 'login', 'owner', 'admin', 'dapur', 'password', 'bypass', 'jam',
      'operasional', 'transaksi', 'bayar', 'qris', 'tunai', 'grosir', 'member', 'pelanggan',
      'akun', 'delete', 'sync', 'gudang', 'selisih', 'saldo', 'pengadaan', 'beli', 'sistem',
      'error', 'kamera', 'webcam', 'device', 'session', 'log', 'audit', 'keuangan', 'bantuan',
      'fitur', 'panduan', 'shortcut', 'cara', 'bagaimana', 'masalah', 'kendala', 'omset',
      'penjualan', 'untung', 'laba', 'siapa saya', 'perintah', 'bantuan', 'kunci', 'keranjang',
      'singkron', 'sinkron', 'halo', 'hi', 'selamat', 'terima kasih', 'thanks', 'makasih', 'oke', 'ok',
      'barcode', 'kamera', 'camera', 'scan', 'membaca', 'loyalty', 'poin', 'diskon', 'member', 'kartu',
      'offline', 'internet', 'koneksi', 'mati', 'backup', 'restore', 'cadangan', 'ekspor', 'impor',
      'best seller', 'laris', 'terlaris', 'grafik', 'analisis', 'karyawan', 'tugas', 'jadwal', 'kpi'
    ];
    const isPosRelated = posKeywords.some(keyword => text.includes(keyword));
    
    if (!isPosRelated && text.length > 5) {
      return formatReply(
        "Mengidentifikasi pertanyaan di luar konteks Smile POS.\nMembuat batasan asisten (scope limitation) secara sopan namun informatif.",
        "Maaf, sebagai AI Asisten Smile POS, saya didesain khusus untuk membantu menjawab seputar sistem Smile POS, manajemen toko, dan operasional bisnis ini. Silakan tanyakan hal-hal yang berkaitan dengan fitur, perangkat (printer/scanner), atau kendala Smile POS Anda."
      );
    }

    return formatReply(
      generateThought([
        `[Intent] General dialog or complex support question outside simple tokens.`,
        `[Reasoning] Directing cashier/owner to matching modules or providing business logic answer.`
      ]),
      `💡 **Ada yang bisa saya bantu?**\n\nSaya memahami pertanyaan Anda terkait "${query}". Sebagai AI Asisten Smile POS, saya siap mendampingi operasional toko Anda. Silakan tanyakan informasi spesifik seperti:\n` +
      `- **"Siapa saja yang online?"** atau **"Cek log audit terbaru"**\n` +
      `- **"Berapa omset hari ini?"** atau **"Produk best seller"**\n` +
      `- **"Hubungkan printer thermal"** atau **"Panduan barcode scanner"**\n` +
      `- **"Siapa kasir yang bertugas saat ini?"**\n\nAtau berikan perintah langsung seperti **"kunci layar"**, **"masuk mode panik"**, atau **"kosongkan keranjang"**.`
    );
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now(), sender: 'user', text, timestamp: new Date().toISOString() };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getAIResponse(text);
      const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: replyText, timestamp: new Date().toISOString() };
      setIsTyping(false);
      const finalMsgs = [...updatedMsgs, botMsg];
      setMessages(finalMsgs);
      saveCurrentSession(finalMsgs);
    }, 400);
  };

  const sessions = getChatSessions();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Bubble Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative cursor-pointer"
        >
          <Icon name="message-square" size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-zinc-150 overflow-hidden flex flex-col text-left font-sans animate-[slideUp_0.3s_ease-out]">
          {/* Header */}
          <div className="px-6 py-4 bg-indigo-650 text-white flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base border border-white/20 relative">
                🤖
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-650 rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide">Smile POS Assistant</h4>
                <p className="text-[10px] text-indigo-100 font-medium">Asisten AI • Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => {
                  if (showHistory) {
                    setShowHistory(false);
                  } else {
                    if (messages.length > 1) saveCurrentSession(messages);
                    setShowHistory(true);
                  }
                }} 
                title="Riwayat Percakapan"
                className={`p-1.5 rounded-full transition cursor-pointer ${showHistory ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/90 hover:text-white'}`}
              >
                <Icon name="clock" size={18} />
              </button>
              <button 
                onClick={startNewChat}
                title="Chat Baru"
                className="p-1.5 hover:bg-white/10 rounded-full transition text-white/90 hover:text-white cursor-pointer"
              >
                <Icon name="plus" size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                title="Tutup"
                className="p-1.5 hover:bg-white/10 rounded-full transition text-white/90 hover:text-white cursor-pointer"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          {showHistory ? (
            <div className="flex-1 p-5 overflow-y-auto bg-zinc-50 flex flex-col space-y-3 custom-scroll">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Riwayat Percakapan</h5>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Kembali ke Chat
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                  <Icon name="message-square" size={32} className="mb-2 text-zinc-305" />
                  <p className="text-xs font-semibold">Belum ada riwayat percakapan</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Percakapan Anda akan otomatis tersimpan di sini.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessions.map(s => (
                    <div 
                      key={s.id}
                      className={`p-3.5 bg-white border rounded-2xl hover:shadow-sm transition cursor-pointer flex items-start justify-between gap-3 group/session ${
                        activeSessionId === s.id ? 'border-indigo-500 ring-1 ring-indigo-100' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                      onClick={() => loadSession(s.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <h6 className="text-xs font-bold text-zinc-800 truncate mb-1">{s.title}</h6>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                          <span>{s.messageCount} pesan</span>
                          <span>•</span>
                          <span>{new Date(s.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(s.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Hapus Sesi"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/50 custom-scroll relative">
                {messages.map(msg => {
                  const hasThought = msg.text.includes('<thought>') && msg.text.includes('</thought>');
                  let thoughtContent = '';
                  let replyContent = msg.text;
                  if (hasThought) {
                    const parts = msg.text.split('</thought>');
                    thoughtContent = parts[0].replace('<thought>', '').trim();
                    replyContent = parts[1].trim();
                  }
                  const isThoughtExpanded = expandedThoughts[msg.id] !== false;
                  const isEditing = editingMsgId === msg.id;

                  return (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} group/msg relative`}>
                      {/* Message Bubble Container */}
                      <div className="flex items-start gap-1.5 max-w-[90%] group">
                        {msg.sender === 'bot' && (
                          <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">🤖</div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="bg-white border border-indigo-400 p-2.5 rounded-2xl shadow-sm space-y-2 w-[280px]">
                              <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                className="w-full text-xs font-semibold text-zinc-800 bg-zinc-50 p-2 rounded-xl border border-zinc-200 outline-none focus:border-indigo-500 focus:bg-white resize-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => { setEditingMsgId(null); setEditText(''); }}
                                  className="px-2 py-1 text-[10px] font-bold text-zinc-500 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button 
                                  onClick={confirmEditMessage}
                                  className="px-2.5 py-1 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer"
                                >
                                  Simpan
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-indigo-650 text-white rounded-br-none shadow-sm font-semibold'
                                : 'bg-white text-zinc-800 border border-zinc-200/85 rounded-bl-none shadow-2xs'
                            }`}>
                              {hasThought && msg.sender !== 'user' && (
                                <div className="mb-2 border-l-2 border-purple-500 bg-purple-50/50 p-2 rounded-r-lg text-[10px] text-purple-800">
                                  <button 
                                    type="button"
                                    onClick={() => setExpandedThoughts(prev => ({ ...prev, [msg.id]: !isThoughtExpanded }))} 
                                    className="flex items-center gap-1 font-bold uppercase tracking-wider text-[8px] text-purple-600 hover:text-purple-800 outline-none mb-1 cursor-pointer"
                                  >
                                    <span>🧠 Pemikiran AI (Reasoning)</span>
                                    <span>{isThoughtExpanded ? '▲' : '▼'}</span>
                                  </button>
                                  {isThoughtExpanded && (
                                    <div className="font-mono whitespace-pre-line border-t border-purple-100 pt-1 text-[9px] text-purple-700/95 leading-normal">
                                      {thoughtContent}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="whitespace-pre-line font-medium">{replyContent}</div>
                            </div>
                          )}
                        </div>

                        {/* Actions for messages */}
                        {!isEditing && msg.id !== 1 && (
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all self-center ml-1">
                            <button 
                              onClick={() => startEditMessage(msg)}
                              className="p-1 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                              title="Edit Pesan"
                            >
                              <Icon name="edit-2" size={12} />
                            </button>
                            <button 
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                              title="Hapus Pesan"
                            >
                              <Icon name="trash" size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 px-1 text-[9px] text-zinc-400 font-medium ml-8">
                        <span>{new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.edited && <span className="text-[8px] bg-zinc-100 text-zinc-500 px-1 rounded">Diedit</span>}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-start gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                    <div className="px-4 py-3 bg-white text-zinc-500 border border-zinc-200/80 rounded-2xl rounded-bl-none shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {messages.length === 1 && !isTyping && (
                <div className="px-5 py-2.5 bg-zinc-50 border-t border-zinc-100 flex flex-wrap gap-1.5 flex-shrink-0">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-600 transition shadow-3xs cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Footer */}
              <div className="p-4 bg-white border-t border-zinc-100 flex items-center gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { handleSend(inputValue); } }}
                  placeholder="Tulis pesan Anda..."
                  className="flex-1 text-xs font-semibold text-zinc-850 bg-zinc-50 px-4 py-2.5 rounded-full border border-zinc-200 outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  className="w-9 h-9 rounded-full bg-indigo-650 hover:bg-indigo-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm transition cursor-pointer"
                >
                  <Icon name="send" size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};