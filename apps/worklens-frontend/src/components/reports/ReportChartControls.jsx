function ReportChartControls({
    criteria,
    setCriteria,
    chartType,
    setChartType,
    showLegend,
    setShowLegend,
    criteriaOptions,
}) {
    return (
        <div
            style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                marginBottom: "20px",
            }}
        >
            <div>
                <label>
                    Criteria:&nbsp;
                </label>

                <select
                    value={criteria}
                    onChange={(e) =>
                        setCriteria(e.target.value)
                    }
                >
                    {criteriaOptions.map((option) => (
                        <option
                            key={option.key}
                            value={option.key}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>


            <div>
                <label>
                    Chart:&nbsp;
                </label>

                <select
                    value={chartType}
                    onChange={(e) =>
                        setChartType(e.target.value)
                    }
                >
                    <option value="pie">Pie</option>
                    <option value="bar">Bar</option>
                </select>
            </div>


            <label>
                <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) =>
                        setShowLegend(e.target.checked)
                    }
                />

                &nbsp;Legend
            </label>
        </div>
    );
}

export default ReportChartControls;