/**
 * API service for fetching data from the backend
 */

// Function to fetch employees from the API
export const fetchEmployees = async () => {
  try {
    const response = await fetch(
      "https://diamondsoperating.onrender.com/api/employees"
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Function to fetch batches from the API
export const fetchBatches = async () => {
  try {
    const response = await fetch(
      "https://diamondsoperating.onrender.com/api/batches"
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

// Function to fetch tasks from the API
export const fetchTasks = async () => {
  try {
    const response = await fetch(
      "https://diamondsoperating.onrender.com/api/tasks"
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
