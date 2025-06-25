import { marketingAutomationService } from '../services/marketingAutomationService.js';

export const marketingAutomationController = {
    // Segmenter les prospects
    async segmentProspects(req, res) {
        try {
            const criteria = req.body.criteria;
            const segments = await marketingAutomationService.segmentProspects(criteria);
            res.json(segments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Créer une campagne email
    async createEmailCampaign(req, res) {
        try {
            const campaignData = {
                ...req.body,
                created_by: req.user.userId,
                created_at: new Date()
            };
            const campaign = await marketingAutomationService.createEmailCampaign(campaignData);
            res.status(201).json(campaign);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Planifier des relances
    async scheduleFollowUps(req, res) {
        try {
            const { prospectId } = req.params;
            const followUpData = {
                ...req.body,
                created_by: req.user.userId
            };
            const followUp = await marketingAutomationService.scheduleFollowUps(prospectId, followUpData);
            res.status(201).json(followUp);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Analyser le comportement des prospects
    async analyzeProspectBehavior(req, res) {
        try {
            const { prospectId } = req.params;
            const analysis = await marketingAutomationService.analyzeProspectBehavior(prospectId);
            res.json(analysis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Créer un workflow de nurturing
    async createNurturingWorkflow(req, res) {
        try {
            const workflowData = {
                ...req.body,
                created_by: req.user.userId
            };
            const workflow = await marketingAutomationService.createNurturingWorkflow(workflowData);
            res.status(201).json(workflow);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Obtenir les statistiques des campagnes
    async getCampaignStats(req, res) {
        try {
            const { campaignId } = req.params;
            const stats = await marketingAutomationService.getCampaignStats(campaignId);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Gérer les webhooks des interactions email
    async handleEmailWebhook(req, res) {
        try {
            const eventData = req.body;
            
            // Traiter différents types d'événements
            switch (eventData.type) {
                case 'open':
                    await marketingAutomationService.trackEmailOpen(eventData);
                    break;
                case 'click':
                    await marketingAutomationService.trackEmailClick(eventData);
                    break;
                case 'bounce':
                    await marketingAutomationService.handleEmailBounce(eventData);
                    break;
                default:
                    console.log('Événement email non géré:', eventData.type);
            }

            res.status(200).send('Webhook processed');
        } catch (error) {
            console.error('Erreur webhook:', error);
            res.status(500).json({ error: error.message });
        }
    }
};