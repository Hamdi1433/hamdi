import supabase from '../config/supabase.js';

export const prospectService = {
    // Créer un nouveau prospect
    async createProspect(prospectData) {
        const { data, error } = await supabase
            .from('prospects')
            .insert([prospectData])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Récupérer tous les prospects
    async getAllProspects() {
        const { data, error } = await supabase
            .from('prospects')
            .select(`
                *,
                source:lead_sources(*),
                assigned_user:users(id, full_name, email)
            `);

        if (error) throw error;
        return data;
    },

    // Récupérer les prospects par commercial
    async getProspectsByUser(userId) {
        const { data, error } = await supabase
            .from('prospects')
            .select(`
                *,
                source:lead_sources(*),
                assigned_user:users(id, full_name, email)
            `)
            .eq('assigned_to', userId);

        if (error) throw error;
        return data;
    },

    // Récupérer un prospect par ID
    async getProspectById(id) {
        const { data, error } = await supabase
            .from('prospects')
            .select(`
                *,
                source:lead_sources(*),
                assigned_user:users(id, full_name, email)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Mettre à jour un prospect
    async updateProspect(id, prospectData) {
        const { data, error } = await supabase
            .from('prospects')
            .update(prospectData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // Supprimer un prospect
    async deleteProspect(id) {
        const { error } = await supabase
            .from('prospects')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Rechercher des prospects
    async searchProspects(searchParams) {
        let query = supabase
            .from('prospects')
            .select(`
                *,
                source:lead_sources(*),
                assigned_user:users(id, full_name, email)
            `);

        // Ajouter les filtres de recherche
        if (searchParams.status) {
            query = query.eq('status', searchParams.status);
        }
        if (searchParams.source_id) {
            query = query.eq('source_id', searchParams.source_id);
        }
        if (searchParams.country) {
            query = query.eq('country', searchParams.country);
        }
        if (searchParams.contact_name) {
            query = query.ilike('contact_name', `%${searchParams.contact_name}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }
};