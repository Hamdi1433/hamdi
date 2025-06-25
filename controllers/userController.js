import { userService } from '../services/userService.js';
import jwt from 'jsonwebtoken';

export const userController = {
    // Inscription d'un nouvel utilisateur
    async register(req, res) {
        try {
            const userData = req.body;
            const user = await userService.createUser(userData);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Connexion utilisateur
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.authenticateUser(email, password);
            
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({ user, token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    // Récupérer tous les utilisateurs
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer un utilisateur par ID
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour un utilisateur
    async updateUser(req, res) {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Supprimer un utilisateur
    async deleteUser(req, res) {
        try {
            await userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer le profil de l'utilisateur connecté
    async getCurrentUser(req, res) {
        try {
            const user = await userService.getUserById(req.user.userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};