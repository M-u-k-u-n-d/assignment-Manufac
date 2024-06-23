// src/App.tsx
// import dataset from './Manufac_India_Agro_Dataset.json';
import React from 'react';
import { Table, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { yearlyProduction, cropAverages } from './dataProcessor';


const YearlyProductionTable = () => {
  return (
    <Table stickyHeader stickyHeaderOffset={60}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>Crop with Maximum Production</Table.Th>
          <Table.Th>Crop with Minimum Production</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {yearlyProduction.map((row) => (
          <Table.Tr key={row.Year}>
            <Table.Td>{row.Year}</Table.Td>
            <Table.Td>{row.MaxCrop}</Table.Td>
            <Table.Td>{row.MinCrop}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const CropAveragesTable = () => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Crop</Table.Th>
          <Table.Th>Average Yield of the Crop between 1950-2020</Table.Th>
          <Table.Th>Average Cultivation Area of the Crop between
1950-2020</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <tbody>
        {cropAverages.map((row) => (
          <Table.Tr key={row.CropName}>
            <Table.Td>{row.CropName}</Table.Td>
            <Table.Td>{row.AverageYield}</Table.Td>
            <Table.Td>{row.AverageArea}</Table.Td>
          </Table.Tr>
        ))}
      </tbody>
    </Table>
  );
};

const App: React.FC = () => {
  return (
    <MantineProvider>
    <div style={{ padding: '20px' }}>
      <h1>Yearly Production Data</h1>
      <YearlyProductionTable />
      <h1>Crop Averages</h1>
      <CropAveragesTable />
    </div>
    </MantineProvider>
  );
};

export default App;
