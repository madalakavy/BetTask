// src/FinancialsGrids.tsx

import React, { useEffect, useState } from 'react';
import { DeltaEngine } from './DeltaEngine';
import { parseDeltasCSV, Delta } from './DeltaModel';
import './FinancialsGrids.css';

const FinancialsGrids: React.FC = () => {
    const [dataset, setDataset] = useState<Delta[]>([]);
    const [deltaEngine, setDeltaEngine] = useState<DeltaEngine | null>(null);

    useEffect(() => {
        // Load initial dataset i took snapshot.csv file
        fetch('/snapshot.csv')
            .then(response => response.text())
            .then(csvData => {
                const parsedData = parseDeltasCSV(csvData) as Delta[];
                setDataset(parsedData);
            });

        // Loaded deltas.csv path in public location
        fetch('/Deltas.csv')
            .then(response => response.text())
            .then(csvData => {
                const deltas = parseDeltasCSV(csvData);
                const engine = new DeltaEngine(deltas, dataset);
                setDeltaEngine(engine);
            });
    }, []);

    useEffect(() => {
        if (deltaEngine) {
            deltaEngine.startProcessing();
        }
    }, [deltaEngine]);

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
                {dataset.map((row, index) => (
                    <tr key={index} data-name={row.Name} className="financials__row">
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

export default FinancialsGrids;
