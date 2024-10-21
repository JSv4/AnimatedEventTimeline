/**
 * Component to render event markers on the chart.
 */
import React, { useEffect, useRef, useState } from 'react';
import { ScaleTime } from 'd3-scale';

/**
 * Represents an event to be displayed on the chart.
 */
interface Event {
  date: string;
  title: string;
  description: string;
  logoUrl?: string;
}

/**
 * Props for EventMarkersLayer component.
 */
interface EventMarkersLayerProps {
  xScale: ScaleTime<number, number>;
  innerHeight: number;
  events: Event[];
  currentTime: Date;
  onEventRendered: (event: Event | null) => void;
}

/**
 * Component to render event markers on the chart.
 * @param props EventMarkersLayerProps
 */
const EventMarkersLayer: React.FC<EventMarkersLayerProps> = ({
  xScale,
  innerHeight,
  events,
  currentTime,
  onEventRendered,
}) => {
  const [renderedEventIndices, setRenderedEventIndices] = useState<Set<number>>(new Set());

  // Store positions of labels to detect overlaps
  const labelPositionsRef = useRef<{ x: number; width: number }[]>([]);

  useEffect(() => {
    const currentDate = currentTime;

    // Find the events that have occurred up to the current date and haven't been rendered yet
    const newPastEvents = events.filter(
      (event, index) =>
        new Date(event.date) <= currentDate && !renderedEventIndices.has(index)
    );

    if (newPastEvents.length > 0) {
      setRenderedEventIndices((prev) => {
        const newSet = new Set(prev);
        newPastEvents.forEach((event) => {
          const eventIndex = events.indexOf(event);
          newSet.add(eventIndex);
          onEventRendered(event);
        });
        return newSet;
      });
    }
  }, [currentTime, events, onEventRendered, renderedEventIndices]);

  return (
    <g>
      {events.map((event, index) => {
        const eventDate = new Date(event.date);
        if (eventDate > currentTime) {
          return null; // Do not render future events
        }
        const x = xScale(eventDate);
        if (x < 0 || x > xScale.range()[1]) {
          return null;
        }

        // Detect label overlaps
        let rotateLabel = false;
        const labelText = event.title;

        // Approximate label width for horizontal text
        const labelWidth = labelText.length * 8; // Approximate character width

        // Previous labels
        const prevLabels = labelPositionsRef.current;

        // Check for overlaps with previous labels
        const overlappingLabel = prevLabels.find(
          (lbl) => Math.abs(lbl.x - x) < labelWidth
        );

        if (overlappingLabel) {
          // Rotate label to avoid overlap
          rotateLabel = true;
        }

        // Update label positions
        prevLabels.push({ x, width: labelWidth });

        // Limit the size of prevLabels to avoid excessive memory usage
        if (prevLabels.length > 100) {
          prevLabels.shift();
        }

        return (
          <g key={index} transform={`translate(${x},0)`}>
            <line
              y1={0}
              y2={innerHeight}
              stroke="#adb5bd"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <text
              x={0}
              y={0}
              textAnchor="end"
              dominantBaseline="text-after-edge"
              transform="rotate(-90)"
              style={{
                fontSize: 12,
                fill: '#495057',
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              {event.title}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default EventMarkersLayer;
