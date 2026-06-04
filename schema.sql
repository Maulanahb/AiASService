CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transaction_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount INT NOT NULL CHECK (amount > 0),
    type VARCHAR(15) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    raw_input TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Indexing untuk optimasi query berdasarkan bulan dan tipe
CREATE INDEX idx_transactions_date_type ON transactions(transaction_date, type);
-- Indexing untuk mempercepat pengambilan data yang belum dihapus
CREATE INDEX idx_transactions_active ON transactions(transaction_date DESC, deleted_at);
