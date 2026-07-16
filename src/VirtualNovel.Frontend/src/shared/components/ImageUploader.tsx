import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import {Box, Button, IconButton, Stack, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {
    type ChangeEvent,
    type DragEvent,
    type KeyboardEvent,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploaderProps {
    onFileReady: (bytes: Uint8Array, file: File) => void;
    onRemove?: () => void;
    initialImageUrl?: string;
    disabled?: boolean;
    maxSizeBytes?: number;
    label?: string;
}

interface Preview {
    url: string;
    isObjectUrl: boolean;
}

type DragStatus = "idle" | "valid" | "invalid";

const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function ImageUploader({
    onFileReady,
    onRemove,
    initialImageUrl,
    disabled = false,
    maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
    label = "Novel cover",
}: ImageUploaderProps) {
    const inputId = useId();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const readSequenceRef = useRef(0);
    const dragDepthRef = useRef(0);
    const [preview, setPreview] = useState<Preview | null>(
        initialImageUrl ? {url: initialImageUrl, isObjectUrl: false} : null,
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragStatus, setDragStatus] = useState<DragStatus>("idle");

    useEffect(() => {
        return () => {
            if (preview?.isObjectUrl) URL.revokeObjectURL(preview.url);
        };
    }, [preview]);

    const resetInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openFilePicker = () => {
        if (!disabled) {
            resetInput();
            fileInputRef.current?.click();
        }
    };

    const validateFile = (file: File) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return "Choose a JPG, PNG, WebP, or GIF image.";
        }
        if (file.size > maxSizeBytes) {
            return `The image is too large. Maximum size is ${formatFileSize(maxSizeBytes)}.`;
        }
        return null;
    };

    const processFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            resetInput();
            return;
        }

        const sequence = ++readSequenceRef.current;
        const objectUrl = URL.createObjectURL(file);
        setPreview({url: objectUrl, isObjectUrl: true});
        setSelectedFile(file);
        setError(null);

        try {
            const bytes = new Uint8Array(await file.arrayBuffer());
            if (sequence === readSequenceRef.current) onFileReady(bytes, file);
        } catch {
            if (sequence === readSequenceRef.current) {
                setPreview(null);
                setSelectedFile(null);
                setError("The image could not be read. Please try another file.");
                onRemove?.();
            }
        } finally {
            resetInput();
        }
    };

    const getDragStatus = (event: DragEvent<HTMLDivElement>): DragStatus => {
        const fileItem = Array.from(event.dataTransfer.items).find((item) => item.kind === "file");
        return fileItem?.type && !ACCEPTED_IMAGE_TYPES.includes(fileItem.type)
            ? "invalid"
            : "valid";
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepthRef.current = 0;
        setDragStatus("idle");
        if (!disabled) {
            const file = event.dataTransfer.files[0];
            if (file) void processFile(file);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openFilePicker();
        }
    };

    const handleRemove = () => {
        ++readSequenceRef.current;
        setPreview(null);
        setSelectedFile(null);
        setError(null);
        resetInput();
        onRemove?.();
    };

    const helperId = `${inputId}-helper`;
    const statusId = `${inputId}-status`;
    const isDragging = dragStatus !== "idle";

    return (
        <Stack spacing={1.25} sx={{width: {xs: "100%", sm: 240}}}>
            <Typography component="label" htmlFor={inputId} variant="subtitle2">
                {label}
            </Typography>

            <Box
                sx={{
                    position: "relative",
                    aspectRatio: "2 / 3",
                    "&:hover .cover-actions, &:focus-within .cover-actions": {opacity: 1},
                }}
            >
                <Box
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={`${preview ? "Change" : "Choose"} ${label.toLowerCase()}`}
                    aria-describedby={`${helperId} ${statusId}`}
                    aria-disabled={disabled}
                    onClick={openFilePicker}
                    onKeyDown={handleKeyDown}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        if (!disabled) {
                            dragDepthRef.current += 1;
                            setDragStatus(getDragStatus(event));
                        }
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                        if (!disabled) {
                            const nextStatus = getDragStatus(event);
                            event.dataTransfer.dropEffect = nextStatus === "invalid" ? "none" : "copy";
                            setDragStatus(nextStatus);
                        }
                    }}
                    onDragLeave={(event) => {
                        event.preventDefault();
                        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
                        if (dragDepthRef.current === 0) setDragStatus("idle");
                    }}
                    onDrop={handleDrop}
                    sx={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        border: "2px dashed",
                        borderColor: dragStatus === "invalid"
                            ? "error.main"
                            : isDragging ? "primary.main" : "divider",
                        borderRadius: 1.5,
                        bgcolor: isDragging ? "action.selected" : "background.default",
                        color: "text.secondary",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                        boxShadow: preview ? 2 : 0,
                        transition: (theme) => theme.transitions.create(
                            ["border-color", "background-color", "box-shadow", "transform"],
                            {duration: theme.transitions.duration.shorter},
                        ),
                        "&:hover": disabled ? undefined : {
                            borderColor: "primary.main",
                            bgcolor: preview ? "background.default" : "action.hover",
                            boxShadow: preview ? 4 : 1,
                            transform: "translateY(-2px)",
                        },
                        "&:focus-visible": {
                            outline: "3px solid",
                            outlineColor: "primary.light",
                            outlineOffset: 3,
                        },
                    }}
                >
                    {preview ? (
                        <Box
                            component="img"
                            src={preview.url}
                            alt="Selected novel cover preview"
                            sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}
                        />
                    ) : (
                        <Stack
                            spacing={1.25}
                            sx={{
                                height: "100%",
                                px: 3,
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    placeItems: "center",
                                    width: 52,
                                    height: 52,
                                    borderRadius: "50%",
                                    bgcolor: "action.selected",
                                    color: dragStatus === "invalid" ? "error.main" : "primary.main",
                                }}
                            >
                                {isDragging ? <UploadFileOutlinedIcon /> : <ImageOutlinedIcon />}
                            </Box>
                            <Typography variant="body2" color="text.primary" sx={{fontWeight: 600}}>
                                {dragStatus === "invalid"
                                    ? "This image type is not supported"
                                    : isDragging ? "Drop your cover here" : "Choose a cover"}
                            </Typography>
                            <Typography variant="caption">Click or drag an image here</Typography>
                        </Stack>
                    )}
                </Box>

                {preview && (
                    <Stack
                        className="cover-actions"
                        direction="row"
                        sx={{
                            position: "absolute",
                            inset: "auto 0 0",
                            p: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            opacity: {xs: 1, sm: 0},
                            color: "common.white",
                            background: (theme) =>
                                `linear-gradient(transparent, ${alpha(theme.palette.common.black, 0.7)})`,
                            transition: (theme) => theme.transitions.create("opacity"),
                            pointerEvents: "none",
                            "& > *": {pointerEvents: "auto"},
                        }}
                    >
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<EditOutlinedIcon />}
                            onClick={openFilePicker}
                            onKeyDown={(event) => event.stopPropagation()}
                            disabled={disabled}
                        >
                            Change
                        </Button>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Remove cover"
                            onClick={handleRemove}
                            onKeyDown={(event) => event.stopPropagation()}
                            disabled={disabled}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Stack>
                )}
            </Box>

            <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (file) void processFile(file);
                }}
                disabled={disabled}
                hidden
            />

            <Box sx={{minHeight: 38}}>
                {selectedFile && (
                    <Typography variant="caption" color="text.primary" noWrap sx={{display: "block"}}>
                        {selectedFile.name} / {formatFileSize(selectedFile.size)}
                    </Typography>
                )}
                <Typography
                    id={helperId}
                    variant="caption"
                    color={error ? "error.main" : "text.secondary"}
                    role={error ? "alert" : undefined}
                >
                    {error ?? `JPG, PNG, WebP or GIF / max ${formatFileSize(maxSizeBytes)}`}
                </Typography>
                <Typography
                    id={statusId}
                    variant="caption"
                    aria-live="polite"
                    sx={{position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)"}}
                >
                    {dragStatus === "invalid"
                        ? "Unsupported image type."
                        : dragStatus === "valid" ? "Image ready to drop." : ""}
                </Typography>
            </Box>
        </Stack>
    );
}
