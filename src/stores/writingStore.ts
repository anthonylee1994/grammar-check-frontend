import {create} from "zustand";
import {persist} from "zustand/middleware";
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
    userWritingsConsumer: ActionCable.Consumer | null;
    userWritingsSubscription: ActionCable.Subscription | null;
    // Pagination state
    page: number;
    rowsPerPage: number;

    // Actions
    fetchWritings: (page?: number, perPage?: number) => Promise<void>;
    fetchWriting: (id: number) => Promise<void>;
    uploadImage: (file: File) => Promise<Writing>;
    deleteWriting: (id: number) => Promise<void>;
    subscribeToWriting: (writingId: number) => void;
    unsubscribeFromWriting: () => void;
    subscribeToAllUserWritings: () => void;
    unsubscribeFromAllUserWritings: () => void;
    clearError: () => void;
    setCurrentWriting: (writing: Writing | null) => void;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

export const useWritingStore = create<WritingState>()(
    persist(
        (set, get) => ({
            writings: [],
            currentWriting: null,
            meta: null,
            isLoading: false,
            error: null,
            consumer: null,
            subscription: null,
            userWritingsConsumer: null,
            userWritingsSubscription: null,
            page: 0,
            rowsPerPage: 10,

            clearError: () => set({error: null}),

            setCurrentWriting: (writing: Writing | null) => set({currentWriting: writing}),

            setPage: (page: number) => set({page}),

            setRowsPerPage: (rowsPerPage: number) => set({rowsPerPage, page: 0}),

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

                    set({
                        currentWriting: newWriting,
                        isLoading: false,
                    });

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
                            // Update current writing
                            set(state => ({
                                currentWriting:
                                    state.currentWriting?.id === data.id
                                        ? {
                                              ...state.currentWriting,
                                              ...data,
                                          }
                                        : state.currentWriting,
                            }));

                            // Update in writings list
                            set(state => ({
                                writings: state.writings.map(w =>
                                    w.id === data.id
                                        ? {
                                              ...state.currentWriting,
                                              ...data,
                                          }
                                        : w
                                ),
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

            subscribeToAllUserWritings: () => {
                const state = get();

                // Unsubscribe from previous subscription if exists
                if (state.userWritingsSubscription) {
                    state.userWritingsSubscription.unsubscribe();
                }

                // Disconnect previous consumer if exists
                if (state.userWritingsConsumer) {
                    state.userWritingsConsumer.disconnect();
                }

                const token = useAuthStore.getState().token;
                if (!token) {
                    console.error("No token available for WebSocket connection");
                    return;
                }

                const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
                const wsURL = baseURL.replace(/^http/, "ws");

                // Create consumer connection
                const userWritingsConsumer = ActionCable.createConsumer(`${wsURL}/cable?token=${token}`);

                // Subscribe to UserWritingsChannel
                const userWritingsSubscription = userWritingsConsumer.subscriptions.create(
                    {
                        channel: "UserWritingsChannel",
                    },
                    {
                        connected() {
                            console.log("Connected to UserWritingsChannel - listening for all writing updates");
                        },

                        disconnected() {
                            console.log("Disconnected from UserWritingsChannel");
                        },

                        received(data: Writing) {
                            console.log(`Writing ${data.id} status changed to: ${data.status}`);

                            // Update in writings list
                            set(state => {
                                const existingIndex = state.writings.findIndex(w => w.id === data.id);

                                if (existingIndex >= 0) {
                                    // Update existing writing
                                    const updatedWritings = [...state.writings];
                                    updatedWritings[existingIndex] = {
                                        ...updatedWritings[existingIndex],
                                        ...data,
                                    };
                                    return {writings: updatedWritings};
                                } else {
                                    // New writing, add to the beginning of the list
                                    return {writings: [data, ...state.writings]};
                                }
                            });

                            // Also update currentWriting if it's the same one
                            set(state => ({
                                currentWriting:
                                    state.currentWriting?.id === data.id
                                        ? {
                                              ...state.currentWriting,
                                              ...data,
                                          }
                                        : state.currentWriting,
                            }));
                        },
                    }
                );

                set({userWritingsConsumer, userWritingsSubscription});
            },

            unsubscribeFromAllUserWritings: () => {
                const state = get();

                if (state.userWritingsSubscription) {
                    state.userWritingsSubscription.unsubscribe();
                }

                if (state.userWritingsConsumer) {
                    state.userWritingsConsumer.disconnect();
                }

                set({userWritingsConsumer: null, userWritingsSubscription: null});
            },
        }),
        {
            name: "writing-storage",
            partialize: state => ({
                page: state.page,
                rowsPerPage: state.rowsPerPage,
            }),
        }
    )
);
