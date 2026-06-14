-- Database Seeds for Smile POS
-- Populates initial test credentials, products inventory, and configurations

-- 1. Insert Initial Users
INSERT INTO users (id, name, email, password_hash, role, active, entry_status) VALUES
('u1', 'Pemilik (Owner)', 'ownerpos@pos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner', TRUE, 'entered'),
('u2', 'Admin Gudang', 'admingd@pos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE, 'entered'),
('u3', 'Admin Keuangan', 'adminfin@pos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'keuangan', TRUE, 'entered'),
('u7', 'kasir', 'kasir@pos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'kasir', TRUE, 'entered')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Core Products Inventory
INSERT INTO products (id, sku, name, category, cost, price, stock, min_stock, wholesale_price, wholesale_min_qty, tax_included, open_price, active) VALUES
('p1', 'SKU001', 'Kopi Susu Gula Aren', 'Minuman', 8000.00, 18000.00, 45.000, 10.000, 16000.00, 10, TRUE, FALSE, TRUE),
('p2', 'SKU002', 'Roti Bakar Cokelat Keju', 'Makanan', 10000.00, 22000.00, 20.000, 5.000, 20000.00, 5, TRUE, FALSE, TRUE),
('p3', 'SKU003', 'Indomie Goreng Double Telur', 'Makanan', 7000.00, 15000.00, 6.000, 8.000, NULL, NULL, TRUE, FALSE, TRUE),
('p4', 'SKU004', 'Es Teh Manis Jumbo', 'Minuman', 1500.00, 6000.00, 120.000, 15.000, 5000.00, 20, TRUE, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Mock Initial Transactions
INSERT INTO transactions (id, cashier, total, cost, method, member_name, deleted, date) VALUES
('TX-9400', 'kasir', 60000.00, 25000.00, 'qris', 'Andi Wijaya', FALSE, NOW() - INTERVAL '1 hour'),
('TX-9401', 'kasir', 125000.00, 55000.00, 'cash', NULL, FALSE, NOW() - INTERVAL '30 minutes'),
('TX-9402', 'kasir', 46000.00, 18000.00, 'qris', 'Budi Santoso', FALSE, NOW() - INTERVAL '5 minutes')
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Security Activity Logs
INSERT INTO activity_logs (id, user_name, role, type, details, timestamp) VALUES
('log_01', 'Pemilik (Owner)', 'owner', 'login', 'Berhasil login ke sistem dari PC Windows', NOW() - INTERVAL '2 hours'),
('log_02', 'kasir', 'kasir', 'shift_open', 'Membuka shift kasir baru dengan modal awal Rp 150.000', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;
