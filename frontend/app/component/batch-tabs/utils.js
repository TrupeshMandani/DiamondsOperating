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

  // If no selected processes, check currentProcess
  if (!batch.selectedProcesses || batch.selectedProcesses.length === 0) {
    // Use currentProcess as fallback if selectedProcesses is not available
    if (!batch.currentProcess || batch.currentProcess.length === 0) {
      return result;
    }

    // Set selectedProcesses to currentProcess for further processing
    batch.selectedProcesses = Array.isArray(batch.currentProcess)
      ? batch.currentProcess
      : [batch.currentProcess];
  }

  // Handle nested arrays by flattening
  const selectedProcesses = Array.isArray(batch.selectedProcesses[0])
    ? batch.selectedProcesses.flat()
    : batch.selectedProcesses;

  // Set total processes
  result.totalProcesses = selectedProcesses.length;

  // Count assigned, in progress, and completed processes
  let assignedProcesses = 0;
  let inProgressProcesses = 0;
  let completedProcesses = 0;

  // Check each process in the batch
  selectedProcesses.forEach((process) => {
    // A process is considered assigned if it has an entry in the progress object
    // with any value (even 0)
    if (batch.progress && batch.progress[process] !== undefined) {
      assignedProcesses++;

      // If progress is greater than 0 but less than 100, it's in progress
      if (batch.progress[process] > 0 && batch.progress[process] < 100) {
        inProgressProcesses++;
      }

      // If progress is 100%, it's completed
      if (batch.progress[process] === 100) {
        completedProcesses++;
      }
    }
  });

  result.completedProcesses = completedProcesses;

  // Determine assignment status based on the counts
  if (assignedProcesses < result.totalProcesses) {
    // If any required process is not assigned, batch is "notAssigned"
    result.assignmentStatus = "notAssigned";
    result.partiallyAssigned = assignedProcesses > 0;
  } else if (completedProcesses === result.totalProcesses) {
    // If all processes are completed, batch is "completed"
    result.assignmentStatus = "completed";
  } else if (inProgressProcesses > 0 || completedProcesses > 0) {
    // If all processes are assigned and at least one is in progress or completed
    result.assignmentStatus = "inProgress";
  } else {
    // If all processes are assigned but none have started (all at 0%)
    result.assignmentStatus = "assigned";
  }

  return result;
}
