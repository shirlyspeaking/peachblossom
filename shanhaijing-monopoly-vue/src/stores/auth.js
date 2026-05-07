import { defineStore } from 'pinia';
import { usePeachAuth } from '../composables/usePeachAuth';
export const useAuthStore = defineStore('auth', () => {
    const api = usePeachAuth();
    return { api };
});
