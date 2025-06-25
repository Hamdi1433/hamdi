import supabase from '../config/supabase.js';

export const marketingAutomationService = {
    // Segmentation des prospects
    async segmentProspects(criteria) {
        const { data, error } = await supabase
            .from('prospects')
            .select(`
                *,
                source:lead_sources(*),
                assigned_user:users(id, full_name, email)
            `)
            .match(criteria);

        if (error) throw error;
        return data;
    },

    // Créer une campagne email
    async createEmailCampaign(campaignData) {
        const { data, error } = await supabase
            .from('email_campaigns')
            .insert([campaignData])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Planifier des relances automatiques
    async scheduleFollowUps(prospectId, followUpData) {
        const { data, error } = await supabase
            .from('follow_ups')
            .insert([{
                prospect_id: prospectId,
                ...followUpData,
                status: 'scheduled'
            }])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Analyser le comportement des prospects avec IA
    async analyzeProspectBehavior(prospectId) {
        const { data: prospect, error: prospectError } = await supabase
            .from('prospects')
            .select(`
                *,
                interactions:prospect_interactions(*),
                follow_ups(*),
                contracts(*)
            `)
            .eq('id', prospectId)
            .single();

        if (prospectError) throw prospectError;

        // Analyse IA du comportement
        const analysis = {
            engagementScore: calculateEngagementScore(prospect),
            conversionProbability: predictConversionProbability(prospect),
            recommendedActions: generateRecommendedActions(prospect)
        };

        return analysis;
    },

    // Créer un workflow de nurturing
    async createNurturingWorkflow(workflowData) {
        const { data, error } = await supabase
            .from('nurturing_workflows')
            .insert([{
                ...workflowData,
                status: 'active',
                created_at: new Date()
            }])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Obtenir les statistiques des campagnes
    async getCampaignStats(campaignId) {
        const { data, error } = await supabase
            .from('email_campaigns')
            .select(`
                *,
                campaign_stats:campaign_statistics(*),
                interactions:campaign_interactions(*)
            `)
            .eq('id', campaignId)
            .single();

        if (error) throw error;
        return data;
    }
};

// Fonctions utilitaires pour l'analyse IA
function calculateEngagementScore(prospect) {
    // Logique de calcul du score d'engagement
    let score = 0;
    if (prospect.interactions) {
        score += prospect.interactions.length * 10;
    }
    if (prospect.follow_ups) {
        score += prospect.follow_ups.filter(f => f.status === 'completed').length * 15;
    }
    return Math.min(score, 100);
}

function predictConversionProbability(prospect) {
    // Modèle de prédiction de conversion
    let probability = 0.5; // Base probability
    
    // Facteurs d'ajustement
    if (prospect.interactions && prospect.interactions.length > 5) {
        probability += 0.2;
    }
    if (prospect.contracts && prospect.contracts.length > 0) {
        probability += 0.3;
    }
    
    return Math.min(probability, 1);
}

function generateRecommendedActions(prospect) {
    // Génération des actions recommandées basée sur l'IA
    const actions = [];
    
    if (!prospect.email) {
        actions.push({
            type: 'data_collection',
            priority: 'high',
            description: 'Collecter l\'adresse email du prospect'
        });
    }
    
    if (prospect.interactions && prospect.interactions.length === 0) {
        actions.push({
            type: 'engagement',
            priority: 'high',
            description: 'Initier le premier contact'
        });
    }
    
    return actions;
}