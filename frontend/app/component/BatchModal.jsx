const BatchModal = ({ isOpen, onClose, batch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          Batch Details - {batch.batchId}
        </h2>
        <div className="text-left">
          <p>
            <strong>Customer:</strong> {batch.customer}
          </p>
          <p>
            <strong>Email:</strong> {batch.email}
          </p>
          <p>
            <strong>Phone:</strong> {batch.phone}
          </p>
          <p>
            <strong>Address:</strong> {batch.address}
          </p>
          <p>
            <strong>Material Type:</strong> {batch.materialType}
          </p>
          <p>
            <strong>Diamond Weight:</strong> {batch.diamondWeight} carats
          </p>
          <p>
            <strong>Diamond Number:</strong> {batch.diamondNumber}
          </p>
          <p>
            <strong>Expected Date:</strong>{" "}
            {new Date(batch.expectedDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Current Process:</strong> {batch.currentProcess}
          </p>
          <p>
            <strong>Status:</strong> {batch.status}
          </p>
          <p>
            <strong>Progress:</strong>
          </p>
          <ul>
            {Object.keys(batch.progress).map((stage) => (
              <li key={stage}>
                {stage}: {batch.progress[stage]}%
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BatchModal;
