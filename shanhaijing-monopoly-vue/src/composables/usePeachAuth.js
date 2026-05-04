import { computed, reactive } from 'vue';
import { APP_ID } from '../config/game';
import { getAuthBase } from '../utils/game';
const authState = reactive({
    status: 'loading',
    user: null,
    error: '',
});
function returnToCurrentPage() {
    return window.location.href.split('#')[0];
}
export async function refreshSession() {
    authState.status = 'loading';
    authState.error = '';
    try {
        const response = await fetch(`${getAuthBase()}/auth/session`, {
            credentials: 'include',
            cache: 'no-store',
        });
        const data = (await response.json());
        if (data?.authenticated && data.user) {
            authState.status = 'authenticated';
            authState.user = data.user;
        }
        else {
            authState.status = 'guest';
            authState.user = null;
        }
        return data;
    }
    catch (error) {
        authState.status = 'error';
        authState.user = null;
        authState.error = error instanceof Error ? error.message : '連線失敗';
        return null;
    }
}
export function login() {
    const base = getAuthBase();
    window.location.href = `${base}/auth/apps/${APP_ID}/login?returnTo=${encodeURIComponent(returnToCurrentPage())}`;
}
export function logout() {
    const base = getAuthBase();
    window.location.href = `${base}/auth/apps/${APP_ID}/logout?returnTo=${encodeURIComponent(returnToCurrentPage())}`;
}
export function usePeachAuth() {
    return {
        authState,
        isAuthenticated: computed(() => authState.status === 'authenticated' && !!authState.user),
        login,
        logout,
        refreshSession,
    };
}
