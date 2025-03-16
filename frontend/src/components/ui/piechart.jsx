
import React from "react";
import {
    Cell,Legend, Pie, PieChart, ResponsiveContainer, Tooltip,
} from "recharts";


import Title from "./title";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CircleChart = ({dt}) => {
    const data = [
        {name:"income",value:Number(dt?.income)}  ,   
        {name:"expense",value:Number(dt?.expense)} ,
    ];

    return (
        <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent">
            <Title title="Summary"/>
            <ResponsiveContainer width="100%" height={500}>
                <PieChart width={500} height={400}>
                    <Tooltip /> 
                    <Legend />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CircleChart;
