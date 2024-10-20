// src/LineEndLabels.tsx

import React from 'react';
import { ComputedSerie, ComputedDatum } from '@nivo/line';

/**
 * Props for LineEndLabels component.
 */
interface LineEndLabelsProps {
  topProjects: Set<string>;
  enteringTopProjects: Set<string>;
  leavingTopProjects: Set<string>;
  newProjectIds: Set<string>;
  series: ComputedSerie[];
}

/**
 * Component to render labels at the end of lines for top projects.
 * Adjusts labels to prevent overlap.
 */
export const LineEndLabels: React.FC<LineEndLabelsProps> = ({
  topProjects,
  enteringTopProjects,
  leavingTopProjects,
  series,
}) => {
  // Collect label data
  const labels = series
    ?.filter((line) => topProjects.has(String(line.id)))
    .map((line) => {
      const linePoints = line.data;
      if (!linePoints || linePoints.length === 0) {
        return null;
      }
      const lastPoint = linePoints[linePoints.length - 1];
      if (!lastPoint) {
        return null;
      }
      let x = lastPoint.position.x;
      let y = lastPoint.position.y;
      const seriesId = String(line.id);
      const isEntering = enteringTopProjects.has(seriesId);
      const isLeaving = leavingTopProjects.has(seriesId);
      const fillColor = line.color ?? '#000';
      const latestStarCount = Math.round(lastPoint.data.y as number);

      if (isNaN(x) || isNaN(y)) {
        return null;
      }

      return {
        x,
        y,
        label: `${seriesId} (${latestStarCount})`,
        fillColor,
        isEntering,
        isLeaving,
      };
    })
    .filter((label): label is NonNullable<typeof label> => label !== null);
  
  // Adjust y positions to prevent overlap
  const sortedLabels = labels.sort((a, b) => a.y - b.y);
  const labelHeight = 16; // approximate label height
  const minGap = 4; // minimum gap between labels

   // Ensure labels stay within chart bounds
   const chartHeight = 500; // Chart height set in App.tsx
   for (let i = 1; i < sortedLabels.length; i++) {
     const prev = sortedLabels[i - 1];
     const curr = sortedLabels[i];
     const gap = prev.y + labelHeight + minGap - curr.y;
     if (gap > 0) {
       curr.y += gap;
       // Ensure curr.y does not exceed chartHeight
       curr.y = Math.min(curr.y, chartHeight - labelHeight);
     }
   }

  return (
    <g>
      {sortedLabels.map((labelData) => {
        const { x, y, label, fillColor, isEntering, isLeaving } = labelData;

        // Determine transform for entering labels
        const transform = isEntering ? 'scale(1.5)' : 'scale(1)';

        return (
          <text
            key={label}
            x={x + 5}
            y={y}
            style={{
              fill: fillColor,
              fontSize: 14,
              fontWeight: 'bold',
              opacity: isLeaving ? 0 : 1,
              transform,
              transition: 'opacity 0.5s, transform 0.5s',
              transformOrigin: 'left center',
            }}
          >
            {label}
          </text>
        );
      })}
    </g>
  );
};
