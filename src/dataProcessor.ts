// src/dataProcessor.ts
import data from './Manufac_India_Agro_Dataset.json';

// Interface representing the structure of each crop data entry
interface CropData {
  Year: string;
  CropName: string;
  CropProduction: number;
  YieldOfCrops: number;
  AreaUnderCultivation: number;
}

// Interface representing the yearly production result
interface YearlyProduction {
  Year: string;
  MaxCrop: string;
  MinCrop: string;
}

// Interface representing the average yield and area for each crop
interface CropAverage {
  CropName: string;
  AverageYield: number;
  AverageArea: number;
}

/**
 * Parses raw data into a structured format.
 * @param data - Array of raw data entries.
 * @returns Array of CropData objects.
 */
const parseData = (data: any[]): CropData[] => {
  return data.map(entry => {
    const yearMatch = entry['Year'].match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : '';
    return {
      Year: year,
      CropName: entry['Crop Name'],
      CropProduction: Number(entry['Crop Production (UOM:t(Tonnes))']) || 0,
      YieldOfCrops: Number(entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']) || 0,
      AreaUnderCultivation: Number(entry['Area Under Cultivation (UOM:Ha(Hectares))']) || 0,
    };
  });
};

/**
 * Calculates the yearly production data, identifying the crops with max and min production.
 * @param data - Array of CropData objects.
 * @returns Array of YearlyProduction objects.
 */
const calculateYearlyProduction = (data: CropData[]): YearlyProduction[] => {
  // Object to store data grouped by year
  const yearlyData: { [key: string]: CropData[] } = {};

  // Group data by year
  data.forEach(entry => {
    if (!yearlyData[entry.Year]) {
      yearlyData[entry.Year] = [];
    }
    yearlyData[entry.Year].push(entry);
  });

  const result: YearlyProduction[] = [];
  for (const year in yearlyData) {
    const yearEntries = yearlyData[year];
    // Find crop with maximum production
    const maxCrop = yearEntries.reduce((max, entry) => entry.CropProduction > max.CropProduction ? entry : max);
    // Find crop with minimum production
    const minCrop = yearEntries.reduce((min, entry) => entry.CropProduction < min.CropProduction ? entry : min);

    result.push({
      Year: year,
      MaxCrop: maxCrop.CropName,
      MinCrop: minCrop.CropName
    });
  }

  return result;
};

/**
 * Calculates the average yield and area under cultivation for each crop.
 * @param data - Array of CropData objects.
 * @returns Array of CropAverage objects.
 */
const calculateCropAverages = (data: CropData[]): CropAverage[] => {
  // Object to store aggregate data for each crop
  const cropData: { [key: string]: { totalYield: number, totalArea: number, count: number } } = {};

  // Aggregate data for each crop
  data.forEach(entry => {
    if (!cropData[entry.CropName]) {
      cropData[entry.CropName] = { totalYield: 0, totalArea: 0, count: 0 };
    }
    cropData[entry.CropName].totalYield += entry.YieldOfCrops;
    cropData[entry.CropName].totalArea += entry.AreaUnderCultivation;
    cropData[entry.CropName].count += 1;
  });

  const result: CropAverage[] = [];
  // Calculate average yield and area for each crop
  for (const crop in cropData) {
    const cropEntry = cropData[crop];
    result.push({
      CropName: crop,
      AverageYield: parseFloat((cropEntry.totalYield / cropEntry.count).toFixed(3)),
      AverageArea: parseFloat((cropEntry.totalArea / cropEntry.count).toFixed(3)),
    });
  }

  return result;
};

// Process the raw data
const processedData = parseData(data);
// Calculate yearly production data
const yearlyProduction = calculateYearlyProduction(processedData);
// Calculate crop averages
const cropAverages = calculateCropAverages(processedData);

// Export the results for use in other parts of the application
export { yearlyProduction, cropAverages };
