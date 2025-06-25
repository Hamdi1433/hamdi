-- Données de test pour l'automatisation marketing

-- Insertion de campagnes email
INSERT INTO email_campaigns (name, subject, content, segment_criteria, status, created_by) VALUES
('Campagne de Bienvenue', 'Bienvenue chez Premunia', 'Contenu de bienvenue personnalisé', '{"type": "nouveau_prospect"}', 'active', (SELECT id FROM users WHERE email = 'admin@premunia.com')),
('Relance Prospects Inactifs', 'Découvrez nos nouvelles offres', 'Contenu de relance avec offres spéciales', '{"inactif_depuis": "30j"}', 'draft', (SELECT id FROM users WHERE email = 'admin@premunia.com')),
('Newsletter Mensuelle', 'Actualités Premunia - Janvier 2024', 'Contenu de la newsletter mensuelle', '{"subscribed": true}', 'scheduled', (SELECT id FROM users WHERE email = 'marketing@premunia.com'));

-- Insertion de statistiques de campagne
INSERT INTO campaign_statistics (campaign_id, total_sent, total_delivered, total_opened, total_clicked, total_bounced) VALUES
((SELECT id FROM email_campaigns WHERE name = 'Campagne de Bienvenue'), 100, 98, 45, 20, 2),
((SELECT id FROM email_campaigns WHERE name = 'Relance Prospects Inactifs'), 50, 48, 25, 10, 2);

-- Insertion d'interactions de campagne
INSERT INTO campaign_interactions (campaign_id, prospect_id, type, metadata) VALUES
((SELECT id FROM email_campaigns WHERE name = 'Campagne de Bienvenue'),
 (SELECT id FROM prospects LIMIT 1),
 'open',
 '{"device": "mobile", "location": "Paris"}'),
((SELECT id FROM email_campaigns WHERE name = 'Campagne de Bienvenue'),
 (SELECT id FROM prospects OFFSET 1 LIMIT 1),
 'click',
 '{"link": "https://premunia.com/offres", "device": "desktop"}');

-- Insertion de workflows de nurturing
INSERT INTO nurturing_workflows (name, description, steps, trigger_conditions, created_by) VALUES
('Workflow Nouveaux Prospects',
 'Séquence d''onboarding pour nouveaux prospects',
 '[
    {"type": "email", "delay": "0d", "template": "welcome_email"},
    {"type": "wait", "delay": "2d"},
    {"type": "email", "delay": "3d", "template": "product_introduction"},
    {"type": "task", "delay": "5d", "action": "contact_commercial"}
 ]'::jsonb,
 '{"trigger": "nouveau_prospect"}',
 (SELECT id FROM users WHERE email = 'marketing@premunia.com'));

-- Insertion de relances programmées
INSERT INTO follow_ups (prospect_id, type, content, scheduled_at, status, created_by) VALUES
((SELECT id FROM prospects LIMIT 1),
 'email',
 'Suivi de votre intérêt pour nos solutions',
 CURRENT_TIMESTAMP + interval '2 days',
 'scheduled',
 (SELECT id FROM users WHERE email = 'commercial@premunia.com'));

-- Insertion d'interactions prospects
INSERT INTO prospect_interactions (prospect_id, type, channel, details, created_by) VALUES
((SELECT id FROM prospects LIMIT 1),
 'visite_site',
 'web',
 '{"pages": ["pricing", "features"], "duration": 300}',
 (SELECT id FROM users WHERE email = 'marketing@premunia.com')),
((SELECT id FROM prospects OFFSET 1 LIMIT 1),
 'téléchargement',
 'web',
 '{"document": "whitepaper_2024.pdf", "source": "email"}',
 (SELECT id FROM users WHERE email = 'marketing@premunia.com'));