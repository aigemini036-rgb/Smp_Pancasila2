import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Calendar, ShieldCheck, Landmark } from 'lucide-react';

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  icon?: 'calendar' | 'shield' | 'landmark';
}

interface AnimatedTimelineDrawProps {
  milestones: MilestoneItem[];
}

export default function AnimatedTimelineDraw({ milestones }: AnimatedTimelineDrawProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });

  const getIcon = (type?: string) => {
    switch (type) {
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'landmark':
        return <Landmark className="w-3.5 h-3.5" />;
      default:
        return <Calendar className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-6 pt-4">
      {/* Horizontal Line Drawer for Desktop */}
      <div className="hidden sm:block absolute top-12 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 z-0">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 origin-left"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-6 relative z-10">
        {milestones.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.95 }}
            transition={{
              duration: 0.6,
              delay: 0.2 + index * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-yellow-500/50 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-black uppercase tracking-wider border border-yellow-500/20">
                  {getIcon(item.icon)}
                  {item.year}
                </span>
                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-yellow-500 transition-colors" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
