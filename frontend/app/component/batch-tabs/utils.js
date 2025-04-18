/**
 * Categorizes batches into four categories: not assigned, in progress, assigned, and completed
 * @param {Array} batches - Array of batch objects
 * @returns {Object} Object with categorized batches
 */
export const categorizeBatches = (batches, tasks = [], io) => {
  return batches.reduce(
    (acc, batch) => {
      // Ensure tasks is always an array, even if it's undefined or null
      const batchTasks = tasks.filter((task) => task.batchId === batch.batchId);

      // For "Unassigned" or "Assigned" categories, check the batch status
      if (batch.status === "Pending") {
        acc.notAssigned.push(batch); // Unassigned
      } else if (batch.status === "Assigned") {
        acc.assigned.push(batch); // Assigned
      } else if (batch.status === "In Progress") {
        acc.inProgress.push(batch); // In Progress
      } else if (batch.status === "Completed") {
        acc.completed.push(batch); // Completed
      }

      // Emit real-time WebSocket event when batch status changes
      if (io) {
        io.emit("batchStatusUpdated", {
          batchId: batch.batchId,
          status: batch.status,
        });
      }

      return acc;
    },
    {
      notAssigned: [],
      inProgress: [],
      assigned: [],
      completed: [],
    }
  );
};

/**
 * Calculates the assignment progress for a batch
 * @param {Object} batch - Batch object
 * @returns {Object} Object with assignment status and progress details
 */
export function getAssignmentProgress(batch, io) {
  const result = {
    assignmentStatus: "notAssigned",
    completedProcesses: 0,
    totalProcesses: 0,
    partiallyAssigned: false,
  };

  if (!batch.selectedProcesses || batch.selectedProcesses.length === 0) {
    if (!batch.currentProcess || batch.currentProcess.length === 0) {
      return result;
    }

    batch.selectedProcesses = Array.isArray(batch.currentProcess)
      ? batch.currentProcess
      : [batch.currentProcess];
  }

  const selectedProcesses = Array.isArray(batch.selectedProcesses[0])
    ? batch.selectedProcesses.flat()
    : batch.selectedProcesses;

  result.totalProcesses = selectedProcesses.length;

  let assignedProcesses = 0;
  let inProgressProcesses = 0;
  let completedProcesses = 0;

  selectedProcesses.forEach((process) => {
    if (batch.progress && batch.progress[process] !== undefined) {
      assignedProcesses++;

      if (batch.progress[process] > 0 && batch.progress[process] < 100) {
        inProgressProcesses++;
      }

      if (batch.progress[process] === 100) {
        completedProcesses++;
      }
    }
  });

  result.completedProcesses = completedProcesses;

  if (assignedProcesses < result.totalProcesses) {
    result.assignmentStatus = "notAssigned";
    result.partiallyAssigned = assignedProcesses > 0;
  } else if (completedProcesses === result.totalProcesses) {
    result.assignmentStatus = "completed";
  } else if (inProgressProcesses > 0 || completedProcesses > 0) {
    result.assignmentStatus = "inProgress";
  } else {
    result.assignmentStatus = "assigned";
  }

  // Emit real-time WebSocket event when assignment status changes
  if (io) {
    io.emit("assignmentProgressUpdated", {
      batchId: batch.batchId,
      assignmentStatus: result.assignmentStatus,
      completedProcesses: result.completedProcesses,
      totalProcesses: result.totalProcesses,
    });
  }

  return result;
}

/**
 * Updates batch state after a task is deleted
 * @param {Object} batch - The batch object to update
 * @param {string} taskId - The ID of the deleted task
 * @param {string} process - The process associated with the deleted task
 * @returns {Object} Updated batch object
 */
export const updateBatchAfterTaskDeletion = (batch, taskId, process) => {
  // Create a new batch object to avoid mutating the original
  const updatedBatch = { ...batch };

  // Remove the task from the batch's tasks array if it exists
  if (updatedBatch.tasks) {
    updatedBatch.tasks = updatedBatch.tasks.filter(
      (task) => task.taskId !== taskId
    );
  }

  // Update the progress for the specific process
  if (updatedBatch.progress && updatedBatch.progress[process] !== undefined) {
    // If this was the last task for this process, set progress to 0
    const remainingTasksForProcess =
      updatedBatch.tasks?.filter((task) => task.process === process).length ||
      0;

    if (remainingTasksForProcess === 0) {
      updatedBatch.progress[process] = 0;
    }
  }

  // Update the batch status if needed
  const allProcesses = Object.keys(updatedBatch.progress || {});
  const completedProcesses = allProcesses.filter(
    (proc) => updatedBatch.progress[proc] === 100
  ).length;

  if (completedProcesses === allProcesses.length) {
    updatedBatch.status = "Completed";
  } else if (completedProcesses > 0) {
    updatedBatch.status = "In Progress";
  } else {
    updatedBatch.status = "Assigned";
  }

  return updatedBatch;
};
