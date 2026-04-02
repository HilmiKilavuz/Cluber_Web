"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";

/**
 * Password strength levels.
 */
type StrengthLevel = "zayıf" | "orta" | "güçlü" | "çok güçlü";

interface PasswordStrengthIndicatorProps {
    password: string;
}

/**
 * Calculates password strength based on various criteria.
 * Returns a score and level.
 */
function calculatePasswordStrength(password: string): {
    score: number;
    level: StrengthLevel;
    criteria: Array<{ met: boolean; label: string }>;
} {
    const criteria = [
        { met: password.length >= 8, label: "En az 8 karakter" },
        { met: password.length >= 12, label: "12+ karakter (önerilen)" },
        { met: /[a-z]/.test(password), label: "Küçük harf (a-z)" },
        { met: /[A-Z]/.test(password), label: "Büyük harf (A-Z)" },
        { met: /\d/.test(password), label: "Rakam (0-9)" },
        {
            met: /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`]/.test(password),
            label: "Özel karakter (!@#$%...)",
        },
    ];

    const metCriteria = criteria.filter((c) => c.met).length;

    let score = Math.min(metCriteria, 4);
    let level: StrengthLevel = "zayıf";

    if (score >= 4) {
        level = "çok güçlü";
    } else if (score >= 3) {
        level = "güçlü";
    } else if (score >= 2) {
        level = "orta";
    } else {
        level = "zayıf";
    }

    return { score, level, criteria };
}

/**
 * Gets color based on strength level.
 */
function getStrengthColor(level: StrengthLevel): string {
    switch (level) {
        case "zayıf":
            return "bg-red-500";
        case "orta":
            return "bg-yellow-500";
        case "güçlü":
            return "bg-green-500";
        case "çok güçlü":
            return "bg-emerald-600";
        default:
            return "bg-gray-300";
    }
}

/**
 * Gets text color based on strength level.
 */
function getStrengthTextColor(level: StrengthLevel): string {
    switch (level) {
        case "zayıf":
            return "text-red-600 dark:text-red-400";
        case "orta":
            return "text-yellow-600 dark:text-yellow-400";
        case "güçlü":
            return "text-green-600 dark:text-green-400";
        case "çok güçlü":
            return "text-emerald-600 dark:text-emerald-400";
        default:
            return "text-gray-500";
    }
}

/**
 * Password strength indicator component.
 * Shows a progress bar and criteria checklist.
 */
export function PasswordStrengthIndicator({
    password,
}: PasswordStrengthIndicatorProps) {
    const { score, level, criteria } = useMemo(() => {
        if (!password) {
            return {
                score: 0,
                level: "zayıf" as StrengthLevel,
                criteria: [
                    { met: false, label: "En az 8 karakter" },
                    { met: false, label: "12+ karakter (önerilen)" },
                    { met: false, label: "Küçük harf (a-z)" },
                    { met: false, label: "Büyük harf (A-Z)" },
                    { met: false, label: "Rakam (0-9)" },
                    { met: false, label: "Özel karakter (!@#$%...)" },
                ],
            };
        }
        return calculatePasswordStrength(password);
    }, [password]);

    if (!password) return null;

    return (
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/50">
            {/* Progress Bar */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        Şifre Gücü:
                    </span>
                    <span
                        className={`font-semibold capitalize ${getStrengthTextColor(level)}`}
                    >
                        {level}
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                        className={`h-full ${getStrengthColor(level)} transition-all duration-300`}
                        style={{ width: `${(score / 4) * 100}%` }}
                    />
                </div>
            </div>

            {/* Criteria Checklist */}
            <ul className="grid grid-cols-2 gap-1.5 text-xs">
                {criteria.map((criterion, index) => (
                    <li
                        key={index}
                        className={`flex items-center gap-1.5 ${criterion.met
                                ? "text-green-600 dark:text-green-400"
                                : "text-zinc-400 dark:text-zinc-500"
                            }`}
                    >
                        {criterion.met ? (
                            <Check className="h-3 w-3" />
                        ) : (
                            <X className="h-3 w-3" />
                        )}
                        <span>{criterion.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}