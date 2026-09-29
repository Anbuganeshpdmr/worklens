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


export function buildChartData(records, criteriaConfig) {
    const grouped = new Map();

    records.forEach((record) => {
        const item = criteriaConfig.getValue(record);

        if (!item || item.id == null) {
            return;
        }

        if (!grouped.has(item.id)) {
            grouped.set(item.id, {
                id: item.id,
                name: item.name,
                color: item.color,
                value: 0,
            });
        }

        grouped.get(item.id).value += 1;
    });

    return Array.from(grouped.values()).map((item) => ({
        ...item,
        color: item.color || getFallbackColor(item.id),
    }));
}