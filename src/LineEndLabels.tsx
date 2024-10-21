// src/LineEndLabels.tsx

import React, { useRef, useEffect, useState } from 'react';
import { ComputedSerie } from '@nivo/line';

/**
 * Props for LineEndLabels component.
 */
interface LineEndLabelsProps {
  topProjects: Set<string>;
  enteringTopProjects: Set<string>;
  leavingTopProjects: Set<string>;
  series: readonly ComputedSerie[];
  innerWidth: number; // Added to access the chart's width
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
  const [labelWidths, setLabelWidths] = useState<Map<string, number>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const newLabelWidths = new Map<string, number>();

      topProjects.forEach(projectId => {
        const serie = series.find(s => String(s.id) === projectId);
        const lastDataPoint = serie?.data.slice(-1)[0];

        // Safely access the y value
        const yValue = lastDataPoint?.data.y;
        const yNumber = typeof yValue === 'number' ? yValue : 0;

        const labelText = `${projectId} (${Math.round(yNumber)})`;

        const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tempText.textContent = labelText;
        svg.appendChild(tempText);
        const width = tempText.getBBox().width;
        newLabelWidths.set(projectId, width);
        svg.removeChild(tempText);
      });

      setLabelWidths(newLabelWidths);
    }
  }, [topProjects, series]);

  const labels: LabelData[] = series
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
      const x = lastPoint.position.x;
      const y = lastPoint.position.y;
      const seriesId = String(line.id);
      const isEntering = enteringTopProjects.has(seriesId);
      const isLeaving = leavingTopProjects.has(seriesId);
      const fillColor = line.color ?? '#000';
      const latestStarCount = Math.round(lastPoint.data.y as number);
      const label = `${seriesId} (${latestStarCount})`;
      const width = labelWidths.get(seriesId) || 0;

      if (isNaN(x) || isNaN(y)) {
        return null;
      }

      return {
        x,
        y,
        label,
        fillColor,
        isEntering,
        isLeaving,
        width,
      };
    })
    .filter((label): label is LabelData => label !== null);

  const sortedLabels = labels.sort((a, b) => a.y - b.y);
  const labelHeight = 16; // approximate label height
  const minGap = 4; // minimum gap between labels
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
    <g ref={svgRef}>
      {sortedLabels.map((labelData) => {
        const { x, y, label, fillColor, isEntering, isLeaving } = labelData;

        const transform = isEntering ? 'scale(1.2)' : 'scale(1)';

        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="end"
            style={{
              fill: fillColor,
              fontSize: 14,
              fontWeight: 600,
              opacity: isLeaving ? 0 : 1,
              transform,
              transition: 'opacity 0.5s, transform 0.5s',
              transformOrigin: 'right center',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            {label}
          </text>
        );
      })}
    </g>
  );
};

interface LabelData {
  x: number;
  y: number;
  label: string;
  fillColor: string;
  isEntering: boolean;
  isLeaving: boolean;
  width: number;
}
