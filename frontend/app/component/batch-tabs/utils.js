/**
 * Categorizes batches into four categories: not assigned, in progress, assigned, and completed
 * @param {Array} batches - Array of batch objects
 * @returns {Object} Object with categorized batches
 */
export const categorizeBatches = (batches, tasks = [], io) => {
  return batches.reduce(
    (acc, batch) => {
      const batchTasks = tasks.filter((task) => task.batchId === batch.batchId);

      if (batch.status === "Pending") {
        acc.notAssigned.push(batch);
      } else if (batch.status === "Assigned") {
        acc.assigned.push(batch);
      } else if (batch.status === "In Progress") {
        acc.inProgress.push(batch);
      } else if (batch.status === "Completed") {
        acc.completed.push(batch);
      }

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
 * Updates the batch's progress if a task is deleted (e.g., reset stage progress)
 * @param {Object} batch - The batch object
 * @param {String} process - The process name that was removed (optional)
 * @returns {Object} - Updated batch
 */
export function updateBatchAfterTaskDeletion(batch, process = null) {
  if (!batch || !batch.progress) return batch;

  const newProgress = { ...batch.progress };

  if (process && newProgress[process] !== undefined) {
    newProgress[process] = 0;
  }

  return {
    ...batch,
    progress: newProgress,
  };
}
