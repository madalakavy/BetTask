import React, { useEffect, useState } from 'react';
import { FinancialData, parseCSV } from './FinancialModel';
import './FinancialsGrid.css';

const FinancialsGrid: React.FC = () => {
    const [data, setData] = useState<FinancialData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/snapshot.csv');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const csvData = await response.text();
                const parsedData = parseCSV(csvData);

                // Log the parsed data to verify
                console.log('Parsed Data:', parsedData);
                setData(parsedData);
            } catch (err) {
                console.error('Error loading the CSV file:', err);
                setError('Failed to load data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="financials__error">{error}</div>;
    }

    return (
        <table className="financials__table">
            <thead>
                <tr className="financials__header-row">
                    <th className="financials__header">Name</th>
                    <th className="financials__header">Company Name</th>
                    <th className="financials__header">Price</th>
                    <th className="financials__header">Change</th>
                    <th className="financials__header">Chg %</th>
                    <th className="financials__header">Mkt Cap</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="financials__row">
                        <td className="financials__cell">{row.Name}</td>
                        <td className="financials__cell">{row.CompanyName}</td>
                        <td className="financials__cell">{row.Price}</td>
                        <td className="financials__cell">{row.Change}</td>
                        <td className="financials__cell">{row.ChgPercent}</td>
                        <td className="financials__cell">{row.MktCap}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FinancialsGrid;
