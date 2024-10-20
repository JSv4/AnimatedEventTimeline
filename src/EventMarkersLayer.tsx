/**
 * Component to render event markers on the chart.
 */
import React, { useEffect, useRef } from 'react';
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
  onEventRendered,
}) => {
  const lastRenderedEventRef = useRef<Event | null>(null);

  useEffect(() => {
    const currentDate = new Date(xScale.invert(xScale.range()[1]));

    // Find the events that have occurred up to the current date
    const pastEvents = events.filter(
      (event) => new Date(event.date) <= currentDate
    );

    // If there are any past events, get the most recent one
    const renderedEvent =
      pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;

    // If the rendered event has changed, update it
    if (renderedEvent !== lastRenderedEventRef.current) {
      lastRenderedEventRef.current = renderedEvent;
      onEventRendered(renderedEvent);
    }
  }, [xScale, events, onEventRendered]);

  return (
    <g>
      {events.map((event, index) => {
        const x = xScale(new Date(event.date));
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
              style={{ fontSize: 12, fill: '#000' }}
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
