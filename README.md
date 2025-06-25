# Premunia CRM Backend

## Description
Backend du CRM Premunia intégrant Supabase pour la gestion des prospects, contrats et intégrations externes. L'API REST fournit des endpoints sécurisés pour la gestion complète du CRM avec authentification JWT et intégrations HubSpot et Google Sheets.

## API Endpoints

### Authentification
- POST `/api/auth/register` : Inscription d'un nouvel utilisateur
- POST `/api/auth/login` : Connexion utilisateur

### Utilisateurs
- GET `/api/users/profile` : Profil de l'utilisateur connecté
- GET `/api/users` : Liste des utilisateurs
- GET `/api/users/:id` : Détails d'un utilisateur
- PUT `/api/users/:id` : Mise à jour d'un utilisateur
- DELETE `/api/users/:id` : Suppression d'un utilisateur

### Prospects
- POST `/api/prospects` : Création d'un prospect
- GET `/api/prospects` : Liste des prospects
- GET `/api/prospects/search` : Recherche de prospects
- GET `/api/prospects/:id` : Détails d'un prospect
- PUT `/api/prospects/:id` : Mise à jour d'un prospect
- DELETE `/api/prospects/:id` : Suppression d'un prospect

### Contrats
- POST `/api/contracts` : Création d'un contrat
- GET `/api/contracts` : Liste des contrats
- GET `/api/contracts/stats` : Statistiques des contrats
- GET `/api/contracts/search` : Recherche de contrats
- GET `/api/contracts/:id` : Détails d'un contrat
- PUT `/api/contracts/:id` : Mise à jour d'un contrat
- DELETE `/api/contracts/:id` : Suppression d'un contrat

### Automatisation Marketing
- POST `/api/marketing/segments` : Segmentation des prospects
- POST `/api/marketing/campaigns` : Création de campagne email
- GET `/api/marketing/campaigns/:campaignId/stats` : Statistiques des campagnes
- POST `/api/marketing/prospects/:prospectId/follow-ups` : Planification des relances
- GET `/api/marketing/prospects/:prospectId/analysis` : Analyse IA du comportement
- POST `/api/marketing/workflows` : Création de workflow de nurturing
- POST `/api/marketing/webhooks/email` : Webhook pour les événements email

## Configuration

### Variables d'Environnement
Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration Supabase
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Configuration JWT
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=24h

# Configuration Google Sheets
GOOGLE_SHEETS_KEY_FILE=chemin_vers_votre_compte_service.json
GOOGLE_SHEETS_PROSPECTS_ID=id_feuille_prospects
GOOGLE_SHEETS_CONTRACTS_ID=id_feuille_contrats

# Configuration HubSpot
HUBSPOT_API_KEY=votre_cle_api_hubspot

# Configuration Email Marketing
EMAIL_PROVIDER_API_KEY=votre_cle_api_email
EMAIL_PROVIDER_DOMAIN=votre_domaine_email
EMAIL_WEBHOOK_SECRET=votre_secret_webhook

# Configuration du serveur
PORT=3000
NODE_ENV=development
```

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Compiler le code TypeScript :
```bash
npm run build
```

3. Démarrer le serveur :
```bash
npm start
```

## Base de Données

1. Initialiser la base de données Supabase :
   - Exécuter le script `schema.sql` pour créer les tables de base
   - Exécuter le script `marketing_schema.sql` pour les tables d'automatisation marketing
   - Exécuter le script `seed.sql` pour insérer les données de test

## Déploiement

### Vercel

1. Installer Vercel CLI :
```bash
npm i -g vercel
```

2. Se connecter à Vercel :
```bash
vercel login
```

3. Configurer les variables d'environnement sur Vercel :
```bash
vercel secrets add supabase_url "votre_url_supabase"
vercel secrets add supabase_anon_key "votre_cle_anon_supabase"
vercel secrets add supabase_service_role_key "votre_cle_service_role"
vercel secrets add jwt_secret "votre_secret_jwt"
vercel secrets add google_sheets_key_file "contenu_du_fichier_json_encodé_base64"
vercel secrets add google_sheets_prospects_id "id_feuille_prospects"
vercel secrets add google_sheets_contracts_id "id_feuille_contrats"
vercel secrets add hubspot_api_key "votre_cle_api_hubspot"
```

4. Déployer :
```bash
vercel --prod
```

### Netlify

1. Créer un fichier `netlify.toml` :
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "functions"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 200
```

## Sécurité et Gestion des Erreurs

### Sécurité
- Authentification JWT pour toutes les routes protégées
- Validation des données entrantes avec express-validator
- Protection CORS configurée pour les domaines autorisés
- Headers de sécurité avec Helmet
- Hachage des mots de passe avec bcrypt
- Gestion des rôles et permissions (super_admin, admin, commercial, gestionnaire, agent_qualite)

### Gestion des Erreurs
- Middleware de gestion globale des erreurs
- Logging des erreurs avec Winston
- Validation des données et messages d'erreur personnalisés
- Gestion des erreurs d'authentification et d'autorisation

### Monitoring
- Logging des requêtes API avec Morgan
- Suivi des performances avec les timestamps
- Route /health pour le monitoring du statut de l'API

## Support et Contact

Pour toute question technique ou assistance :
- Email : support@premunia.com
- Documentation API : https://api.premunia.com/docs
- Environnement de test : https://api-test.premunia.com

2. Configurer les variables d'environnement dans l'interface Netlify

3. Connecter le repository et déployer

## Documentation API

La documentation détaillée des endpoints API est disponible dans le dossier `docs/` :
- `integrations.md` : Documentation des intégrations externes

## Tests

Exécuter les tests :
```bash
npm test
```

## Support

Pour toute question ou problème, contacter l'équipe technique à `support@premunia.com`.