import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PlotChart = ({ data }) => {
  const { incomeStatementData, balanceSheetData } = data;
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (
      !incomeStatementData ||
      incomeStatementData.length === 0 ||
      !balanceSheetData ||
      balanceSheetData.length === 0
    )
      return;

    const quarterlyNetIncome = incomeStatementData.map((entry) => ({
      quarter: entry.fiscalDateEnding.substring(0, 7),
      netIncome: parseFloat(entry.netIncome),
    }));

    const quarterlyTotalRevenue = incomeStatementData.map((entry) => ({
      quarter: entry.fiscalDateEnding.substring(0, 7),
      totalRevenue: parseFloat(entry.totalRevenue),
    }));

    const quarterlyShareholderEquity = balanceSheetData.map((entry) => ({
      quarter: entry.fiscalDateEnding.substring(0, 7),
      totalShareholderEquity: parseFloat(entry.totalShareholderEquity),
    }));

    const quarters = quarterlyNetIncome.map((entry) => entry.quarter);
    const netIncomeData = quarterlyNetIncome.map(
      (entry) => entry.netIncome || 0
    );
    const totalRevenueData = quarterlyTotalRevenue.map(
      (entry) => entry.totalRevenue || 0
    );
    const totalShareholderEquityData = quarterlyShareholderEquity.map(
      (entry) => entry.totalShareholderEquity || 0
    );

    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy existing chart instance
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: quarters,
        datasets: [
          {
            label: "Quarterly Net Income",
            data: netIncomeData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
          },
          {
            label: "Quarterly Total Revenue",
            data: totalRevenueData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
          },
          {
            label: "Quarterly Total Shareholder Equity",
            data: totalShareholderEquityData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [balanceSheetData, incomeStatementData]);

  return <canvas ref={chartRef} />;
};

export default PlotChart;
