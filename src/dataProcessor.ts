// src/dataProcessor.ts
import data from './Manufac_India_Agro_Dataset.json';

interface CropData {
    Year: string;
    CropName: string;
    CropProduction: number;
    YieldOfCrops: number;
    AreaUnderCultivation: number;
  }
  
  interface YearlyProduction {
    Year: string;
    MaxCrop: string;
    MinCrop: string;
  }
  
  interface CropAverage {
    CropName: string;
    AverageYield: number;
    AverageArea: number;
  }
  
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
  
  const calculateYearlyProduction = (data: CropData[]): YearlyProduction[] => {
    const yearlyData: { [key: string]: CropData[] } = {};
  
    data.forEach(entry => {
      if (!yearlyData[entry.Year]) {
        yearlyData[entry.Year] = [];
      }
      yearlyData[entry.Year].push(entry);
    });
  
    const result: YearlyProduction[] = [];
    for (const year in yearlyData) {
      const yearEntries = yearlyData[year];
      const maxCrop = yearEntries.reduce((max, entry) => entry.CropProduction > max.CropProduction ? entry : max);
      const minCrop = yearEntries.reduce((min, entry) => entry.CropProduction < min.CropProduction ? entry : min);
  
      result.push({
        Year: year,
        MaxCrop: maxCrop.CropName,
        MinCrop: minCrop.CropName
      });
    }
  
    return result;
  };
  
  const calculateCropAverages = (data: CropData[]): CropAverage[] => {
    const cropData: { [key: string]: { totalYield: number, totalArea: number, count: number } } = {};
  
    data.forEach(entry => {
      if (!cropData[entry.CropName]) {
        cropData[entry.CropName] = { totalYield: 0, totalArea: 0, count: 0 };
      }
      cropData[entry.CropName].totalYield += entry.YieldOfCrops;
      cropData[entry.CropName].totalArea += entry.AreaUnderCultivation;
      cropData[entry.CropName].count += 1;
    });
  
    const result: CropAverage[] = [];
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
  
  const processedData = parseData(data);
  const yearlyProduction = calculateYearlyProduction(processedData);
  const cropAverages = calculateCropAverages(processedData);
  
  export { yearlyProduction, cropAverages };