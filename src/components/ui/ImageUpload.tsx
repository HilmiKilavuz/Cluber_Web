"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, CheckCircle2 } from "lucide-react";
import { useUpload } from "@/hooks/upload/useUpload";
import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadProps {
    /** Current image URL (from DB) */
    value?: string | null;
    /** Called with the new Cloudinary URL after a successful upload */
    onChange: (url: string) => void;
    /** Visual shape of the upload area */
    shape?: "circle" | "rectangle";
    /** Label shown above the uploader */
    label?: string;
    /** Placeholder text inside the drop zone */
    placeholder?: string;
    disabled?: boolean;
}

/**
 * A drag-and-drop image uploader that:
 * 1. Lets the user pick a local file via a hidden <input type="file"> or drag-drop.
 * 2. Validates type and size on the client.
 * 3. Shows an instant local preview using FileReader.
 * 4. Uploads the file to the backend (/upload → Cloudinary) and calls onChange with the CDN URL.
 */
export function ImageUpload({
    value,
    onChange,
    shape = "rectangle",
    label,
    placeholder,
    disabled = false,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutateAsync: upload, isPending } = useUpload();

    const [preview, setPreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);

    const isCircle = shape === "circle";

    /* ─── File Processing ─────────────────────────────────── */
    const processFile = useCallback(
        async (file: File) => {
            // Validate MIME type
            if (!ACCEPTED_TYPES.includes(file.type)) {
                toast.error("Sadece JPEG, PNG, WebP veya GIF dosyaları yükleyebilirsiniz.");
                return;
            }

            // Validate size
            if (file.size > MAX_FILE_SIZE_BYTES) {
                toast.error(`Dosya boyutu ${MAX_FILE_SIZE_MB}MB'dan küçük olmalıdır.`);
                return;
            }

            // Show instant local preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
                setUploadDone(false);
            };
            reader.readAsDataURL(file);

            // Upload to backend → Cloudinary
            try {
                const { url } = await upload(file);
                onChange(url);
                setUploadDone(true);
                toast.success("Görsel yüklendi!");
            } catch {
                // axios interceptor handles toast
                setPreview(null);
            }
        },
        [upload, onChange]
    );

    /* ─── Input Handler ───────────────────────────────────── */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        // Reset input so same file can be re-selected
        e.target.value = "";
    };

    /* ─── Drag & Drop ─────────────────────────────────────── */
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (disabled) return;
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    /* ─── Clear ───────────────────────────────────────────── */
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setUploadDone(false);
        onChange("");
    };

    /* ─── Displayed Image ─────────────────────────────────── */
    const displayedImage = preview ?? value;

    /* ─── Render ──────────────────────────────────────────── */
    return (
        <div className="w-full">
            {label && (
                <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {label}
                </label>
            )}

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled || isPending}
            />

            {/* Drop Zone */}
            <div
                onClick={() => !disabled && !isPending && inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={[
                    "relative flex cursor-pointer items-center justify-center overflow-hidden border-2 transition-all duration-200",
                    isCircle
                        ? "mx-auto h-28 w-28 rounded-full"
                        : "h-44 w-full rounded-2xl",
                    isDragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : displayedImage
                        ? "border-zinc-200 dark:border-zinc-700"
                        : "border-dashed border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/50",
                    (disabled || isPending) ? "pointer-events-none opacity-60" : "",
                ].join(" ")}
            >
                {/* Background image preview */}
                {displayedImage && (
                    <img
                        src={displayedImage}
                        alt="Önizleme"
                        className={[
                            "absolute inset-0 h-full w-full object-cover",
                        ].join(" ")}
                    />
                )}

                {/* Overlay on hover (when image exists) */}
                {displayedImage && !isPending && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
                        <Upload size={20} className="text-white" />
                        <span className="text-xs font-semibold text-white">Değiştir</span>
                    </div>
                )}

                {/* Loading spinner */}
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 size={28} className="animate-spin text-white" />
                    </div>
                )}

                {/* Empty state */}
                {!displayedImage && !isPending && (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                        <div className={[
                            "flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800",
                            isCircle ? "h-10 w-10" : "h-12 w-12",
                        ].join(" ")}>
                            <ImageIcon
                                size={isCircle ? 18 : 22}
                                className="text-zinc-400 dark:text-zinc-500"
                            />
                        </div>
                        {!isCircle && (
                            <>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    {placeholder ?? "Tıkla veya sürükle & bırak"}
                                </p>
                                <p className="text-xs text-zinc-400 dark:text-zinc-600">
                                    PNG, JPG, WebP · Maks. {MAX_FILE_SIZE_MB}MB
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Success badge */}
                {uploadDone && !isPending && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                        <CheckCircle2 size={11} />
                        Yüklendi
                    </div>
                )}

                {/* Clear button */}
                {displayedImage && !isPending && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className={[
                            "absolute flex items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80",
                            isCircle
                                ? "right-0 top-0 h-7 w-7"
                                : "right-2 top-2 h-7 w-7",
                        ].join(" ")}
                        title="Görseli kaldır"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Helper text for circle shape */}
            {isCircle && !displayedImage && (
                <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-600">
                    PNG, JPG · Maks. {MAX_FILE_SIZE_MB}MB
                </p>
            )}
        </div>
    );
}
