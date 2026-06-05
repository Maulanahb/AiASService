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

-- Tabel Target Tabungan
CREATE TABLE IF NOT EXISTS savings_goals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    current_amount BIGINT NOT NULL DEFAULT 0,
    deadline DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_savings_goals_active ON savings_goals(deleted_at);

-- Tabel Anggaran Bulanan
CREATE TABLE IF NOT EXISTS budgets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category VARCHAR(50) NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(category, month)
);
