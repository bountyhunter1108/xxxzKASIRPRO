-- ============================================================
-- POS KASIR PINTAR — SUPABASE SETUP (VERSI TERBARU DENGAN KEAMANAN)
-- Project: bountyhunter1108's Project
-- URL: https://xtqnofdbfxaknachrwdg.supabase.co
-- ============================================================

-- 1. BUAT TABEL pos_sync (Otomatis dilewati jika sudah ada)
CREATE TABLE IF NOT EXISTS public.pos_sync (
    id          TEXT PRIMARY KEY,
    db_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.pos_sync ENABLE ROW LEVEL SECURITY;

-- 3. HAPUS POLICY LAMA (Mencegah error duplicate policy)
DROP POLICY IF EXISTS "Allow public read" ON public.pos_sync;
DROP POLICY IF EXISTS "Allow public insert" ON public.pos_sync;
DROP POLICY IF EXISTS "Allow public update" ON public.pos_sync;
DROP POLICY IF EXISTS "Allow public delete" ON public.pos_sync;

-- 4. BUAT POLICY BARU (Izinkan CRUD via Anon/API Key)
CREATE POLICY "Allow public read" ON public.pos_sync FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.pos_sync FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.pos_sync FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.pos_sync FOR DELETE USING (true);

-- 5. MASUKKAN DATA AWAL & MERGE SKEMA BARU
INSERT INTO public.pos_sync (id, db_data, updated_at)
VALUES (
    'main',
    '{
        "users": [
            {
                "id": "owner",
                "name": "Pemilik (Owner)",
                "email": "ownerpos@pos.com",
                "password": "ownersmilepos123",
                "role": "owner",
                "active": true,
                "entryStatus": "exited",
                "createdAt": "2026-05-30T00:00:00.000Z",
                "updatedAt": "2026-05-30T00:00:00.000Z"
            }
        ],
        "products": [
            { "id": "p1", "sku": "SKU001", "name": "Nasi Goreng Spesial", "category": "Makanan", "price": 25000, "cost": 15000, "stock": 50, "active": true, "wholesalePrice": 22000, "wholesaleMinQty": 5, "taxIncluded": false, "openPrice": false, "minStock": 5, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z" },
            { "id": "p2", "sku": "SKU002", "name": "Mie Goreng Ayam", "category": "Makanan", "price": 20000, "cost": 12000, "stock": 45, "active": true, "wholesalePrice": 18000, "wholesaleMinQty": 5, "taxIncluded": false, "openPrice": false, "minStock": 5, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z" },
            { "id": "p3", "sku": "SKU003", "name": "Es Teh Manis", "category": "Minuman", "price": 5000, "cost": 2000, "stock": 100, "active": true, "wholesalePrice": 4000, "wholesaleMinQty": 10, "taxIncluded": false, "openPrice": false, "minStock": 5, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z" }
        ],
        "transactions": [],
        "categories": ["Makanan", "Minuman", "Snack"],
        "roles": [
            {"id": "admin", "name": "Admin", "baseRole": "admin", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "cashier", "name": "Kasir", "baseRole": "cashier", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "dapur", "name": "Dapur", "baseRole": "dapur", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "owner", "name": "Pemilik", "baseRole": "owner", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "admin_operasional", "name": "Admin Operasional", "baseRole": "admin", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "admin_keuangan", "name": "Admin Keuangan (Finance)", "baseRole": "admin", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "admin_hr", "name": "Admin Personalia (HR)", "baseRole": "admin", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "admin_marketing", "name": "Admin Sales & Marketing", "baseRole": "admin", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "admin_gudang", "name": "Admin Gudang (Logistik)", "baseRole": "admin", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "keuangan", "name": "Keuangan", "baseRole": "keuangan", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "manager", "name": "Manajer", "baseRole": "manager", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "supervisor", "name": "Supervisor", "baseRole": "supervisor", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"},
            {"id": "staff", "name": "Staf", "baseRole": "staff", "locked": true, "createdAt": "2026-05-30T00:00:00.000Z", "updatedAt": "2026-05-30T00:00:00.000Z"}
        ],
        "shifts": [],
        "bypassRequests": [],
        "approvedBypasses": [],
        "scans": [],
        "productProposals": [],
        "adminApprovals": [],
        "purchases": [],
        "members": [
            { "id": "m1", "name": "Budi Santoso", "phone": "08123456789", "points": 120, "discount": 5, "createdAt": "2026-05-30T00:00:00.000Z" },
            { "id": "m2", "name": "Siti Aminah", "phone": "08987654321", "points": 45, "discount": 0, "createdAt": "2026-05-30T00:00:00.000Z" }
        ],
        "cashierReports": [],
        "auditLogs": [],
        "activityLogs": [],
        "deviceSessions": [],
        "officeSupplies": [],
        "schedules": [],
        "officeTasks": [],
        "invoices": [],
        "expenses": [],
        "paymentVerifications": [],
        "attendance": [],
        "leaveRequests": [],
        "payrollSlips": [],
        "crmLeads": [],
        "promoCoupons": [],
        "stockLedger": [],
        "damagedGoods": [],
        "productBundles": [],
        "goodsReceipts": [],
        "shopIncidents": [],
        "handovers": [],
        "pettyCash": [],
        "taxRecords": [],
        "staffKPI": [],
        "salesTargets": {"target": 50000000, "month": "2026-05"}
    }'::jsonb,
    now()
)
ON CONFLICT (id) DO UPDATE SET 
    db_data = jsonb_strip_nulls(
        -- Menggabungkan field default baru jika belum ada tanpa merusak data penjualan yang sudah tersimpan
        '{
            "deviceSessions": [],
            "activityLogs": [],
            "officeSupplies": [],
            "schedules": [],
            "officeTasks": [],
            "invoices": [],
            "expenses": [],
            "paymentVerifications": [],
            "attendance": [],
            "leaveRequests": [],
            "payrollSlips": [],
            "crmLeads": [],
            "promoCoupons": [],
            "stockLedger": [],
            "damagedGoods": [],
            "purchases": [],
            "productBundles": [],
            "goodsReceipts": [],
            "shopIncidents": [],
            "handovers": [],
            "pettyCash": [],
            "taxRecords": [],
            "staffKPI": [],
            "salesTargets": {"target": 50000000, "month": "2026-05"}
        }'::jsonb || public.pos_sync.db_data
    );

-- 6. DAFTARKAN REALTIME PUBLICATION
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pos_sync;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END;
$$;

-- 7. STORED PROCEDURE (RPC) TRANSAKSI ATOMIK (Pencegah Race Condition Stok)
CREATE OR REPLACE FUNCTION process_checkout(p_transaction JSONB)
RETURNS JSONB AS $$
DECLARE
    v_db JSONB;
    v_products JSONB;
    v_item JSONB;
    v_prod JSONB;
    v_prod_idx INT;
    v_qty NUMERIC;
    v_stock NUMERIC;
    v_found BOOLEAN;
    v_member_id TEXT;
    v_points_earned INT;
    v_members JSONB;
    v_member_idx INT;
    v_member JSONB;
BEGIN
    -- Mengambil data db_data dengan FOR UPDATE lock agar transaksi berurutan & aman
    SELECT db_data INTO v_db FROM public.pos_sync WHERE id = 'main' FOR UPDATE;
    
    v_products := v_db->'products';
    
    -- Loop item dalam transaksi untuk memotong stok barang
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_transaction->'items')
    LOOP
        v_qty := (v_item->>'qty')::numeric;
        v_found := false;
        
        -- Cari index produk
        FOR v_prod_idx IN 0 .. jsonb_array_length(v_products) - 1
        LOOP
            v_prod := v_products->v_prod_idx;
            IF v_prod->>'id' = v_item->>'id' THEN
                v_stock := (v_prod->>'stock')::numeric;
                v_stock := v_stock - v_qty;
                IF v_stock < 0 THEN
                    RAISE EXCEPTION 'Stok produk % tidak mencukupi untuk transaksi ini.', v_prod->>'name';
                END IF;
                
                -- Update array produk
                v_products := jsonb_set(v_products, ARRAY[v_prod_idx::text, 'stock'], to_jsonb(v_stock));
                v_products := jsonb_set(v_products, ARRAY[v_prod_idx::text, 'updatedAt'], to_jsonb(to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')));
                v_found := true;
                EXIT;
            END IF;
        END LOOP;
        
        IF NOT v_found THEN
            RAISE EXCEPTION 'Produk dengan ID % tidak ditemukan.', v_item->>'id';
        END IF;
    END LOOP;
    
    v_db := jsonb_set(v_db, '{products}', v_products);
    
    -- Tambahkan transaksi ke index awal array transactions
    IF NOT (v_db ? 'transactions') OR v_db->'transactions' IS NULL THEN
        v_db := jsonb_set(v_db, '{transactions}', '[]'::jsonb);
    END IF;
    v_db := jsonb_set(v_db, '{transactions}', jsonb_insert(v_db->'transactions', '{0}', p_transaction));
    
    -- Akumulasi Poin Member jika ada
    v_member_id := p_transaction->>'memberId';
    IF v_member_id IS NOT NULL AND v_db ? 'members' AND v_db->'members' IS NULL = false THEN
        v_members := v_db->'members';
        v_points_earned := ((p_transaction->>'total')::numeric / 10000)::int;
        
        FOR v_member_idx IN 0 .. jsonb_array_length(v_members) - 1
        LOOP
            v_member := v_members->v_member_idx;
            IF v_member->>'id' = v_member_id THEN
                v_member := jsonb_set(v_member, '{points}', to_jsonb((v_member->>'points')::int + v_points_earned));
                v_members := jsonb_set(v_members, ARRAY[v_member_idx::text], v_member);
                EXIT;
            END IF;
        END LOOP;
        v_db := jsonb_set(v_db, '{members}', v_members);
    END IF;
    
    -- Catat diskon manual ke auditLogs jika ada
    IF (p_transaction->>'discount')::numeric > 0 THEN
        IF NOT (v_db ? 'auditLogs') OR v_db->'auditLogs' IS NULL THEN
            v_db := jsonb_set(v_db, '{auditLogs}', '[]'::jsonb);
        END IF;
        v_db := jsonb_set(v_db, '{auditLogs}', jsonb_insert(v_db->'auditLogs', '{0}', jsonb_build_object(
            'id', 'AL' || extract(epoch from now())::bigint::text,
            'user', p_transaction->>'cashier',
            'email', '',
            'role', 'Kasir',
            'action', 'Diskon Manual',
            'details', 'Memberikan diskon senilai Rp ' || (p_transaction->>'discount')::numeric::text || ' pada transaksi ' || (p_transaction->>'id'),
            'timestamp', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
        )));
    END IF;
    
    -- Simpan data terbaru ke baris pos_sync
    UPDATE public.pos_sync 
    SET db_data = v_db, updated_at = now() 
    WHERE id = 'main';
    
    RETURN v_db;
END;
$$ LANGUAGE plpgsql;
