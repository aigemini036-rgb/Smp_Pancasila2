import React from 'react';
import { Achievement } from '../../types';
import AchievementCardStack from './AchievementCardStack';

interface AchievementStackShuffleProps {
  achievements: Achievement[];
  title?: string;
  subtitle?: string;
  autoTransitionToGrid?: boolean;
  autoPlayShuffle?: boolean;
  autoPlayDelay?: number;
}

/**
 * AchievementStackShuffle (18. ACHIEVEMENT CARD STACK & 19. ACHIEVEMENT SHUFFLE / REPOSITION)
 * 
 * Re-exports the AchievementCardStack component to ensure both
 * naming conventions are supported seamlessly across the application.
 */
export default function AchievementStackShuffle({
  achievements,
  title,
  subtitle,
  autoTransitionToGrid = true,
  autoPlayShuffle,
  autoPlayDelay,
}: AchievementStackShuffleProps) {
  return (
    <AchievementCardStack
      achievements={achievements}
      title={title}
      subtitle={subtitle}
      autoPlayShuffle={autoPlayShuffle !== undefined ? autoPlayShuffle : autoTransitionToGrid}
      autoPlayDelay={autoPlayDelay}
    />
  );
}

export { AchievementCardStack };
