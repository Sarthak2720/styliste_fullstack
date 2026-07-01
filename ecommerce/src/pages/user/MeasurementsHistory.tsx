import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import measurementStoreApi, { type MeasurementSummary } from "../../api/measurementStoreApi";

const MeasurementsHistory = () => {
  const [items, setItems] = useState<MeasurementSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await measurementStoreApi.listMine();
        setItems(data);
      } catch (err) {
        toast.error("Failed to load measurements");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const content = () => {
    if (loading) {
      return <p className="text-muted-foreground">Loading measurements...</p>;
    }

    if (items.length === 0) {
      return (
        <>
          <h2 className="text-2xl font-serif mb-2">My Measurements</h2>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t saved any measurements yet.
          </p>
          <Link to="/measurements" className="text-primary font-semibold">
            Submit your measurements
          </Link>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-serif">My Measurements</h2>
          <Link to="/measurements" className="text-primary font-semibold">
            New Measurement
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(item.createdAt), "dd MMM yyyy, HH:mm")}
                </p>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {item.recommendedSize}
                </span>
              </div>
              <p className="font-semibold text-foreground capitalize">{item.gender}</p>
              <p className="text-sm text-muted-foreground">
                Age {item.age} - BMI {item.bmi.toFixed(1)} ({item.bmiCategory})
              </p>
              <p className="text-sm text-muted-foreground">Body type: {item.bodyType}</p>
              <Link
                to={`/measurements/${item.id}`}
                className="mt-3 inline-flex items-center gap-2 text-primary font-semibold"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-10 space-y-6">{content()}</div>
      <Footer />
    </>
  );
};

export default MeasurementsHistory;
