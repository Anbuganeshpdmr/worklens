const FALLBACK_COLORS = [
    "#2196F3",
    "#4CAF50",
    "#FF9800",
    "#9C27B0",
    "#00ACC1",
    "#F44336",
    "#795548",
    "#607D8B",
    "#E91E63",
    "#3F51B5",
    "#009688",
    "#8BC34A",
];

function getFallbackColor(id) {
    const numericId = Number(id);

    if (!Number.isNaN(numericId)) {
        return FALLBACK_COLORS[
            Math.abs(numericId) % FALLBACK_COLORS.length
        ];
    }

    const stringId = String(id);

    let hash = 0;

    for (let i = 0; i < stringId.length; i++) {
        hash =
            stringId.charCodeAt(i) +
            ((hash << 5) - hash);
    }

    return FALLBACK_COLORS[
        Math.abs(hash) % FALLBACK_COLORS.length
    ];
}

/**
 * Parses an ISO-8601 duration string (e.g. "PT1H30M", "PT45S", "P1DT2H") to total seconds.
 */
export function parseIsoDurationToSeconds(durationStr) {
    if (!durationStr || typeof durationStr !== "string") return 0;

    const isoRegex = /^P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i;
    const match = durationStr.trim().match(isoRegex);
    if (!match) return 0;

    const days = parseFloat(match[1] || 0);
    const hours = parseFloat(match[2] || 0);
    const minutes = parseFloat(match[3] || 0);
    const seconds = parseFloat(match[4] || 0);

    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Parses a time string like "HH:mm:ss" or "HH:mm" to seconds from midnight.
 */
function parseTimeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!match) return null;
    return parseInt(match[1], 10) * 3600 + parseInt(match[2], 10) * 60 + parseInt(match[3] || "0", 10);
}

/**
 * Parses duration from various formats (ISO-8601 string, "HH:mm:ss", numeric seconds,
 * or fallback between record.startTime and record.endTime) to seconds.
 */
export function parseDurationToSeconds(duration, record) {
    if (typeof duration === "number" && !isNaN(duration)) {
        return duration >= 0 ? duration : 0;
    }

    if (typeof duration === "string" && duration.trim()) {
        const str = duration.trim();
        if (str.toUpperCase().startsWith("P")) {
            return parseIsoDurationToSeconds(str);
        }
        const timeMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (timeMatch) {
            const h = parseInt(timeMatch[1], 10);
            const m = parseInt(timeMatch[2], 10);
            const s = parseInt(timeMatch[3] || "0", 10);
            return h * 3600 + m * 60 + s;
        }
        const num = parseFloat(str);
        if (!isNaN(num) && num >= 0) return num;
    }

    // Fallback: calculate difference between startTime and endTime if available
    if (record && record.startTime && record.endTime) {
        const startSec = parseTimeToSeconds(record.startTime);
        const endSec = parseTimeToSeconds(record.endTime);
        if (startSec !== null && endSec !== null && endSec >= startSec) {
            return endSec - startSec;
        }
    }

    return 0;
}

/**
 * Returns record duration in decimal hours (rounded to 2 decimal places, e.g. 1.5).
 */
export function getEntryDurationHours(record) {
    if (!record) return 0;
    const seconds = parseDurationToSeconds(record.duration, record);
    return Math.round((seconds / 3600) * 100) / 100;
}

/**
 * Returns record duration in decimal minutes (rounded to 2 decimal places, e.g. 90).
 */
export function getEntryDurationMinutes(record) {
    if (!record) return 0;
    const seconds = parseDurationToSeconds(record.duration, record);
    return Math.round((seconds / 60) * 100) / 100;
}

/**
 * Formats an hours value into a user-friendly string, e.g. "1.5 hrs (1h 30m)" or "2 hrs".
 */
export function formatHours(val) {
    if (val == null || isNaN(val)) return "0 hrs";
    const num = Number(val);
    if (num === 0) return "0 hrs";

    const totalMinutes = Math.round(num * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    let timeStr = "";
    if (hours > 0 && mins > 0) {
        timeStr = ` (${hours}h ${mins}m)`;
    } else if (hours === 0 && mins > 0) {
        timeStr = ` (${mins}m)`;
    }

    const hrUnit = num === 1 ? "hr" : "hrs";
    return `${num} ${hrUnit}${timeStr}`;
}

/**
 * Compact hours formatting without minute breakdown, suitable for bar labels / ticks (e.g. "1.5 hrs").
 */
export function formatHoursCompact(val) {
    if (val == null || isNaN(val)) return "0 hrs";
    const num = Number(val);
    const hrUnit = num === 1 ? "hr" : "hrs";
    return `${num} ${hrUnit}`;
}

export function buildChartData(records, criteriaConfig, aggregatorConfig) {
    if (!records || !criteriaConfig) {
        return [];
    }

    const grouped = new Map();

    records.forEach((record) => {
        const item = criteriaConfig.getValue(record);

        if (!item || item.id == null) {
            return;
        }

        const rawVal = aggregatorConfig?.getValue
            ? aggregatorConfig.getValue(record)
            : 1;

        const numVal = typeof rawVal === "number" && !isNaN(rawVal) && rawVal > 0 ? rawVal : 0;

        if (!grouped.has(item.id)) {
            grouped.set(item.id, {
                id: item.id,
                name: item.name,
                color: item.color,
                value: 0,
            });
        }

        grouped.get(item.id).value += numVal;
    });

    return Array.from(grouped.values()).map((item) => ({
        ...item,
        value: Math.round(item.value * 100) / 100,
        color: item.color || getFallbackColor(item.id),
    }));
}