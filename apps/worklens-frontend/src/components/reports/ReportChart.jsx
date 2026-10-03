import { useMemo, useState } from "react";
import ReportChartControls from "./ReportChartControls";
import { buildChartData } from "./reportChartUtils";
import "../../styles/reports/ReportChart.css";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LabelList,
} from "recharts";

const DEFAULT_AGGREGATOR = {
    key: "count",
    label: "Count",
    getValue: () => 1,
    formatValue: (val) => `${val}`,
    formatCompact: (val) => `${val}`,
    allowDecimals: false,
};

/**
 * Custom X-Axis Tick for Bar Chart that displays both the split name
 * and the aggregated mousehover metric right below each bar.
 */
function CustomBarTick({ x, y, payload, chartData, selectedAggregator }) {
    const item = chartData.find(
        (d) =>
            String(d.name) === String(payload.value) ||
            String(d.id) === String(payload.value)
    );

    if (!item) {
        return (
            <text
                x={x}
                y={y}
                dy={14}
                textAnchor="middle"
                fill="#5f5147"
                fontSize={11}
            >
                {payload.value}
            </text>
        );
    }

    const formatFn =
        selectedAggregator?.formatCompact || selectedAggregator?.formatValue;
    const formattedValue = formatFn ? formatFn(item.value) : item.value;
    const displayName = item.name != null ? String(item.name) : "";
    const truncatedName =
        displayName.length > 13 ? `${displayName.slice(0, 12)}…` : displayName;

    return (
        <g transform={`translate(${x},${y})`}>
            {/* Split name */}
            <text
                x={0}
                y={0}
                dy={14}
                textAnchor="middle"
                fill="#2c201a"
                fontSize={11}
                fontWeight={600}
            >
                {truncatedName}
            </text>

            {/* Mousehover metric value right below the bar */}
            <text
                x={0}
                y={0}
                dy={28}
                textAnchor="middle"
                fill="#810b38"
                fontSize={11}
                fontWeight={700}
            >
                {formattedValue}
            </text>
        </g>
    );
}

function ReportChart({
    records,
    criteriaOptions,
    defaultCriteria,
    aggregatorOptions,
    defaultAggregator,
}) {
    const [criteria, setCriteria] = useState(
        defaultCriteria || criteriaOptions?.[0]?.key
    );

    const [aggregator, setAggregator] = useState(
        defaultAggregator || aggregatorOptions?.[0]?.key || "count"
    );

    const [chartType, setChartType] = useState("pie");

    const selectedCriteria =
        criteriaOptions?.find((option) => option.key === criteria) ||
        criteriaOptions?.[0];

    const effectiveAggregatorOptions =
        aggregatorOptions && aggregatorOptions.length > 0
            ? aggregatorOptions
            : [DEFAULT_AGGREGATOR];

    const selectedAggregator =
        effectiveAggregatorOptions.find((option) => option.key === aggregator) ||
        effectiveAggregatorOptions[0];

    const chartData = useMemo(() => {
        if (!selectedCriteria) {
            return [];
        }

        return buildChartData(
            records,
            selectedCriteria,
            selectedAggregator
        );
    }, [records, selectedCriteria, selectedAggregator]);

    if (!selectedCriteria) {
        return <div className="report-chart-empty">No chart criteria available.</div>;
    }

    const totalValue = chartData.reduce(
        (sum, item) => sum + (item.value || 0),
        0
    );

    const totalFormatted = selectedAggregator?.formatValue
        ? selectedAggregator.formatValue(totalValue)
        : totalValue;

    return (
        <div className="report-chart-root">
            <ReportChartControls
                criteria={selectedCriteria.key}
                setCriteria={setCriteria}
                aggregator={selectedAggregator.key}
                setAggregator={setAggregator}
                aggregatorOptions={effectiveAggregatorOptions}
                chartType={chartType}
                setChartType={setChartType}
                criteriaOptions={criteriaOptions}
            />

            {chartData.length === 0 ? (
                <div className="report-chart-empty">No data available.</div>
            ) : chartType === "pie" ? (
                totalValue === 0 ? (
                    <div className="report-chart-empty">
                        No data available for the selected aggregator (total is 0).
                    </div>
                ) : (
                    /* ── Pie Chart Layout: Chart on left, Metrics on right ── */
                    <div className="report-chart-pie-container">
                        {/* Left: Pie Chart */}
                        <div className="report-chart-pie-left">
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={105}
                                        paddingAngle={2}
                                        label
                                    >
                                        {chartData.map((item) => (
                                            <Cell
                                                key={item.id}
                                                fill={item.color}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        formatter={(value, name) => {
                                            const formatted = selectedAggregator?.formatValue
                                                ? selectedAggregator.formatValue(value)
                                                : value;
                                            const percent =
                                                totalValue > 0
                                                    ? ` (${((value / totalValue) * 100).toFixed(1)}%)`
                                                    : "";
                                            return [`${formatted}${percent}`, name];
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Right: Metrics Display (1 or 2 columns based on number of splits) */}
                        <div className="report-chart-pie-right">
                            <div className="report-chart-metrics-summary">
                                <span className="report-chart-metrics-summary-label">
                                    Total {selectedAggregator?.label || "Count"}:
                                </span>
                                <span className="report-chart-metrics-summary-value">
                                    {totalFormatted}
                                </span>
                                <span className="report-chart-metrics-summary-splits">
                                    ({chartData.length} {chartData.length === 1 ? "item" : "items"})
                                </span>
                            </div>

                            <div
                                className={
                                    chartData.length > 4
                                        ? "report-chart-metrics-grid--2col"
                                        : "report-chart-metrics-grid--1col"
                                }
                            >
                                {chartData.map((item) => {
                                    const percentStr =
                                        totalValue > 0
                                            ? `${((item.value / totalValue) * 100).toFixed(1)}%`
                                            : "0%";
                                    const formattedVal = selectedAggregator?.formatValue
                                        ? selectedAggregator.formatValue(item.value)
                                        : item.value;

                                    return (
                                        <div
                                            key={item.id}
                                            className="report-chart-metric-card"
                                            style={{ borderLeftColor: item.color }}
                                            title={`${item.name}: ${formattedVal} (${percentStr})`}
                                        >
                                            <div className="report-chart-metric-top">
                                                <div className="report-chart-metric-header">
                                                    <span
                                                        className="report-chart-metric-dot"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="report-chart-metric-name">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className="report-chart-metric-pct">
                                                    {percentStr}
                                                </span>
                                            </div>
                                            <div className="report-chart-metric-val">
                                                {formattedVal}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                /* ── Bar Chart Layout: Chart with metric values right below each bar ── */
                <div className="report-chart-bar-container">
                    <ResponsiveContainer width="100%" height={310}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 15, left: -5, bottom: 25 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0e6dc"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="name"
                                interval={0}
                                height={46}
                                stroke="#c9aa8c"
                                tick={
                                    <CustomBarTick
                                        chartData={chartData}
                                        selectedAggregator={selectedAggregator}
                                    />
                                }
                            />

                            <YAxis
                                stroke="#5f5147"
                                fontSize={11}
                                allowDecimals={
                                    selectedAggregator?.allowDecimals ??
                                    (selectedAggregator?.key !== "count")
                                }
                            />

                            <Tooltip
                                formatter={(value, name) => [
                                    selectedAggregator?.formatValue
                                        ? selectedAggregator.formatValue(value)
                                        : value,
                                    name,
                                ]}
                            />

                            <Bar
                                dataKey="value"
                                name={selectedAggregator?.label || "Count"}
                                radius={[4, 4, 0, 0]}
                            >
                                {chartData.map((item) => (
                                    <Cell
                                        key={item.id}
                                        fill={item.color}
                                    />
                                ))}

                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    formatter={(val) => {
                                        const fn =
                                            selectedAggregator?.formatCompact ||
                                            selectedAggregator?.formatValue;
                                        return fn ? fn(val) : val;
                                    }}
                                    fill="#5f5147"
                                    fontSize={10.5}
                                    fontWeight={600}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Metrics / Legend displayed right below the bars */}
                    <div className="report-chart-bar-legend">
                        {chartData.map((item) => {
                            const percentStr =
                                totalValue > 0
                                    ? `${((item.value / totalValue) * 100).toFixed(1)}%`
                                    : "0%";
                            const formattedVal = selectedAggregator?.formatValue
                                ? selectedAggregator.formatValue(item.value)
                                : item.value;

                            return (
                                <div
                                    key={item.id}
                                    className="report-chart-bar-legend-pill"
                                    title={`${item.name}: ${formattedVal} (${percentStr})`}
                                >
                                    <span
                                        className="report-chart-metric-dot"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="report-chart-bar-legend-name">
                                        {item.name}:
                                    </span>
                                    <span className="report-chart-bar-legend-val">
                                        {formattedVal}
                                    </span>
                                    <span className="report-chart-bar-legend-pct">
                                        ({percentStr})
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportChart;