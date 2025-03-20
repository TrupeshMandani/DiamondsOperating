// File: frontend/components/QRCodeBatch.jsx
import { useEffect, useState } from "react";

const QRCodeBatch = ({ batchId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!batchId) {
      console.error("No batchId provided to QRCodeBatch");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5023/api/batches/${batchId}/generate-label`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch QR code: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        if (data.qrCode) {
          setQrCodeUrl(data.qrCode);
        } else {
          throw new Error("QR Code data is missing in the response");
        }
      })
      .catch((err) => {
        console.error("Error fetching QR code:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [batchId]);

  if (loading) return <p>Loading QR Code...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!qrCodeUrl) return <p>No QR Code Available</p>;

  return (
    <div>
      <img src={qrCodeUrl} alt="QR Code" style={{ width: 128, height: 128 }} />
      <a href={qrCodeUrl} download={`batch-${batchId}-qrcode.png`}>
        Download QR Code
      </a>
    </div>
  );
};

export default QRCodeBatch;
