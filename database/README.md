# Structure de la Base de Données Premunia CRM

Ce document décrit la structure de la base de données du CRM Premunia, implémentée avec Supabase (PostgreSQL).

## Tables Principales

### Users (Utilisateurs)
- Stockage des informations des utilisateurs du système
- Gestion des rôles (admin, commercial, manager)
- Suivi des objectifs commerciaux

### Prospects
- Gestion des leads et contacts
- Suivi du statut et de l'historique des interactions
- Attribution aux commerciaux

### Campaigns (Campagnes)
- Gestion des campagnes marketing
- Suivi du budget et des performances
- Planification et statut des campagnes

### Contracts (Contrats)
- Gestion des polices d'assurance
- Suivi des primes et des échéances
- Liaison avec les prospects

### Tasks (Tâches)
- Gestion des activités CRM
- Attribution et suivi des tâches
- Priorisation des actions

### Email Templates
- Modèles pour la communication automatisée
- Personnalisation des contenus
- Variables dynamiques

### Workflows
- Automatisation des processus
- Conditions de déclenchement
- Étapes configurables

### Analytics
- Métriques de performance
- Suivi des KPIs
- Historique des données

### Cross-selling Opportunities
- Détection des opportunités
- Scoring des prospects
- Suivi des conversions

## Fonctionnalités Techniques

### Triggers
- Mise à jour automatique des timestamps
- Maintien de l'intégrité des données

### Indexes
- Optimisation des performances
- Accélération des requêtes fréquentes

## Utilisation

1. Assurez-vous que Supabase est correctement configuré
2. Exécutez le script `schema.sql` pour créer la structure
3. Configurez les variables d'environnement nécessaires
4. Vérifiez les permissions et les politiques de sécurité

## Maintenance

- Sauvegardez régulièrement la base de données
- Surveillez les performances des requêtes
- Optimisez les index selon l'usage
- Mettez à jour les schémas si nécessaire