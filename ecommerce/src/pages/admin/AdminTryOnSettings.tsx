import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";

const AdminTryOnSettings = () => {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    fetchKey();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.post("/settings/lightx_api_key", {
        value: apiKeyInput.trim()
      });
      toast.success("LightX API Key saved to database successfully!");
    } catch (error) {
      console.error("Failed to save LightX API Key:", error);
      toast.error("Failed to save settings.");
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
    </div>
  );
};

export default AdminTryOnSettings;
