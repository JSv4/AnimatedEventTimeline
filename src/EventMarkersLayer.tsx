/**
 * Component to render event markers on the chart.
 */
import React from 'react';
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
}

/**
 * Component to render event markers on the chart.
 * @param props EventMarkersLayerProps
 */
const EventMarkersLayer: React.FC<EventMarkersLayerProps> = ({
  xScale,
  innerHeight,
  events,
}) => {
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