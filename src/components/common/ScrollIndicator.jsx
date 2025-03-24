import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function ScrollIndicator({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0.4, 1, 0.4], 
        y: [0, 8, 0] 
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-white">
        <span className="text-sm mb-2">Scroll Down</span>
        <ChevronDownIcon className="h-6 w-6 animate-bounce" />
      </div>
    </motion.div>
  );
} 