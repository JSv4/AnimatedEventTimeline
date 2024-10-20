// src/LineEndLabels.tsx

import React from 'react';
import { ComputedSerie } from '@nivo/line';

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
 * @param props LineEndLabelsProps
 */
export const LineEndLabels: React.FC<LineEndLabelsProps> = ({
  topProjects,
  leavingTopProjects,
  series,
}) => {
  return (
    <g>
      {series
        ?.filter((line) => topProjects.has(String(line.id)))
        .map((line) => {
          const linePoints = line.data; // line.data is readonly ComputedDatum[]
          if (!linePoints || linePoints.length === 0) {
            return null;
          }
          const lastPoint = linePoints[linePoints.length - 1];
          if (!lastPoint) {
            return null;
          }
          const x = lastPoint.position.x;
          const y = lastPoint.position.y;

          if (typeof x !== 'number' || typeof y !== 'number') {
            return null;
          }

          const isLeaving = leavingTopProjects.has(String(line.id));

          // Provide default color if undefined
          const fillColor = line.color ?? '#000';

          return (
            <text
              key={String(line.id)}
              x={x + 5}
              y={y}
              style={{
                fill: fillColor,
                fontSize: 14,
                fontWeight: 'bold',
                opacity: isLeaving ? 0 : 1,
                transition: 'opacity 0.5s',
              }}
            >
              {line.id}
            </text>
          );
        })}
    </g>
  );
};