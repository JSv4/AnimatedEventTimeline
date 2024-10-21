/**
 * Component to render event markers on the chart.
 */
import React, { useEffect, useRef, useState } from 'react';
import { ScaleTime, ScaleLinear } from 'd3-scale';

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
  yScale: ScaleLinear<number, number>;
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

  useEffect(() => {
    const currentDate = currentTime;

    // Find the events that have occurred up to the current date and haven't been rendered yet
    const newPastEvents = events.filter(
      (event, index) => new Date(event.date) <= currentDate && !renderedEventIndices.has(index)
    );


    if (newPastEvents.length > 0) {
      setRenderedEventIndices(prev => {
        const newSet = new Set(prev);
        newPastEvents.forEach((event, i) => {
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
        return (
          <g key={index} transform={`translate(${x},0)`}>
            <line
              y1={0}
              y2={innerHeight}
              stroke="#000"
              strokeDasharray="4 4"
            />
            <text
              y={-10}
              textAnchor="middle"
              style={{ fontSize: 16, fill: '#000' }} // Increased font size
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
