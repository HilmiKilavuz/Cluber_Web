import { create } from "zustand";

interface UIState {
    isParticipantsModalOpen: boolean;
    selectedEventId: string | null;
    openParticipantsModal: (eventId: string) => void;
    closeParticipantsModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isParticipantsModalOpen: false,
    selectedEventId: null,
    openParticipantsModal: (eventId: string) =>
        set({ isParticipantsModalOpen: true, selectedEventId: eventId }),
    closeParticipantsModal: () =>
        set({ isParticipantsModalOpen: false, selectedEventId: null }),
}));
