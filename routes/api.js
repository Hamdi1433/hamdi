import express from 'express';
import { userController } from '../controllers/userController.js';
import { prospectController } from '../controllers/prospectController.js';
import { contractController } from '../controllers/contractController.js';
import { marketingAutomationController } from '../controllers/marketingAutomationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Routes d'authentification
router.post('/auth/register', authorizeRoles(['super_admin', 'admin']), userController.register);
router.post('/auth/login', userController.login);

// Routes utilisateurs
router.get('/users/profile', authenticateToken, userController.getCurrentUser);
router.get('/users', authenticateToken, authorizeRoles(['super_admin', 'admin']), userController.getAllUsers);
router.get('/users/:id', authenticateToken, authorizeRoles(['super_admin', 'admin']), userController.getUserById);
router.put('/users/:id', authenticateToken, authorizeRoles(['super_admin', 'admin']), userController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles(['super_admin']), userController.deleteUser);

// Routes prospects
router.post('/prospects', authenticateToken, prospectController.createProspect);
router.get('/prospects', authenticateToken, prospectController.getAllProspects);
router.get('/prospects/search', authenticateToken, prospectController.searchProspects);
router.get('/prospects/:id', authenticateToken, prospectController.getProspectById);
router.put('/prospects/:id', authenticateToken, prospectController.updateProspect);
router.delete('/prospects/:id', authenticateToken, authorizeRoles(['super_admin', 'admin', 'commercial']), prospectController.deleteProspect);

// Routes contrats
router.post('/contracts', authenticateToken, contractController.createContract);
router.get('/contracts', authenticateToken, contractController.getAllContracts);
router.get('/contracts/stats', authenticateToken, contractController.getContractStats);
router.get('/contracts/search', authenticateToken, contractController.searchContracts);
router.get('/contracts/:id', authenticateToken, contractController.getContractById);
router.put('/contracts/:id', authenticateToken, contractController.updateContract);
router.delete('/contracts/:id', authenticateToken, authorizeRoles(['super_admin', 'admin']), contractController.deleteContract);

// Routes d'automatisation marketing
router.post('/marketing/segments', authenticateToken, authorizeRoles(['super_admin', 'admin', 'marketing']), marketingAutomationController.segmentProspects);
router.post('/marketing/campaigns', authenticateToken, authorizeRoles(['super_admin', 'admin', 'marketing']), marketingAutomationController.createEmailCampaign);
router.get('/marketing/campaigns/:campaignId/stats', authenticateToken, authorizeRoles(['super_admin', 'admin', 'marketing']), marketingAutomationController.getCampaignStats);
router.post('/marketing/prospects/:prospectId/follow-ups', authenticateToken, authorizeRoles(['super_admin', 'admin', 'marketing', 'commercial']), marketingAutomationController.scheduleFollowUps);
router.get('/marketing/prospects/:prospectId/analysis', authenticateToken, authorizeRoles(['super_admin', 'admin', 'marketing', 'commercial']), marketingAutomationController.analyzeProspectBehavior);
router.post('/marketing/workflows', authenticateToken, authorizeRoles(['super_admin', 'admin', 'marketing']), marketingAutomationController.createNurturingWorkflow);
router.post('/marketing/webhooks/email', marketingAutomationController.handleEmailWebhook);

export default router;