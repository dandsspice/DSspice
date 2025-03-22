import { motion } from 'framer-motion';

export const AnimatedButton = ({ children, className, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

export const AnimatedLink = ({ children, className, ...props }) => (
  <motion.a
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={className}
    {...props}
  >
    {children}
  </motion.a>
);

export const AnimatedSection = ({ children, className, ...props }) => (
  <motion.section
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={{
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: { duration: 0.8 }
      }
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.section>
);

export const AnimatedImage = ({ src, alt, className, ...props }) => (
  <motion.img
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    src={src}
    alt={alt}
    className={className}
    {...props}
  />
);

export const AnimatedText = ({ children, delay = 0, className, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedCard = ({ children, className, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
); 