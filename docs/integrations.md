# Documentation des Intégrations - CRM Premunia

## Aperçu

Le système d'intégration du CRM Premunia permet la synchronisation des données avec différentes sources externes :

1. Google Sheets pour l'import des prospects et contrats
2. HubSpot pour la synchronisation des contacts

## Configuration

### Variables d'Environnement

```env
# Google Sheets
GOOGLE_SHEETS_KEY_FILE=chemin_vers_votre_compte_service.json
GOOGLE_SHEETS_PROSPECTS_ID=id_feuille_prospects
GOOGLE_SHEETS_CONTRACTS_ID=id_feuille_contrats

# HubSpot
HUBSPOT_API_KEY=votre_cle_api_hubspot
```

## API Endpoints

### Google Sheets

#### Synchroniser les Prospects
```http
POST /api/integrations/sync/prospects
Authorisation: Bearer {token}
Rôles requis: super_admin, admin
```

#### Synchroniser les Contrats
```http
POST /api/integrations/sync/contracts
Authorisation: Bearer {token}
Rôles requis: super_admin, admin
```

### HubSpot

#### Synchroniser les Contacts
```http
POST /api/integrations/sync/hubspot
Authorisation: Bearer {token}
Rôles requis: super_admin, admin
```

### Historique des Synchronisations

#### Obtenir l'Historique
```http
GET /api/integrations/sync/history
Authorisation: Bearer {token}
Rôles requis: super_admin, admin, gestionnaire
```

## Structure des Données

### Format des Prospects (Google Sheets)

| Colonne | Description |
|---------|-------------|
| Contact | Nom du prospect |
| Ville | Ville du prospect |
| Création | Date de création (format: DD/MM/YYYY) |
| Signature | Date de signature (format: DD/MM/YYYY) |
| Origine | Source du prospect (fb_sync, Back-office, etc.) |
| Statut | État actuel du prospect |
| Attribution | Commercial assigné |
| Cpl | Coût par lead |
| Pays | Pays du prospect |

### Format des Contrats (Google Sheets)

| Colonne | Description |
|---------|-------------|
| Nom et Prénom | Nom complet du client |
| Ville | Ville du client |
| Signature | Date de signature |
| Date d'effet | Date de début du contrat |
| Fin de contrat | Date de fin du contrat |
| N° de contrat | Numéro unique du contrat |
| Compagnie | Nom de la compagnie d'assurance |
| Cotisation mensuel | Montant mensuel de la cotisation |
| Cotisation annuel | Montant annuel de la cotisation |
| Commission mensuel | Commission mensuelle |
| Commission annuel | Commission annuelle |
| Commission annuel 1ére année | Commission première année |
| Année récurrente | Commission récurrente |
| Année recu. | Commission reçue |
| Statut | État du contrat |
| Attribution | Commercial responsable |
| Pays | Pays du contrat |
| Charge | Montant des charges |
| Dépenses | Montant des dépenses |

## Sources de Prospects Autorisées

- Back-office
- Client CKS
- FB AZ
- fb_sync
- PREMUNIAFB
- Prescription
- Repêchage
- Site web
- TikTok
- TNS FB