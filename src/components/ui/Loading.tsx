import { motion } from 'framer-motion';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Chargement...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full"
      />
      <p className="text-white/80 font-medium">{text}</p>
    </div>
  );
}