import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    screenshots: string[];
  } | null;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.screenshots.length - 1 : prev - 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gray-900/50">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={project.screenshots[currentImageIndex]}
                  alt={`Screenshot ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              {project.screenshots.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails / Footer */}
            <div className="p-4 bg-gray-900 border-t border-white/10 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {project.screenshots.map((shot, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-purple-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={shot} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
