import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { apiLogger, errorHandler } from './middleware/auth.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://premunia.com', 'https://app.premunia.com']
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Logging en développement
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Logger personnalisé pour les requêtes API
app.use(apiLogger);

// Route de base pour le débogage
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API Premunia CRM" });
});

// Routes API
app.use('/api', apiRoutes);

// Route de santé
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV}`);
    });
}

export default app;
