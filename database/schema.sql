-- Schema for Premunia CRM Database

-- Users table with specific roles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'commercial', 'gestionnaire', 'agent_qualite')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead sources reference table
CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN (
        'Back-office', 'client_CKS', 'FB_AZ', 'fb_sync',
        'PREMUNIAFB', 'Prescription', 'Repechage',
        'Site_web', 'TikTok', 'TNS_FB'
    )),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prospects table with extended fields
CREATE TABLE prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    creation_date DATE NOT NULL,
    signature_date DATE,
    source_id UUID REFERENCES lead_sources(id),
    status VARCHAR(50) NOT NULL CHECK (status IN (
        'A_Relancer', 'Devis_envoye', 'Inexploitable', 'Nouveau',
        'En_cours', 'Converti', 'Annule'
    )),
    assigned_to UUID REFERENCES users(id),
    cpl DECIMAL(10,2),
    country VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    postal_code VARCHAR(10),
    notes TEXT,
    hubspot_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contracts table with detailed financial information
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID REFERENCES prospects(id),
    contract_number VARCHAR(255),
    company VARCHAR(100),
    signature_date DATE,
    effect_date DATE,
    end_date DATE,
    monthly_premium DECIMAL(10,2),
    annual_premium DECIMAL(10,2),
    monthly_commission DECIMAL(10,2),
    annual_commission DECIMAL(10,2),
    first_year_commission DECIMAL(10,2),
    recurring_year_commission DECIMAL(10,2),
    received_year_commission DECIMAL(10,2),
    status VARCHAR(50) CHECK (status IN ('Precompte', 'Lineaire')),
    assigned_to UUID REFERENCES users(id),
    country VARCHAR(100),
    charges DECIMAL(10,2),
    expenses DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- External integrations configuration
CREATE TABLE external_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL CHECK (name IN ('google_sheets', 'hubspot', 'facebook', 'tiktok')),
    config JSONB NOT NULL,
    last_sync TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sync history for external integrations
CREATE TABLE sync_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES external_integrations(id),
    sync_type VARCHAR(50),
    records_processed INTEGER,
    status VARCHAR(50),
    error_details TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KPIs for commercial performance tracking
CREATE TABLE commercial_kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    period_start DATE,
    period_end DATE,
    leads_count INTEGER,
    conversion_rate DECIMAL(5,2),
    revenue_generated DECIMAL(10,2),
    commissions_earned DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at
    BEFORE UPDATE ON prospects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_integrations_updated_at
    BEFORE UPDATE ON external_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better query performance
CREATE INDEX idx_prospects_assigned_to ON prospects(assigned_to);
CREATE INDEX idx_prospects_source_id ON prospects(source_id);
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_contracts_prospect_id ON contracts(prospect_id);
CREATE INDEX idx_contracts_assigned_to ON contracts(assigned_to);
CREATE INDEX idx_commercial_kpis_user_id ON commercial_kpis(user_id);

-- Initial data insertion for lead sources
INSERT INTO lead_sources (name) VALUES
    ('Back-office'),
    ('client_CKS'),
    ('FB_AZ'),
    ('fb_sync'),
    ('PREMUNIAFB'),
    ('Prescription'),
    ('Repechage'),
    ('Site_web'),
    ('TikTok'),
    ('TNS_FB');