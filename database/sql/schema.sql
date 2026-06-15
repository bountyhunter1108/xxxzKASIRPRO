-- SQL Schema Definition for Smile POS
-- Targets PostgreSQL / PostgreSQL compat (Supabase)
-- NOTE: Jika Anda menggunakan sinkronisasi Supabase (Cloud Sync),
-- harap gunakan script setup khusus yang berada di file `supabase_setup.sql`
-- untuk membuat tabel pos_sync dan stored procedure process_checkout.

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    entry_status VARCHAR(50) NOT NULL DEFAULT 'entered',
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    min_stock NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    wholesale_price NUMERIC(12, 2),
    wholesale_min_qty INTEGER,
    tax_included BOOLEAN NOT NULL DEFAULT TRUE,
    open_price BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    cashier VARCHAR(100) NOT NULL,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    method VARCHAR(50) NOT NULL DEFAULT 'cash',
    member_name VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS device_sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    photo TEXT,
    ip VARCHAR(50) NOT NULL DEFAULT '127.0.0.1',
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    city VARCHAR(150),
    user_agent TEXT,
    os VARCHAR(50),
    browser VARCHAR(50),
    device_name VARCHAR(100),
    screen_resolution VARCHAR(50),
    camera_status VARCHAR(50),
    location_status VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);