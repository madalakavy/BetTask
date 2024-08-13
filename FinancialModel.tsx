

export interface FinancialData {
    Name: string;
    CompanyName: string;
    Price: string;
    Change: string;
    ChgPercent: string;
    MktCap: string;
}

export const parseCSV = (csvData: string): FinancialData[] => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());

    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        const entry: any = {};
        headers.forEach((header, index) => {
            entry[header.replace(/\s/g, '')] = values[index];
        });
        return entry as FinancialData;
    });
};
