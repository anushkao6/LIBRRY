import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{type === 'success' ? '✅' : '❌'}</span>
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;

