import { prospectService } from '../services/prospectService.js';

export const prospectController = {
    // Créer un nouveau prospect
    async createProspect(req, res) {
        try {
            const prospectData = {
                ...req.body,
                creation_date: new Date(),
                assigned_to: req.user.userId
            };
            const prospect = await prospectService.createProspect(prospectData);
            res.status(201).json(prospect);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Récupérer tous les prospects
    async getAllProspects(req, res) {
        try {
            let prospects;
            if (req.user.role === 'commercial') {
                prospects = await prospectService.getProspectsByUser(req.user.userId);
            } else {
                prospects = await prospectService.getAllProspects();
            }
            res.json(prospects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer un prospect par ID
    async getProspectById(req, res) {
        try {
            const prospect = await prospectService.getProspectById(req.params.id);
            if (!prospect) {
                return res.status(404).json({ error: 'Prospect non trouvé' });
            }

            // Vérifier les permissions
            if (req.user.role === 'commercial' && prospect.assigned_to !== req.user.userId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }

            res.json(prospect);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour un prospect
    async updateProspect(req, res) {
        try {
            const prospect = await prospectService.getProspectById(req.params.id);
            if (!prospect) {
                return res.status(404).json({ error: 'Prospect non trouvé' });
            }

            // Vérifier les permissions
            if (req.user.role === 'commercial' && prospect.assigned_to !== req.user.userId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }

            const updatedProspect = await prospectService.updateProspect(req.params.id, req.body);
            res.json(updatedProspect);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Supprimer un prospect
    async deleteProspect(req, res) {
        try {
            const prospect = await prospectService.getProspectById(req.params.id);
            if (!prospect) {
                return res.status(404).json({ error: 'Prospect non trouvé' });
            }

            // Vérifier les permissions
            if (req.user.role === 'commercial' && prospect.assigned_to !== req.user.userId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }

            await prospectService.deleteProspect(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Rechercher des prospects
    async searchProspects(req, res) {
        try {
            const searchParams = req.query;
            
            // Ajouter la restriction par utilisateur pour les commerciaux
            if (req.user.role === 'commercial') {
                searchParams.assigned_to = req.user.userId;
            }

            const prospects = await prospectService.searchProspects(searchParams);
            res.json(prospects);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};