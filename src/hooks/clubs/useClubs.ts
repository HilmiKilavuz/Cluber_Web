import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from "@tanstack/react-query";
import { clubService } from "@/services/clubs/club.service";
import type {
    Club,
    ClubFilters,
    ClubMember,
    CreateClubDto,
    UpdateClubDto,
} from "@/types/club";

const CLUB_QUERY_KEYS = {
    all: ["clubs"] as const,
    list: (filters?: ClubFilters) => ["clubs", "list", filters] as const,
    detail: (id: string) => ["clubs", "detail", id] as const,
    detailBySlug: (slug: string) => ["clubs", "detail", "slug", slug] as const,
};

export const useClubs = (filters?: ClubFilters): UseQueryResult<Club[], Error> => {
    return useQuery({
        queryKey: CLUB_QUERY_KEYS.list(filters),
        queryFn: () => clubService.getClubs(filters),
    });
};

export const useClub = (id: string): UseQueryResult<Club, Error> => {
    return useQuery({
        queryKey: CLUB_QUERY_KEYS.detail(id),
        queryFn: () => clubService.getClubById(id),
        enabled: !!id,
    });
};

export const useClubBySlug = (slug: string): UseQueryResult<Club, Error> => {
    return useQuery({
        queryKey: CLUB_QUERY_KEYS.detailBySlug(slug),
        queryFn: () => clubService.getClubBySlug(slug),
        enabled: !!slug,
    });
};

export const useCreateClub = (): UseMutationResult<Club, Error, CreateClubDto> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateClubDto) => clubService.createClub(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
        },
    });
};

export const useUpdateClub = (
    id: string,
): UseMutationResult<Club, Error, UpdateClubDto> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateClubDto) => clubService.updateClub(id, payload),
        onSuccess: (updatedClub) => {
            queryClient.setQueryData(CLUB_QUERY_KEYS.detail(id), updatedClub);
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
        },
    });
};

export const useDeleteClub = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clubService.deleteClub(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
        },
    });
};

export const useJoinClub = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clubId: string) => clubService.joinClub(clubId),
        onSuccess: (_, clubId) => {
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.detail(clubId) });
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: ["joinedClubs"] });
        },
    });
};

export const useLeaveClub = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clubId: string) => clubService.leaveClub(clubId),
        onSuccess: (_, clubId) => {
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.detail(clubId) });
            queryClient.invalidateQueries({ queryKey: CLUB_QUERY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: ["joinedClubs"] });
        },
    });
};

export const useJoinedClubs = () => {
    return useQuery({
        queryKey: ["joinedClubs"],
        queryFn: () => clubService.getJoinedClubs(),
    });
};

export const useClubMembers = (clubId: string): UseQueryResult<ClubMember[], Error> => {
    return useQuery({
        queryKey: ["clubs", "members", clubId],
        queryFn: () => clubService.getClubMembers(clubId),
        enabled: !!clubId,
    });
};
