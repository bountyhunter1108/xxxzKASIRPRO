// TypeScript interfaces and typings for Smile POS frontend

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'kasir' | 'dapur' | 'keuangan' | 'manager' | 'supervisor' | 'staff';
  active: boolean;
  entryStatus: 'entered' | 'exited';
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  wholesalePrice?: number;
  wholesaleMinQty?: number;
  taxIncluded: boolean;
  openPrice: boolean;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  cashier: string;
  total: number;
  cost: number;
  method: 'cash' | 'qris' | 'transfer' | 'debt';
  memberName?: string;
  deleted: boolean;
  date: string;
  updatedAt: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userEmail: string;
  photo?: string | null;
  ip: string;
  latitude: number | null;
  longitude: number | null;
  city: string;
  userAgent: string;
  os: string;
  browser: string;
  deviceName: string;
  screenResolution: string;
  cameraStatus: string;
  locationStatus: string;
  timestamp: string;
}