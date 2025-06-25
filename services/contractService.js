import supabase from '../config/supabase.js';

export const contractService = {
    // Créer un nouveau contrat
    async createContract(contractData) {
        const { data, error } = await supabase
            .from('contracts')
            .insert([contractData])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Récupérer tous les contrats
    async getAllContracts() {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                prospect:prospects(*),
                assigned_user:users(id, full_name, email)
            `);

        if (error) throw error;
        return data;
    },

    // Récupérer les contrats par commercial
    async getContractsByUser(userId) {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                prospect:prospects(*),
                assigned_user:users(id, full_name, email)
            `)
            .eq('assigned_to', userId);

        if (error) throw error;
        return data;
    },

    // Récupérer un contrat par ID
    async getContractById(id) {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                prospect:prospects(*),
                assigned_user:users(id, full_name, email)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Mettre à jour un contrat
    async updateContract(id, contractData) {
        const { data, error } = await supabase
            .from('contracts')
            .update(contractData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // Supprimer un contrat
    async deleteContract(id) {
        const { error } = await supabase
            .from('contracts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Obtenir les statistiques des contrats
    async getContractStats(userId = null) {
        let query = supabase
            .from('contracts')
            .select(`
                count(*),
                sum(annual_premium),
                sum(annual_commission),
                status
            `)
            .group('status');

        if (userId) {
            query = query.eq('assigned_to', userId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    },

    // Rechercher des contrats
    async searchContracts(searchParams) {
        let query = supabase
            .from('contracts')
            .select(`
                *,
                prospect:prospects(*),
                assigned_user:users(id, full_name, email)
            `);

        if (searchParams.status) {
            query = query.eq('status', searchParams.status);
        }
        if (searchParams.company) {
            query = query.ilike('company', `%${searchParams.company}%`);
        }
        if (searchParams.contract_number) {
            query = query.eq('contract_number', searchParams.contract_number);
        }
        if (searchParams.date_range) {
            query = query
                .gte('signature_date', searchParams.date_range.start)
                .lte('signature_date', searchParams.date_range.end);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }
};