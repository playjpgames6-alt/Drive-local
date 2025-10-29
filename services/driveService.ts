import { Group } from '../types';

const DATA_FILE_NAME = 'drive-keep-data.json';

const exportData = (groups: Group[]): void => {
  try {
    const content = JSON.stringify(groups, null, 2); // Pretty print JSON
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = DATA_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data:", error);
    alert("Could not export data. See console for details.");
  }
};

const importData = (file: File): Promise<Group[]> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/json') {
      reject(new Error('Invalid file type. Please select a .json file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        // Basic validation
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: should be an array of groups.');
        }
        // TODO: Add more robust validation here if needed
        
        resolve(data as Group[]);
      } catch (error) {
        console.error("Error parsing imported file:", error);
        reject(new Error('Could not parse file. It might be corrupted or in the wrong format.'));
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(new Error('Could not read the selected file.'));
    };
    reader.readAsText(file);
  });
};


export const fileService = {
  exportData,
  importData,
};
