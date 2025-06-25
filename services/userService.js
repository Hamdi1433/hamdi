import supabase from '../config/supabase.js';
import bcrypt from 'bcryptjs';

export const userService = {
    // Créer un nouvel utilisateur
    async createUser(userData) {
        const { email, full_name, role, password } = userData;
        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{ email, full_name, role, password_hash }])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Récupérer tous les utilisateurs
    async getAllUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, role, created_at, updated_at');

        if (error) throw error;
        return data;
    },

    // Récupérer un utilisateur par ID
    async getUserById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, role, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Mettre à jour un utilisateur
    async updateUser(id, userData) {
        const updates = { ...userData };
        if (updates.password) {
            updates.password_hash = await bcrypt.hash(updates.password, 10);
            delete updates.password;
        }

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // Supprimer un utilisateur
    async deleteUser(id) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Authentifier un utilisateur
    async authenticateUser(email, password) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) throw error;
        if (!data) throw new Error('User not found');

        const isValidPassword = await bcrypt.compare(password, data.password_hash);
        if (!isValidPassword) throw new Error('Invalid password');

        return {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role
        };
    }
};