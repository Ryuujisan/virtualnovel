const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export function formatUpdatedAt(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const elapsed = Date.now() - date.getTime();

    if (elapsed >= 0 && elapsed < HOUR_IN_MS) {
        const minutes = Math.floor(elapsed / (60 * 1000));
        return minutes < 1 ? "Just now" : `${minutes}m ago`;
    }

    if (elapsed < DAY_IN_MS && elapsed >= 0) {
        return `${Math.floor(elapsed / HOUR_IN_MS)}h ago`;
    }

    if (elapsed < 2 * DAY_IN_MS && elapsed >= DAY_IN_MS) {
        return "Yesterday";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
    }).format(date);
}

export const bytesToBase64 = (bytes: Uint8Array): string => {
    let binary = "";

    for (let offset = 0; offset < bytes.length; offset += 8192) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    }

    return btoa(binary);
};
