import {create} from "zustand";
import {persist} from "zustand/middleware";
import {apiClient} from "../utils/apiClient";
import type {User} from "../types/User";

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string) => Promise<void>;
    checkUsernameExists: (username: string) => Promise<boolean>;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setToken: (token: string) => {
                set({token});
            },
            login: async (username: string, password: string) => {
                try {
                    const response = await apiClient.post("/api/v1/auth/login", {username, password});
                    set({token: response.data.token, user: response.data.user, isAuthenticated: true});
                } catch (error) {
                    throw error;
                }
            },

            logout: () => {
                // Clear auth state
                set({token: null, user: null, isAuthenticated: false});
            },

            register: async (username: string, password: string) => {
                try {
                    const response = await apiClient.post("/api/v1/auth/register", {
                        username,
                        password,
                        password_confirmation: password,
                    });
                    set({token: response.data.token, user: response.data.user, isAuthenticated: true});
                } catch (error) {
                    throw error;
                }
            },

            checkUsernameExists: async (username: string) => {
                try {
                    const response = await apiClient.get(`/api/v1/auth/check_username?username=${username}`);
                    return response.data.exists;
                } catch (error) {
                    throw error;
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: state => ({token: state.token, user: state.user, isAuthenticated: state.isAuthenticated}),
        }
    )
);
