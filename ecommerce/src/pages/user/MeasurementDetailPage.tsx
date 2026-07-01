import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import measurementStoreApi, { type MeasurementDetail } from "../../api/measurementStoreApi";

const MeasurementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<MeasurementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const measurementId = Number(id);

  const formatSize = (value?: { cm?: number; inches?: number }) => {
    if (!value || value.cm === undefined || value.inches === undefined) return null;
    return `${value.cm.toFixed(1)} cm / ${value.inches.toFixed(2)} in`;
  };

  const measurementRows = (detail: MeasurementDetail) => {
    const m = detail.measurements;
    return [
      // { label: "Neck circumference", value: formatSize(m.neck?.circumference) },
      { label: "Chest circumference", value: formatSize(m.chest?.circumference) },
      { label: "Upper chest circumference", value: formatSize(m.upper_chest?.circumference) },
      { label: "Lower chest circumference", value: formatSize(m.lower_chest?.circumference) },
      { label: "Waist circumference", value: formatSize(m.waist?.circumference) },
      { label: "Hip circumference", value: formatSize(m.hip?.circumference) },
      { label: "Shoulder width", value: formatSize(m.shoulder?.width) },
      { label: "Armhole circumference", value: formatSize(m.armhole?.circumference) },
      { label: "Upper thigh circumference", value: formatSize(m.upper_thigh?.circumference) },
      { label: "Knee circumference", value: formatSize(m.knee?.circumference) },
      { label: "Body length", value: formatSize(m.body_length?.length) },
      // { label: "Arm shoulder to elbow", value: formatSize(m.arm?.shoulder_to_elbow) },
      // { label: "Arm total length", value: formatSize(m.arm?.total_length) },
      // { label: "Arm hand to elbow", value: formatSize(m.arm?.hand_to_elbow) },
    ].filter((row) => !!row.value);
  };

  useEffect(() => {
    if (!measurementId) return;
    const load = async () => {
      try {
        const res = await measurementStoreApi.getById(measurementId);
        setData(res);
      } catch (err) {
        toast.error("Failed to load measurement");
        navigate("/measurements/history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [measurementId, navigate]);

  const handleDelete = async () => {
    if (!measurementId) return;
    try {
      await measurementStoreApi.delete(measurementId);
      toast.success("Measurement deleted");
      navigate("/measurements/history");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-10">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!data) {
    return null;
  }

  const rows = measurementRows(data);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/measurements/history")}
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80"
          >
            <span aria-hidden="true">←</span>
            Back to My Measurements
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif">Measurement Detail</h2>
            <p className="text-muted-foreground text-sm">ID: {data.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-lg">Summary</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Gender: {data.gender}</li>
              <li>Age: {data.age}</li>
              <li>Height: {data.heightCm.toFixed(2)} cm</li>
              <li>Weight: {data.weightKg.toFixed(2)} kg</li>
              <li>
                BMI: {data.bmi.toFixed(1)} ({data.bmiCategory})
              </li>
              <li>Body Type: {data.bodyType}</li>
              <li>Recommended Size: {data.recommendedSize}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-lg">Key Measurements</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {rows.slice(0, 6).map((row) => (
                <li key={row.label}>
                  {row.label}: {row.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-3 text-lg">All Measurements</h3>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No measurements available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2"
                >
                  <p className="text-foreground font-medium">{row.label}</p>
                  <p>{row.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MeasurementDetailPage;
