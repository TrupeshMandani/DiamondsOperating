/**
 * API service for fetching data from the backend
 */

import { API_URL } from "@/app/config";

// Function to fetch employees from the API
export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/api/employees`);

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
    const response = await fetch(`${API_URL}/api/batches`);

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
    const response = await fetch(`${API_URL}/api/tasks`);

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
