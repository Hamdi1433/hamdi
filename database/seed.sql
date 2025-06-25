-- Insertion des utilisateurs de test
-- Le mot de passe pour tous les utilisateurs est 'password'
INSERT INTO users (email, full_name, role, password_hash) VALUES
    ('z.snoussi@premunia.com', 'SNOUSSI ZOUHAIR', 'commercial', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
    ('p.maataoug@premunia.com', 'Radhia MAATATOUG', 'commercial', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
    ('m.dahmani@premunia.com', 'DAHMANI Mouna', 'commercial', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
    ('m.khribi@premunia.com', 'KHRIBI Mariem', 'commercial', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
    ('h.mekni@premunia.com', 'MEKNI Hamdi', 'super_admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
    ('gestion@premunia.fr', 'Ibtissem GESTION', 'gestionnaire', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
    ('o.aouididi@premunia.com', 'Olfa AOUIDIDI Qualité', 'agent_qualite', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- Insertion des prospects de test
INSERT INTO prospects (contact_name, city, creation_date, signature_date, source_id, status, assigned_to, cpl, country) 
VALUES
    ('barry Laurent', 'Vinget', '2024-02-02', '2024-02-02', (SELECT id FROM lead_sources WHERE name = 'fb_sync'), 'A_Relancer', (SELECT id FROM users WHERE email = 'z.snoussi@premunia.com'), 2.19, 'France Métropolitaine'),
    ('meinart', 'Saint-Laurent-du-Maroni', '2024-02-02', NULL, (SELECT id FROM lead_sources WHERE name = 'fb_sync'), 'A_Relancer', (SELECT id FROM users WHERE email = 'z.snoussi@premunia.com'), 2.19, 'Guyane'),
    ('Riviere Jean Hugues', 'Saint-Pierre', '2024-02-02', NULL, (SELECT id FROM lead_sources WHERE name = 'fb_sync'), 'Inexploitable', (SELECT id FROM users WHERE email = 'p.maataoug@premunia.com'), 2.19, 'La Réunion'),
    ('Satge Jocelyn', 'Capesterre-Belle-Eau', '2024-02-02', NULL, (SELECT id FROM lead_sources WHERE name = 'fb_sync'), 'Inexploitable', (SELECT id FROM users WHERE email = 'm.dahmani@premunia.com'), 2.19, 'Guadeloupe'),
    ('Persee marie Helene', 'Sainte-Rose', '2024-02-02', NULL, (SELECT id FROM lead_sources WHERE name = 'fb_sync'), 'Inexploitable', (SELECT id FROM users WHERE email = 'm.dahmani@premunia.com'), 2.19, 'Guadeloupe');

-- Insertion des contrats de test
INSERT INTO contracts (prospect_id, contract_number, company, signature_date, effect_date, end_date, monthly_premium, annual_premium, monthly_commission, annual_commission, first_year_commission, recurring_year_commission, received_year_commission, status, assigned_to, country, charges, expenses)
SELECT
    p.id,
    'CONT-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY p.id)::TEXT, 4, '0'),
    'Assurance XYZ',
    p.signature_date,
    p.signature_date + INTERVAL '1 month',
    p.signature_date + INTERVAL '1 year',
    99.99,
    1199.88,
    19.99,
    239.88,
    479.76,
    239.88,
    239.88,
    'Lineaire',
    p.assigned_to,
    p.country,
    49.99,
    29.99
FROM prospects p
WHERE p.signature_date IS NOT NULL;

-- Insertion des configurations d'intégration
INSERT INTO external_integrations (name, config) VALUES
    ('google_sheets', '{"spreadsheet_id": "your_spreadsheet_id", "range": "A2:I"}'),
    ('hubspot', '{"api_key": "your_hubspot_api_key"}'),
    ('facebook', '{"app_id": "your_app_id", "app_secret": "your_app_secret"}'),
    ('tiktok', '{"access_token": "your_access_token"}');

-- Insertion des KPIs commerciaux initiaux
INSERT INTO commercial_kpis (user_id, period_start, period_end, leads_count, conversion_rate, revenue_generated, commissions_earned)
SELECT
    u.id,
    DATE_TRUNC('month', CURRENT_DATE),
    DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
    5,
    20.0,
    1000.00,
    200.00
FROM users u
WHERE u.role = 'commercial';