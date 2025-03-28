/**
 * Categorizes batches into four categories: not assigned, in progress, assigned, and completed
 * @param {Array} batches - Array of batch objects
 * @returns {Object} Object with categorized batches
 */
export function categorizeBatches(batches) {
  const categorized = {
    notAssigned: [],
    inProgress: [],
    assigned: [],
    completed: [],
  };

  batches.forEach((batch) => {
    const { assignmentStatus } = getAssignmentProgress(batch);

    switch (assignmentStatus) {
      case "notAssigned":
        categorized.notAssigned.push(batch);
        break;
      case "inProgress":
        categorized.inProgress.push(batch);
        break;
      case "assigned":
        categorized.assigned.push(batch);
        break;
      case "completed":
        categorized.completed.push(batch);
        break;
      default:
        categorized.notAssigned.push(batch);
    }
  });

  return categorized;
}

/**
 * Calculates the assignment progress for a batch
 * @param {Object} batch - Batch object
 * @returns {Object} Object with assignment status and progress details
 */
export function getAssignmentProgress(batch) {
  // Default values
  const result = {
    assignmentStatus: "notAssigned",
    completedProcesses: 0,
    totalProcesses: 0,
    partiallyAssigned: false,
  };

  // If no selected processes, return default
  if (!batch.selectedProcesses || batch.selectedProcesses.length === 0) {
    return result;
  }

  // Handle nested arrays by flattening
  const selectedProcesses = Array.isArray(batch.selectedProcesses[0])
    ? batch.selectedProcesses.flat()
    : batch.selectedProcesses;

  // Set total processes
  result.totalProcesses = selectedProcesses.length;

  // Count assigned and completed processes
  let assignedProcesses = 0;
  let completedProcesses = 0;

  selectedProcesses.forEach((process) => {
    // Check if process has progress
    if (batch.progress && batch.progress[process] !== undefined) {
      // If progress is greater than 0, it's assigned
      if (batch.progress[process] > 0) {
        assignedProcesses++;

        // If progress is 100%, it's completed
        if (batch.progress[process] === 100) {
          completedProcesses++;
        }
      }
    }
  });

  result.completedProcesses = completedProcesses;

  // Determine assignment status
  if (assignedProcesses === 0) {
    result.assignmentStatus = "notAssigned";
  } else if (completedProcesses === result.totalProcesses) {
    result.assignmentStatus = "completed";
  } else if (assignedProcesses === result.totalProcesses) {
    result.assignmentStatus = "assigned";
  } else {
    result.assignmentStatus = "inProgress";
    result.partiallyAssigned = true;
  }

  return result;
}
