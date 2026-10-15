import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import announcementApi from '../../api/announcementApi';
import type { AnnouncementPopup } from '../../types';
import RichHtml from './RichHtml';

interface AnnouncementPopupModalProps {
  previewData?: AnnouncementPopup | null;
  onClosePreview?: () => void;
}

const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8010';

/** Return true if hex color is light (use dark text for contrast) */
function isLightBg(hex?: string) {
  if (!hex || typeof hex !== 'string') return true;
  let h = hex.replace(/^#/, '').trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

export const AnnouncementPopupModal: React.FC<AnnouncementPopupModalProps> = ({
  previewData,
  onClosePreview,
}) => {
  const [popup, setPopup] = useState<AnnouncementPopup | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const isPreview = Boolean(previewData);

  const getStorageKey = (item: AnnouncementPopup) =>
    `styliste_announcement_${item.id}_${item.updatedAt || item.createdAt || 'v1'}`;

  useEffect(() => {
    if (previewData) {
      setPopup(previewData);
      setIsOpen(true);
      return;
    }

    // Public visitor fetch
    let isMounted = true;
    const fetchActive = async () => {
      try {
        const active = await announcementApi.getActiveAnnouncement();
        if (!isMounted || !active) return;

        // Check if dismissed in this browser session
        const storageKey = getStorageKey(active);
        const dismissed = sessionStorage.getItem(storageKey);
        if (!dismissed) {
          setPopup(active);
          // Brief delay for pleasant entrance
          setTimeout(() => {
            if (isMounted) setIsOpen(true);
          }, 600);
        }
      } catch (err) {
        console.error('Failed to load announcement popup', err);
      }
    };

    fetchActive();

    return () => {
      isMounted = false;
    };
  }, [previewData]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (popup && !isPreview) {
      sessionStorage.setItem(getStorageKey(popup), 'dismissed');
    }
    if (onClosePreview) {
      onClosePreview();
    }
  };

  const handleAction = () => {
    if (!popup) return;
    handleClose();

    if (popup.buttonLink) {
      if (popup.buttonLink.startsWith('http://') || popup.buttonLink.startsWith('https://')) {
        window.open(popup.buttonLink, '_blank');
      } else {
        navigate(popup.buttonLink);
      }
    }
  };

  if (!popup) return null;

  // Resolve image URL
  const getImageSrc = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    return `${SERVER_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const imageSrc = getImageSrc(popup.imageUrl);
  const customBg = popup.backgroundColor?.trim();
  const isLight = customBg ? isLightBg(customBg) : true;
  const isDark = !isLight;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              ...(customBg ? { backgroundColor: customBg } : {}),
              maxWidth: popup.popupWidth ? `${popup.popupWidth}px` : undefined,
              maxHeight: popup.popupMaxHeight ? `${popup.popupMaxHeight}px` : '90vh',
            }}
            className={`relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl border transition-all ${
              customBg
                ? isDark
                  ? 'border-white/20 text-white'
                  : 'border-black/10 text-dark-900'
                : 'bg-white border-[#8FAE8B]/30 text-dark-900 dark:border-dark-700'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Pinned at top right */}
            <button
              onClick={handleClose}
              className={`absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-black/40 text-white/90 hover:bg-black/60 hover:text-white'
                  : 'bg-white/80 text-dark-700 hover:bg-white hover:text-dark-900'
              }`}
              aria-label="Close announcement"
            >
              <FiX size={20} />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">
              {/* Optional Image Banner */}
              {imageSrc && (
                <div className="relative h-48 sm:h-56 w-full flex-shrink-0 overflow-hidden bg-gray-50/10">
                  <img
                    src={imageSrc}
                    alt={popup.title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              )}

              {/* Content Body */}
              <div className="p-6 text-center sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {popup.subtitle && (
                    <span
                      className={`inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-3 border ${
                        isDark
                          ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm'
                          : 'bg-[#8FAE8B]/15 text-[#3f4f2c] border-[#8FAE8B]/30'
                      }`}
                    >
                      {popup.subtitle}
                    </span>
                  )}

                  <h3
                    className={`text-xl sm:text-2xl font-serif font-bold leading-snug ${
                      isDark ? 'text-white' : 'text-dark-900'
                    }`}
                  >
                    {popup.title}
                  </h3>

                  {popup.content && (
                    <div
                      className={`mt-4 text-sm leading-relaxed ${
                        isDark ? 'text-white/90' : 'text-dark-600'
                      }`}
                    >
                      <RichHtml html={popup.content} />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
                  {popup.buttonText && (
                    <button
                      onClick={handleAction}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#8FAE8B] hover:bg-[#7E9F7A] text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
                    >
                      <span>{popup.buttonText}</span>
                      {popup.buttonLink && popup.buttonLink.startsWith('http') ? (
                        <FiExternalLink size={16} />
                      ) : (
                        <FiArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleClose}
                    className={
                      popup.buttonText
                        ? `w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            isDark
                              ? 'text-white/80 hover:text-white hover:bg-white/10'
                              : 'text-dark-500 hover:text-dark-800 hover:bg-dark-50'
                          }`
                        : 'w-full sm:w-auto px-8 py-2.5 rounded-lg bg-[#8FAE8B] hover:bg-[#7E9F7A] text-white font-medium shadow-md transition-all cursor-pointer active:scale-95 text-sm'
                    }
                  >
                    {popup.buttonText ? 'Dismiss' : 'Got It'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Tag Banner if in Admin Preview */}
            {isPreview && (
              <div className="bg-[#5c6a42] text-white text-center py-1 text-xs font-bold uppercase tracking-wider flex-shrink-0">
                Preview Mode
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AnnouncementPopupModal;
