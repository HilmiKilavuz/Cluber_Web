import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/services/events/event.service";
import type { EventFilters, CreateEventDto, UpdateEventDto, RSVPStatus } from "@/types/event";
import { toast } from "sonner";

export const useEvents = (filters?: EventFilters) => {
    return useQuery({
        queryKey: ["events", filters],
        queryFn: () => eventService.getEvents(filters),
    });
};

export const useEvent = (id: string) => {
    return useQuery({
        queryKey: ["events", id],
        queryFn: () => eventService.getEventById(id),
        enabled: !!id,
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateEventDto) => eventService.createEvent(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            toast.success("Etkinlik başarıyla oluşturuldu!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Etkinlik oluşturulurken bir hata oluştu.");
        },
    });
};

export const useUpdateEvent = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateEventDto) => eventService.updateEvent(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events", id] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            toast.success("Etkinlik güncellendi!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Etkinlik güncellenirken bir hata oluştu.");
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => eventService.deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            toast.success("Etkinlik silindi.");
        },
    });
};

export const useRSVP = (eventId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (status: RSVPStatus) => eventService.rsvpEvent(eventId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events", eventId] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            toast.success("Katılım durumunuz güncellendi.");
        },
        onError: (error: any) => {
            toast.error(error.message || "Katılım durumunuz güncellenirken bir hata oluştu.");
        },
    });
};

export const useCancelRSVP = (eventId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => eventService.cancelRSVP(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events", eventId] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
            toast.success("Katılımınız iptal edildi.");
        },
        onError: (error: any) => {
            toast.error(error.message || "Katılım iptal edilirken bir hata oluştu.");
        },
    });
};
