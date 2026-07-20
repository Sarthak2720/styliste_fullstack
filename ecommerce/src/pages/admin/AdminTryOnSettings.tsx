import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";

interface TryOnRecord {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  productId: number;
  productName: string;
  productImage: string | null;
  userImageUrl: string;
  resultImageUrl: string;
  createdAt: string;
}

const AdminTryOnSettings = () => {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<TryOnRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await axiosInstance.get<{ key: string; value: string | null }>(
          "/settings/lightx_api_key"
        );
        setApiKeyInput(response.data.value || "");
      } catch (error) {
        console.error("Failed to load LightX API Key:", error);
        toast.error("Failed to load API settings.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get<TryOnRecord[]>("/try-on/admin/history");
        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to load try-on history:", error);
        toast.error("Failed to load try-on history.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchKey();
    fetchHistory();
  }, []);

  const handleSave = async () => {
    const trimmedValue = apiKeyInput.trim();

    if (!trimmedValue) {
      toast.error("Please enter a valid LightX API key.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        key: "lightx_api_key",
        value: trimmedValue,
        name: "lightx_api_key"
      };

      const response = await axiosInstance.post("/settings/lightx_api_key", payload);
      console.log("Save response:", response.data);
      toast.success("LightX API Key saved successfully!");
    } catch (error: any) {
      console.error("Failed to save LightX API Key:", error);
      const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to save settings.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">
          Virtual Try-On Settings
        </h1>
        <p className="text-dark-600">
          Configure API keys and other settings for the virtual try-on feature.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 border border-dark-200 bg-white"
      >
        <h2 className="text-xl font-bold text-dark-900 mb-6 flex items-center gap-2">
          <span>🔧</span> API Configuration
        </h2>
        
        <div className="max-w-xl space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              LightX API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                disabled={loading}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={loading ? "Loading API key..." : "Enter your LightX API Key..."}
                className="w-full rounded-xl border border-gray-300 pl-4 pr-16 py-3 text-gray-800 focus:border-[#7F8F72] focus:ring-2 focus:ring-[#7F8F72]/20 outline-none transition-all text-sm font-medium disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-gray-100 rounded-md disabled:opacity-50"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              This API key is stored securely in the database and is used for processing virtual try-on requests.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#6B7D60] via-[#7A8D6D] to-[#6B7D60] hover:from-[#5E6E54] hover:to-[#6B7D60] hover:opacity-90 transition-all shadow-md shadow-[#6B7D60]/20 ${(loading || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-dark-200 bg-white p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark-900">📊 Try-On Usage</h2>
            <p className="text-sm text-dark-600">View how many times virtual try-on was used by customers.</p>
          </div>
          <span className="rounded-full bg-[#6B7D60]/10 px-3 py-1 text-sm font-semibold text-[#6B7D60]">
            {history.length} total
          </span>
        </div>

        {historyLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading try-on history...</div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">No try-on records found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">User Image</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Result</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 font-medium text-gray-700">{item.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{item.userName}</div>
                      <div className="mt-1 text-xs text-gray-500">Email: {item.userEmail || "N/A"}</div>
                      <div className="text-xs text-gray-500">Phone: {item.userPhone || "N/A"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{item.productName}</div>
                      <div className="text-xs text-gray-500">Product ID: {item.productId}</div>
                    </td>
                    <td className="px-4 py-3">
                      {item.userImageUrl ? (
                        <a href={item.userImageUrl} target="_blank" rel="noreferrer">
                          <img
                            src={item.userImageUrl}
                            alt="User try-on input"
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.resultImageUrl ? (
                        <a href={item.resultImageUrl} target="_blank" rel="noreferrer">
                          <img
                            src={item.resultImageUrl}
                            alt="Try-on result"
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No result</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminTryOnSettings;
