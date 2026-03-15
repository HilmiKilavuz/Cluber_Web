import { AuthUser } from "./auth";

export interface Club {
    id: string;
    name: string;
    description: string;
    slug: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    category: string;
    _count?: {
        memberships: number;
    };
    memberships?: ClubMember[];
    creatorId: string;
    creator?: AuthUser;
    createdAt: string;
    updatedAt: string;
}

export interface ClubMember {
    id: string;
    clubId: string;
    userId: string;
    user?: AuthUser;
    role: "OWNER" | "ADMIN" | "MODERATOR" | "MEMBER";
    joinedAt: string;
}

export interface CreateClubDto {
    name: string;
    description: string;
    category: string;
    avatarUrl?: string;
    bannerUrl?: string;
}

export type UpdateClubDto = Partial<CreateClubDto>;

export interface ClubFilters {
    category?: string;
    search?: string;
}
