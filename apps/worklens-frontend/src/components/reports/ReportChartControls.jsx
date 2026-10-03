function ReportChartControls({
    criteria,
    setCriteria,
    aggregator,
    setAggregator,
    aggregatorOptions,
    chartType,
    setChartType,
    criteriaOptions,
}) {
    return (
        <div className="report-chart-controls">
            <div className="report-chart-control-group">
                <label className="report-chart-control-label" htmlFor="rc-criteria">
                    Criteria:
                </label>

                <select
                    id="rc-criteria"
                    className="report-chart-select"
                    value={criteria}
                    onChange={(e) =>
                        setCriteria(e.target.value)
                    }
                >
                    {criteriaOptions?.map((option) => (
                        <option
                            key={option.key}
                            value={option.key}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="report-chart-control-group">
                <label className="report-chart-control-label" htmlFor="rc-aggregator">
                    Aggregator:
                </label>

                <select
                    id="rc-aggregator"
                    className="report-chart-select"
                    value={aggregator}
                    onChange={(e) =>
                        setAggregator(e.target.value)
                    }
                >
                    {aggregatorOptions?.map((option) => (
                        <option
                            key={option.key}
                            value={option.key}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="report-chart-control-group">
                <label className="report-chart-control-label" htmlFor="rc-chart-type">
                    Chart:
                </label>

                <select
                    id="rc-chart-type"
                    className="report-chart-select"
                    value={chartType}
                    onChange={(e) =>
                        setChartType(e.target.value)
                    }
                >
                    <option value="pie">Pie</option>
                    <option value="bar">Bar</option>
                </select>
            </div>
        </div>
    );
}

export default ReportChartControls;