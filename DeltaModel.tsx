// src/DeltaModel.ts

export interface Delta {
    Name: string;
    CompanyName?: string;
    Price?: string;
    Change?: string;
    ChgPercent?: string;
    MktCap?: string;
}

export const parseDeltasCSV = (csvData: string): (Delta | number)[] => {
    const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    return lines.map(line => {
        
        if (/^\d+$/.test(line)) {
            return parseInt(line, 10); // Return number for delay
        }

        const [Name, CompanyName, Price, Change, ChgPercent, MktCap] = line.split(',').map(val => val.trim());
        return { Name, CompanyName, Price, Change, ChgPercent, MktCap } as Delta;
    });
};
