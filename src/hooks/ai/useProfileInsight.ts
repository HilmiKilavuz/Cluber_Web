import { useMutation } from "@tanstack/react-query";
import { aiService, type ProfileInsightResult } from "@/services/ai/ai.service";

/**
 * React Query mutation hook for generating a profile AI insight.
 *
 * Usage:
 *   const { mutate, data, isPending, isError } = useProfileInsight();
 *   mutate(); // triggers the AI analysis
 *
 * The mutation does NOT invalidate any queries since it's a read-only analysis.
 */
export function useProfileInsight() {
    return useMutation<ProfileInsightResult, Error>({
        mutationFn: () => aiService.getProfileInsight(),
    });
}
