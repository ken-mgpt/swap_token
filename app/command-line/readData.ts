import * as fs from 'fs';
import csv from 'csv-parser';
interface CSVRow {
    address: string;
    amount: number;
}

async function readCSVFile(filePath) {
    const results = [];
    console.log('Reading CSV file:', filePath)
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: CSVRow) => {
            results.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            console.log('results:', results);
            return results
        });
}

export async function readData(filePath) {
    try {
        const results = await readCSVFile(filePath);
        console.log(results);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}