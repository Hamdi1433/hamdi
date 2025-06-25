import { contractService } from '../services/contractService.js';

export const contractController = {
    // Créer un nouveau contrat
    async createContract(req, res) {
        try {
            const contractData = {
                ...req.body,
                assigned_to: req.user.userId
            };
            const contract = await contractService.createContract(contractData);
            res.status(201).json(contract);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Récupérer tous les contrats
    async getAllContracts(req, res) {
        try {
            let contracts;
            if (req.user.role === 'commercial') {
                contracts = await contractService.getContractsByUser(req.user.userId);
            } else {
                contracts = await contractService.getAllContracts();
            }
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer un contrat par ID
    async getContractById(req, res) {
        try {
            const contract = await contractService.getContractById(req.params.id);
            if (!contract) {
                return res.status(404).json({ error: 'Contrat non trouvé' });
            }

            // Vérifier les permissions
            if (req.user.role === 'commercial' && contract.assigned_to !== req.user.userId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }

            res.json(contract);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Mettre à jour un contrat
    async updateContract(req, res) {
        try {
            const contract = await contractService.getContractById(req.params.id);
            if (!contract) {
                return res.status(404).json({ error: 'Contrat non trouvé' });
            }

            // Vérifier les permissions
            if (req.user.role === 'commercial' && contract.assigned_to !== req.user.userId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }

            const updatedContract = await contractService.updateContract(req.params.id, req.body);
            res.json(updatedContract);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Supprimer un contrat
    async deleteContract(req, res) {
        try {
            const contract = await contractService.getContractById(req.params.id);
            if (!contract) {
                return res.status(404).json({ error: 'Contrat non trouvé' });
            }

            // Vérifier les permissions
            if (req.user.role === 'commercial' && contract.assigned_to !== req.user.userId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }

            await contractService.deleteContract(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtenir les statistiques des contrats
    async getContractStats(req, res) {
        try {
            const userId = req.user.role === 'commercial' ? req.user.userId : null;
            const stats = await contractService.getContractStats(userId);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Rechercher des contrats
    async searchContracts(req, res) {
        try {
            const searchParams = req.query;
            
            // Ajouter la restriction par utilisateur pour les commerciaux
            if (req.user.role === 'commercial') {
                searchParams.assigned_to = req.user.userId;
            }

            const contracts = await contractService.searchContracts(searchParams);
            res.json(contracts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};