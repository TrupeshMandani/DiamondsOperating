// File: frontend/components/QRCodeBatch.jsx
import { useEffect, useState } from "react";

const QRCodeBatch = ({ batchId }) => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!batchId) {
      console.error("No batchId provided to QRCodeBatch");
      setLoading(false);
      return;
    }

    fetch(`/qr-codes/${batchId}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch QR code JSON: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setQrCodeData(data);
      })
      .catch((err) => {
        console.error("Error fetching QR code JSON:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [batchId]);

  if (loading) return <p>Loading QR Code...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!qrCodeData) return <p>No QR Code Data</p>;

  return (
    <div>
      <img src={qrCodeData.qrCode} alt="QR Code" style={{ width: 128, height: 128 }} />
      <a href={qrCodeData.qrCode} download={`batch-${batchId}-qrcode.png`}>
        Download QR Code
      </a>
    </div>
  );
};

export default QRCodeBatch;
