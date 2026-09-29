import { useMemo, useState } from "react";
import ReportChartControls from "./ReportChartControls";
import { buildChartData } from "./reportChartUtils";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";


function ReportChart({
    records,
    criteriaOptions,
    defaultCriteria,
}) {
    const [criteria, setCriteria] = useState(
        defaultCriteria || criteriaOptions[0]?.key
    );

    const [chartType, setChartType] = useState("pie");

    const [showLegend, setShowLegend] = useState(true);


    const selectedCriteria = criteriaOptions.find(
        (option) => option.key === criteria
    );


    const chartData = useMemo(() => {
        if (!selectedCriteria) {
            return [];
        }

        return buildChartData(
            records,
            selectedCriteria
        );
    }, [records, selectedCriteria]);


    if (!selectedCriteria) {
        return <div>No chart criteria available.</div>;
    }


    return (
        <div>

            <ReportChartControls
                criteria={criteria}
                setCriteria={setCriteria}
                chartType={chartType}
                setChartType={setChartType}
                showLegend={showLegend}
                setShowLegend={setShowLegend}
                criteriaOptions={criteriaOptions}
            />


            {chartData.length === 0 ? (
                <div>No data available.</div>
            ) : chartType === "pie" ? (

                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={120}
                            label
                        >
                            {chartData.map((item) => (
                                <Cell
                                    key={item.id}
                                    fill={item.color}
                                />
                            ))}
                        </Pie>

                        <Tooltip />

                        {showLegend && <Legend />}

                    </PieChart>
                </ResponsiveContainer>

            ) : (

                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="name" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        {showLegend && <Legend />}

                        <Bar
                            dataKey="value"
                            name="Count"
                        >
                            {chartData.map((item) => (
                                <Cell
                                    key={item.id}
                                    fill={item.color}
                                />
                            ))}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
            )}

        </div>
    );
}

export default ReportChart;