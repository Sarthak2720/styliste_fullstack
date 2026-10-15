import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Upload,
  X,
  Sparkles,
  Megaphone,
  Maximize2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import announcementApi from '../../api/announcementApi';
import type { AnnouncementPopup } from '../../types';
import AnnouncementPopupModal from '../../components/common/AnnouncementPopupModal';
import RichTextField from '../../components/admin/RichTextField';
import { getErrorMessage } from '../../utils/errorHandler';

const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8010';

const SECTION_BG_SWATCHES = [
  '#3D5A36', // dark green
  '#4F6D48', // olive green
  '#6B7F5E', // sage green
  '#1E3A4C', // navy blue
  '#263238', // dark navy / charcoal blue
  '#4A2228', // maroon
  '#7A2E3A', // dark red
  '#2C2C2C', // charcoal
  '#FFFFFF', // white
  '#F7F6F3', // off-white / light cream
];

function SectionBackgroundControls({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const current = (value || '').toUpperCase();
  return (
    <div className="p-3.5 rounded-xl bg-[#F5F7F2] border border-[#E2E8DE]">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-dark-700 uppercase tracking-wide">
          Background Colour
        </label>
        {current && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-dark-500 hover:text-dark-800 underline cursor-pointer"
          >
            Clear (Use Default)
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {SECTION_BG_SWATCHES.map((clr) => (
          <button
            key={clr}
            type="button"
            onClick={() => onChange(clr)}
            style={{ backgroundColor: clr }}
            className={`w-6 h-6 rounded-full border transition-all hover:scale-110 cursor-pointer ${
              current === clr.toUpperCase()
                ? 'ring-2 ring-offset-2 ring-dark-800 border-dark-900 shadow-sm'
                : 'border-gray-300'
            }`}
            title={clr}
          />
        ))}
        <span className="text-xs text-dark-500 ml-2 font-medium">Custom:</span>
        <input
          type="color"
          value={current || '#FFFFFF'}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-gray-300 p-0.5 cursor-pointer bg-white"
        />
        {current && (
          <span className="text-xs font-mono text-dark-600 bg-white px-2 py-0.5 rounded border border-gray-200">
            {current}
          </span>
        )}
      </div>
    </div>
  );
}

function PopupDimensionControls({
  width,
  maxHeight,
  onWidthChange,
  onMaxHeightChange,
}: {
  width: number;
  maxHeight: number | null;
  onWidthChange: (w: number) => void;
  onMaxHeightChange: (h: number | null) => void;
}) {
  const WIDTH_PRESETS = [
    { label: 'Compact', value: 420 },
    { label: 'Standard', value: 520 },
    { label: 'Wide', value: 640 },
    { label: 'Extra Wide', value: 760 },
  ];

  const HEIGHT_PRESETS: Array<{ label: string; value: number | null }> = [
    { label: 'Auto (Fit)', value: null },
    { label: 'Compact (480px)', value: 480 },
    { label: 'Standard (580px)', value: 580 },
    { label: 'Tall (700px)', value: 700 },
  ];

  return (
    <div className="p-3.5 rounded-xl bg-[#F5F7F2] border border-[#E2E8DE] space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 size={15} className="text-[#5c6a42]" />
          <label className="text-xs font-semibold text-dark-800 uppercase tracking-wide">
            Popup Size & Dimensions
          </label>
        </div>
        <span className="text-[11px] text-dark-600 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
          {width || 520}px W × {maxHeight ? `${maxHeight}px H` : 'Auto H'}
        </span>
      </div>

      {/* Width Control */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-dark-700">Width:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={360}
              max={850}
              step={10}
              value={width || 520}
              onChange={(e) => onWidthChange(Math.max(300, Math.min(900, Number(e.target.value) || 520)))}
              className="w-16 px-2 py-0.5 text-xs text-right font-mono rounded border border-gray-300 bg-white"
            />
            <span className="text-xs text-dark-500">px</span>
          </div>
        </div>

        {/* Preset Buttons for Width */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {WIDTH_PRESETS.map((p) => {
            const isSelected = (width || 520) === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onWidthChange(p.value)}
                className={`py-1 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8FAE8B] text-white border-[#7E9F7A] shadow-xs'
                    : 'bg-white text-dark-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>{p.label}</div>
                <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-dark-400'}`}>{p.value}px</div>
              </button>
            );
          })}
        </div>

        {/* Slider for Width */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-dark-400 font-mono">360px</span>
          <input
            type="range"
            min={360}
            max={850}
            step={10}
            value={width || 520}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="flex-1 accent-[#8FAE8B] cursor-pointer"
          />
          <span className="text-[10px] text-dark-400 font-mono">850px</span>
        </div>
      </div>

      {/* Height / Length Control */}
      <div className="pt-2.5 border-t border-[#E2E8DE]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-dark-700">Height / Length:</span>
          <div className="flex items-center gap-1.5">
            {maxHeight ? (
              <>
                <input
                  type="number"
                  min={350}
                  max={900}
                  step={10}
                  value={maxHeight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onMaxHeightChange(val > 0 ? val : null);
                  }}
                  className="w-16 px-2 py-0.5 text-xs text-right font-mono rounded border border-gray-300 bg-white"
                />
                <span className="text-xs text-dark-500">px</span>
                <button
                  type="button"
                  onClick={() => onMaxHeightChange(null)}
                  className="text-[11px] text-[#5c6a42] hover:underline ml-1 cursor-pointer font-medium"
                >
                  Reset to Auto
                </button>
              </>
            ) : (
              <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Auto (Content Fit)
              </span>
            )}
          </div>
        </div>

        {/* Preset Buttons for Height */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {HEIGHT_PRESETS.map((p) => {
            const isSelected = p.value === null ? !maxHeight : maxHeight === p.value;
            return (
              <button
                key={String(p.value)}
                type="button"
                onClick={() => onMaxHeightChange(p.value)}
                className={`py-1 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8FAE8B] text-white border-[#7E9F7A] shadow-xs'
                    : 'bg-white text-dark-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>{p.label}</div>
              </button>
            );
          })}
        </div>

        {Boolean(maxHeight) && (
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-dark-400 font-mono">350px</span>
            <input
              type="range"
              min={350}
              max={900}
              step={10}
              value={Number(maxHeight) || 580}
              onChange={(e) => onMaxHeightChange(Number(e.target.value) || null)}
              className="flex-1 accent-[#8FAE8B] cursor-pointer"
            />
            <span className="text-[10px] text-dark-400 font-mono">900px</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-dark-500 italic">
        📱 <strong>Mobile Note:</strong> Popups automatically adapt to 100% responsive width on mobile screens to prevent overflow.
      </p>
    </div>
  );
}

function getAssetUrl(url?: string) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${SERVER_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementPopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementPopup | null>(null);
  const [previewItem, setPreviewItem] = useState<AnnouncementPopup | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    content: string;
    backgroundColor: string;
    imageUrl: string;
    popupWidth: number;
    popupMaxHeight: number | null;
    enabled: boolean;
    startDate: string;
    endDate: string;
  }>({
    title: '',
    subtitle: '',
    content: '',
    backgroundColor: '',
    imageUrl: '',
    popupWidth: 520,
    popupMaxHeight: null,
    enabled: true,
    startDate: '',
    endDate: '',
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementApi.getAllAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to fetch announcements'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const isAnyModalOpen = modalOpen || Boolean(previewItem);
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen, previewItem]);

  // Find which popup is currently served to visitors on website (most recently updated/created active popup)
  const currentlyActiveId = useMemo(() => {
    const now = new Date();
    const activeCandidates = announcements
      .filter((a) => a.enabled)
      .filter((a) => !a.startDate || new Date(a.startDate) <= now)
      .filter((a) => !a.endDate || new Date(a.endDate) >= now)
      .sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt).getTime();
        return timeB - timeA;
      });

    return activeCandidates.length > 0 ? activeCandidates[0].id : null;
  }, [announcements]);

  // Compute status for an announcement
  const getStatusInfo = (item: AnnouncementPopup) => {
    if (!item.enabled) {
      return {
        label: 'Disabled',
        sublabel: 'Turn on toggle to enable',
        color: 'bg-gray-100 text-gray-600 border-gray-300',
        dot: 'bg-gray-400',
        isCurrentlyActive: false,
        isStandby: false,
      };
    }

    const now = new Date();
    if (item.endDate && new Date(item.endDate) < now) {
      return {
        label: 'Expired',
        sublabel: 'Schedule period ended',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        isCurrentlyActive: false,
        isStandby: false,
      };
    }

    if (item.startDate && new Date(item.startDate) > now) {
      return {
        label: 'Scheduled',
        sublabel: 'Starts in future',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        isCurrentlyActive: false,
        isStandby: false,
      };
    }

    // Both are within schedule and enabled:
    if (item.id === currentlyActiveId) {
      return {
        label: 'Live on Site',
        sublabel: 'Currently Showing',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
        dot: 'bg-emerald-500 animate-pulse',
        isCurrentlyActive: true,
        isStandby: false,
      };
    }

    return {
      label: 'Standby (Queued)',
      sublabel: 'Overridden by top popup',
      color: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-400',
      isCurrentlyActive: false,
      isStandby: true,
    };
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = announcements.length;
    let live = 0;
    let standby = 0;
    let scheduled = 0;
    let inactive = 0;

    const now = new Date();
    announcements.forEach((a) => {
      if (!a.enabled) {
        inactive++;
      } else if (a.endDate && new Date(a.endDate) < now) {
        inactive++;
      } else if (a.startDate && new Date(a.startDate) > now) {
        scheduled++;
      } else {
        if (a.id === currentlyActiveId) {
          live++;
        } else {
          standby++;
        }
      }
    });

    return { total, live, standby, scheduled, inactive };
  }, [announcements, currentlyActiveId]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      backgroundColor: '',
      imageUrl: '',
      popupWidth: 520,
      popupMaxHeight: null,
      enabled: true,
      startDate: '',
      endDate: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AnnouncementPopup) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      content: item.content || '',
      backgroundColor: item.backgroundColor || '',
      imageUrl: item.imageUrl || '',
      popupWidth: item.popupWidth || 520,
      popupMaxHeight: item.popupMaxHeight || null,
      enabled: item.enabled,
      startDate: item.startDate ? item.startDate.slice(0, 16) : '',
      endDate: item.endDate ? item.endDate.slice(0, 16) : '',
    });
    setModalOpen(true);
  };

  const handleMakeActive = async (item: AnnouncementPopup) => {
    try {
      const updated = await announcementApi.updateAnnouncement(item.id, {
        title: item.title,
        subtitle: item.subtitle,
        content: item.content,
        backgroundColor: item.backgroundColor,
        imageUrl: item.imageUrl,
        popupWidth: item.popupWidth,
        popupMaxHeight: item.popupMaxHeight,
        buttonText: item.buttonText,
        buttonLink: item.buttonLink,
        enabled: true,
        startDate: null,
        endDate: item.endDate,
      });
      setAnnouncements((prev) => [
        updated,
        ...prev.filter((p) => p.id !== updated.id),
      ]);
      toast.success(`"${updated.title}" is now the active popup on the website!`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to set active popup'));
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await announcementApi.toggleEnabled(id);
      setAnnouncements((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success(`Popup ${updated.enabled ? 'Enabled' : 'Disabled'}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update popup status'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement popup?')) {
      return;
    }
    try {
      await announcementApi.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      toast.success('Announcement deleted');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete announcement'));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    setUploadingImage(true);
    try {
      const res = await announcementApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to upload image'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Start date cannot be after End date');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<AnnouncementPopup> = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || undefined,
        content: formData.content.trim() || undefined,
        backgroundColor: formData.backgroundColor.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        popupWidth: formData.popupWidth ? Number(formData.popupWidth) : 520,
        popupMaxHeight: formData.popupMaxHeight ? Number(formData.popupMaxHeight) : null,
        buttonText: null,
        buttonLink: null,
        enabled: formData.enabled,
        startDate: formData.startDate ? formData.startDate : null,
        endDate: formData.endDate ? formData.endDate : null,
      };

      if (editingItem) {
        const updated = await announcementApi.updateAnnouncement(editingItem.id, payload);
        setAnnouncements((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast.success('Announcement updated successfully');
      } else {
        const created = await announcementApi.createAnnouncement(payload);
        setAnnouncements((prev) => [created, ...prev]);
        toast.success('New announcement created successfully');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to save announcement'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Announcement Popups</h2>
          <p className="text-dark-600 mt-1">
            Create scheduled popup announcements, promotional sales, and alerts for visitors on your website.
          </p>
        </div>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-[#8FAE8B] text-white hover:bg-[#7E9F7A] transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>New Popup</span>
          </motion.button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl shadow-sm border border-dark-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">Total Popups</p>
            <p className="text-2xl font-bold text-dark-900 mt-1">{stats.total}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-dark-600 border border-gray-100">
            <Megaphone size={20} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border border-dark-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#5c6a42] font-semibold uppercase tracking-wider">Live on Site</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#5c6a42]">{stats.live}</span>
              {stats.standby > 0 && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  +{stats.standby} Standby
                </span>
              )}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#8FAE8B]/15 flex items-center justify-center text-[#5c6a42] border border-[#8FAE8B]/30">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border border-dark-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Scheduled</p>
            <p className="text-2xl font-bold text-amber-800 mt-1">{stats.scheduled}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 border border-amber-200">
            <Clock size={20} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-sm border border-dark-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">Disabled / Expired</p>
            <p className="text-2xl font-bold text-dark-500 mt-1">{stats.inactive}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-dark-500 border border-gray-200">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* --- MAIN TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-dark-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-gray-50/50">
          <div>
            <h3 className="text-base font-semibold text-dark-900">All Popups & Schedules</h3>
            <p className="text-xs text-dark-500 mt-0.5">
              💡 <strong>System Rule:</strong> The website displays only <strong>1 active popup</strong> at a time. The most recent active popup is shown <strong>Live on Site</strong>, while other overlapping active popups remain on <strong>Standby</strong>.
            </p>
          </div>
          <span className="text-xs text-dark-500 font-medium whitespace-nowrap">{announcements.length} Popups configured</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-dark-400">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#8FAE8B]/15 text-[#5c6a42] flex items-center justify-center mx-auto mb-3">
              <Megaphone size={26} />
            </div>
            <h3 className="text-lg font-medium text-dark-800 font-serif">No Announcement Popups Yet</h3>
            <p className="text-sm text-dark-500 mt-1 max-w-sm mx-auto">
              Create your first popup banner to inform website visitors about offers or new collections.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#8FAE8B] hover:bg-[#7E9F7A] text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Create Popup
            </motion.button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-50 text-xs text-dark-500 uppercase tracking-wider border-b border-dark-200">
                  <th className="py-3.5 px-4 font-semibold">Banner</th>
                  <th className="py-3.5 px-4 font-semibold">Title & Details</th>
                  <th className="py-3.5 px-4 font-semibold">Schedule Period</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Enable / Disable</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200 text-sm">
                {announcements.map((item) => {
                  const status = getStatusInfo(item);
                  const bannerUrl = getAssetUrl(item.imageUrl);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Banner Thumbnail */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {bannerUrl ? (
                          <img
                            src={bannerUrl}
                            alt={item.title}
                            className="w-14 h-10 object-cover rounded-lg border border-gray-200 shadow-xs"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                            No Img
                          </div>
                        )}
                      </td>

                      {/* Title & Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-dark-900 truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-xs text-[#5c6a42] font-medium truncate">{item.subtitle}</div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono text-dark-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                            {item.popupWidth || 520}px W × {item.popupMaxHeight ? `${item.popupMaxHeight}px H` : 'Auto H'}
                          </span>
                        </div>
                      </td>

                      {/* Schedule Period */}
                      <td className="py-3.5 px-4 text-xs text-dark-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-dark-700">
                          <Calendar size={13} className="text-[#8FAE8B]" />
                          <span>
                            {item.startDate ? format(new Date(item.startDate), 'MMM dd, yyyy HH:mm') : 'Immediate'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-dark-500 mt-1">
                          <Clock size={13} className="text-dark-400" />
                          <span>
                            to {item.endDate ? format(new Date(item.endDate), 'MMM dd, yyyy HH:mm') : 'No Expiry'}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                          {status.sublabel && (
                            <span className="text-[11px] text-dark-500 font-medium">
                              {status.sublabel}
                            </span>
                          )}
                          {status.isStandby && (
                            <button
                              type="button"
                              onClick={() => handleMakeActive(item)}
                              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#5c6a42] hover:text-[#3f4f2c] underline cursor-pointer"
                              title="Make this popup active on the website now"
                            >
                              <span>Show this instead</span>
                              <Sparkles size={11} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Quick Toggle */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className="inline-flex items-center text-2xl transition-transform hover:scale-110 cursor-pointer"
                          title={item.enabled ? 'Click to disable' : 'Click to enable'}
                        >
                          {item.enabled ? (
                            <ToggleRight className="text-[#8FAE8B]" size={32} />
                          ) : (
                            <ToggleLeft className="text-gray-300" size={32} />
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 text-gray-500 hover:text-[#5c6a42] hover:bg-[#8FAE8B]/15 rounded-lg transition-colors cursor-pointer"
                            title="Live Preview"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-gray-500 hover:text-dark-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-dark-200 overflow-hidden z-10 my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#5c6a42]" />
                    <h3 className="text-lg font-serif font-bold text-dark-900">
                      {editingItem ? 'Edit Announcement Popup' : 'Create New Announcement Popup'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-400 hover:text-dark-800 p-1 rounded-lg cursor-pointer transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-dark-700 uppercase tracking-wide mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Festive Offer: 20% OFF on Designer Sarees"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] text-sm"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-dark-700 uppercase tracking-wide mb-1">
                  Subtitle / Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Limited Time Special Offer"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] text-sm"
                />
              </div>

              {/* Background Color Palette & Custom Picker */}
              <div>
                <SectionBackgroundControls
                  value={formData.backgroundColor}
                  onChange={(color) => setFormData((prev) => ({ ...prev, backgroundColor: color }))}
                />
              </div>

              {/* Popup Size & Dimensions (Width & Height) */}
              <div>
                <PopupDimensionControls
                  width={formData.popupWidth}
                  maxHeight={formData.popupMaxHeight}
                  onWidthChange={(w) => setFormData((prev) => ({ ...prev, popupWidth: w }))}
                  onMaxHeightChange={(h) => setFormData((prev) => ({ ...prev, popupMaxHeight: h }))}
                />
              </div>

              {/* Content / Details with Rich Text Editor & Icon Hub */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-dark-700 uppercase tracking-wide">
                    Content / Details
                  </label>
                  <span className="text-[11px] text-[#5c6a42] font-medium">
                    Rich text formatting, emojis & icons supported
                  </span>
                </div>
                <div className="relative rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#8FAE8B] focus-within:border-[#8FAE8B]">
                  <RichTextField
                    value={formData.content}
                    onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                    placeholder="Write details, apply bold/italics, change fonts & colors, add emojis or icons..."
                    minHeight={130}
                  />
                </div>
              </div>

              {/* Image Banner Upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-dark-700 uppercase tracking-wide mb-1">
                  Banner Image (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or upload below..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B] text-sm"
                  />
                  <label className="cursor-pointer px-4 py-2 bg-[#8FAE8B]/15 hover:bg-[#8FAE8B]/25 text-[#3f4f2c] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#8FAE8B]/30 transition-colors">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getAssetUrl(formData.imageUrl)}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>



              {/* Scheduler: Start & End Date Time */}
              <div className="p-4 bg-[#8FAE8B]/10 rounded-xl border border-[#8FAE8B]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#4a5a35] font-semibold text-xs uppercase tracking-wide">
                    <Calendar size={15} />
                    <span>Scheduler (When to display)</span>
                  </div>
                  {formData.startDate && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, startDate: '' })}
                      className="text-xs font-semibold text-[#5c6a42] hover:text-[#384323] hover:underline cursor-pointer"
                    >
                      ⚡ Show Immediately (Clear Date)
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-dark-700 font-medium">Start Date & Time</label>
                      {formData.startDate && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, startDate: '' })}
                          className="text-[11px] text-gray-500 hover:text-dark-800 underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                    />
                    <p className="text-[11px] text-dark-500 mt-1">
                      {formData.startDate ? 'Scheduled to show from this time' : '⚡ Starts immediately upon saving'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-dark-700 font-medium">End Date & Time</label>
                      {formData.endDate && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, endDate: '' })}
                          className="text-[11px] text-gray-500 hover:text-dark-800 underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs focus:ring-2 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                    />
                    <p className="text-[11px] text-dark-500 mt-1">
                      {formData.endDate ? 'Stops showing after this time' : '∞ Shows indefinitely (no expiry)'}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-dark-600 bg-white/70 p-2 rounded-lg border border-[#8FAE8B]/20">
                  💡 <strong>Pro Tip:</strong> Leave <em>Start Date & Time</em> empty to show immediately on the website without any timezone delays. Only set dates if you want to schedule it for a future day.
                </p>
              </div>

              {/* Enabled Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-sm font-semibold text-dark-800">Status</span>
                  <p className="text-xs text-dark-400">
                    {formData.enabled ? 'Popup is enabled' : 'Popup is disabled'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                  className="text-3xl transition-transform hover:scale-105 cursor-pointer"
                >
                  {formData.enabled ? <ToggleRight className="text-[#8FAE8B]" size={36} /> : <ToggleLeft className="text-gray-300" size={36} />}
                </button>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewItem({
                      id: 0,
                      title: formData.title || 'Sample Announcement Title',
                      subtitle: formData.subtitle,
                      content: formData.content || 'Your announcement message will look like this to website visitors.',
                      backgroundColor: formData.backgroundColor,
                      imageUrl: formData.imageUrl,
                      popupWidth: formData.popupWidth ? Number(formData.popupWidth) : 520,
                      popupMaxHeight: formData.popupMaxHeight ? Number(formData.popupMaxHeight) : null,
                      buttonText: null,
                      buttonLink: null,
                      enabled: true,
                      createdAt: new Date().toISOString(),
                    });
                  }}
                  className="px-4 py-2 rounded-lg text-[#3f4f2c] bg-[#8FAE8B]/15 hover:bg-[#8FAE8B]/25 font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye size={16} /> Live Preview
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-dark-600 hover:bg-gray-100 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-[#8FAE8B] hover:bg-[#7E9F7A] text-white text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Saving...' : editingItem ? 'Update Popup' : 'Create Popup'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )}

      {/* Live Preview Modal */}
      {previewItem && (
        <AnnouncementPopupModal
          previewData={previewItem}
          onClosePreview={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

export default AdminAnnouncements;
