import {create} from "zustand";
import {apiClient} from "../utils/apiClient";
import type {Writing, WritingListMeta} from "../types/Writing";
import * as ActionCable from "@rails/actioncable";
import {useAuthStore} from "./authStore";

interface WritingState {
    writings: Writing[];
    currentWriting: Writing | null;
    meta: WritingListMeta | null;
    isLoading: boolean;
    error: string | null;
    consumer: ActionCable.Consumer | null;
    subscription: ActionCable.Subscription | null;

    // Actions
    fetchWritings: (page?: number, perPage?: number) => Promise<void>;
    fetchWriting: (id: number) => Promise<void>;
    uploadImage: (file: File) => Promise<Writing>;
    deleteWriting: (id: number) => Promise<void>;
    subscribeToWriting: (writingId: number) => void;
    unsubscribeFromWriting: () => void;
    clearError: () => void;
    setCurrentWriting: (writing: Writing | null) => void;
}

export const useWritingStore = create<WritingState>((set, get) => ({
    writings: [],
    currentWriting: null,
    meta: null,
    isLoading: false,
    error: null,
    consumer: null,
    subscription: null,

    clearError: () => set({error: null}),

    setCurrentWriting: (writing: Writing | null) => set({currentWriting: writing}),

    fetchWritings: async (page = 1, perPage = 10) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiClient.get(`/api/v1/writings?page=${page}&per_page=${perPage}`);
            set({
                writings: response.data.writings,
                meta: response.data.meta,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || "Failed to fetch writings",
                isLoading: false,
            });
            throw error;
        }
    },

    fetchWriting: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            const response = await apiClient.get(`/api/v1/writings/${id}`);
            set({
                currentWriting: response.data.writing,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || "Failed to fetch writing",
                isLoading: false,
            });
            throw error;
        }
    },

    uploadImage: async (file: File) => {
        set({isLoading: true, error: null});
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await apiClient.post("/api/v1/writings", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const newWriting = response.data.writing;

            // Add to writings list
            set(state => ({
                writings: [newWriting, ...state.writings],
                currentWriting: newWriting,
                isLoading: false,
            }));

            return newWriting;
        } catch (error: any) {
            set({
                error: error.response?.data?.error || "Failed to upload image",
                isLoading: false,
            });
            throw error;
        }
    },

    deleteWriting: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            await apiClient.delete(`/api/v1/writings/${id}`);

            // Remove from writings list
            set(state => ({
                writings: state.writings.filter(w => w.id !== id),
                currentWriting: state.currentWriting?.id === id ? null : state.currentWriting,
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.error || "Failed to delete writing",
                isLoading: false,
            });
            throw error;
        }
    },

    subscribeToWriting: (writingId: number) => {
        const state = get();

        // Unsubscribe from previous subscription if exists
        if (state.subscription) {
            state.subscription.unsubscribe();
        }

        // Disconnect previous consumer if exists
        if (state.consumer) {
            state.consumer.disconnect();
        }

        const token = useAuthStore.getState().token;
        if (!token) {
            console.error("No token available for WebSocket connection");
            return;
        }

        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const wsURL = baseURL.replace(/^http/, "ws");

        // Create consumer connection
        const consumer = ActionCable.createConsumer(`${wsURL}/cable?token=${token}`);

        // Subscribe to WritingChannel
        const subscription = consumer.subscriptions.create(
            {
                channel: "WritingChannel",
                writing_id: writingId,
            },
            {
                connected() {
                    console.log("Connected to WritingChannel for writing:", writingId);
                },

                disconnected() {
                    console.log("Disconnected from WritingChannel");
                },

                received(data: Writing) {
                    console.log("Received update:", data);

                    // Update current writing
                    set(state => ({
                        currentWriting: state.currentWriting?.id === data.id ? data : state.currentWriting,
                    }));

                    // Update in writings list
                    set(state => ({
                        writings: state.writings.map(w => (w.id === data.id ? data : w)),
                    }));
                },
            }
        );

        set({consumer, subscription});
    },

    unsubscribeFromWriting: () => {
        const state = get();

        if (state.subscription) {
            state.subscription.unsubscribe();
        }

        if (state.consumer) {
            state.consumer.disconnect();
        }

        set({consumer: null, subscription: null});
    },
}));
