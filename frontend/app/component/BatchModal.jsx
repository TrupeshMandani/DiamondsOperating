import QRCodeBatch from "./QRCodeBatch";

const BatchModal = ({ isOpen, onClose, batch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl flex">
        {/* Left Side - Batch Details */}
        <div className="w-2/3 pr-6 border-r">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Batch Details - {batch?.batchId}
          </h2>
          <div className="text-left space-y-2">
            <p>
              <strong>Customer:</strong> {batch?.customer}
            </p>
            <p>
              <strong>Email:</strong> {batch?.email}
            </p>
            <p>
              <strong>Phone:</strong> {batch?.phone}
            </p>
            <p>
              <strong>Address:</strong> {batch?.address}
            </p>
            <p>
              <strong>Material Type:</strong> {batch?.materialType}
            </p>
            <p>
              <strong>Diamond Weight:</strong> {batch?.diamondWeight} carats
            </p>
            <p>
              <strong>Diamond Number:</strong> {batch?.diamondNumber}
            </p>
            <p>
              <strong>Expected Date:</strong>{" "}
              {batch?.expectedDate
                ? new Date(batch.expectedDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Current Process:</strong> {batch?.currentProcess}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  batch?.status === "Completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {batch?.status}
              </span>
            </p>
          </div>
        </div>

        {/* Right Side - QR Code */}
        <div className="w-1/3 flex flex-col items-center justify-center pl-6">
          {batch?.batchId ? (
            <QRCodeBatch batchId={batch.batchId} />
          ) : (
            <p className="text-red-500">No QR Code Available</p>
          )}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Close
      </button>
    </div>
  );
};

export default BatchModal;
