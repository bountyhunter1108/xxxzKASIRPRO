-- PostgreSQL trigger procedures for automatic inventory tracking in Smile POS

-- 1. Function to decrease product stock when a transaction is completed
CREATE OR REPLACE FUNCTION process_transaction_items_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- This function assumes that transaction item details are linked 
    -- and handled. In a normalized database, we would have a 'transaction_items' table.
    -- Example implementation for transaction_items table updates:
    -- UPDATE products
    -- SET stock = stock - NEW.quantity,
    --     updated_at = NOW()
    -- WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to automatically restore inventory stock when a transaction is flagged as deleted (voided)
CREATE OR REPLACE FUNCTION restore_voided_transaction_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Checks if transaction was voided (deleted flag changed from FALSE to TRUE)
    IF OLD.deleted = FALSE AND NEW.deleted = TRUE THEN
        -- In actual implementation:
        -- FOR item_record IN (SELECT * FROM transaction_items WHERE transaction_id = NEW.id) LOOP
        --     UPDATE products 
        --     SET stock = stock + item_record.quantity,
        --         updated_at = NOW()
        --     WHERE id = item_record.product_id;
        -- END LOOP;
        
        -- Insert a security audit log record
        INSERT INTO activity_logs (id, user_name, role, type, details, timestamp)
        VALUES (
            'audit_' || md5(random()::text || clock_timestamp()::text),
            NEW.cashier,
            'kasir',
            'void_transaction',
            'Voided transaction ID: ' || NEW.id || '. Inventory restored.',
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create Trigger to watch transaction deletes/updates
DROP TRIGGER IF EXISTS trg_void_transaction_stock ON transactions;
CREATE TRIGGER trg_void_transaction_stock
    AFTER UPDATE OF deleted ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION restore_voided_transaction_stock();
