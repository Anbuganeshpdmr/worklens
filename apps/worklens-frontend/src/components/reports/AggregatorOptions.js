import {
    getEntryDurationHours,
    formatHours,
    formatHoursCompact,
} from "./reportChartUtils.js";

export const AggregatorOption_Duration = {
    key: "duration",
    label: "Duration (Time spent)",
    getValue: (entry) => getEntryDurationHours(entry),
    formatValue: formatHours,
    formatCompact: formatHoursCompact,
    allowDecimals: true,
};

export const AggregatorOption_Count = {
    key: "count",
    label: "Count",
    getValue: () => 1,
    formatValue: (val) => `${val}`,
    formatCompact: (val) => `${val}`,
    allowDecimals: false,
};

export const AggregatorOptions_EntryList = [
    AggregatorOption_Duration,
    AggregatorOption_Count,
];

export const AggregatorOptions_SprintActivityExecuteList = [
    AggregatorOption_Count,
];

export const DEFAULT_AGGREGATOR = AggregatorOption_Count;
