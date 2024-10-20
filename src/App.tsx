import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ComputedSerie, ResponsiveLine, Serie } from '@nivo/line';
import styled from 'styled-components';

import * as d3 from 'd3';
import { LineEndLabels } from './LineEndLabels';
import EventMarkersLayer from './EventMarkersLayer';

/**
 * Represents the star history of a project.
 */
interface StarHistory {
date: string;
count: number;
}

/**
 * Represents the data for a project.
 */
interface ProjectData {
name: string;
starHistory: StarHistory[];
logoUrl: string;
}

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
 * Represents the count of stars for a project.
 */
interface ProjectCount {
id: string;
count: number;
}

/**
 * Represents a data point with x and y coordinates.
 */
interface DataPoint {
x: Date;
y: number;
}

import projectDataJson from './assets/test_data.json';

/**
 * Sample data for demonstration purposes.
 */

/**
 * Sample events to be displayed on the chart.
 */
/**
 * Sample events to be displayed on the chart.
 */
const events: Event[] = [
    {
      date: '2015-11-09',
      title: 'TensorFlow Released',
      description: 'Google releases TensorFlow as an open-source project.',
      logoUrl:
        'https://raw.githubusercontent.com/tensorflow/tensorflow/master/tensorflow/logos/pngs/TF_FullColor_Icon.png',
    },
    {
      date: '2013-05-29',
      title: 'React Released',
      description: 'Facebook open-sources React library.',
      logoUrl:
        'https://raw.githubusercontent.com/facebook/react/master/fixtures/dom/public/react-logo.svg',
    },
    // Add more events as needed
  ];
  

// Define a custom color palette using colors suitable for white backgrounds
// Define a custom color palette using colors suitable for white backgrounds
const colorPalette = [
    '#1f77b4', // blue
    '#ff7f0e', // orange
    '#2ca02c', // green
    '#d62728', // red
    '#9467bd', // purple
    '#8c564b', // brown
    '#e377c2', // pink
    '#7f7f7f', // gray
    '#bcbd22', // olive
    '#17becf', // cyan
    // Add more colors if needed
  ];

/**
 * Formats a given date value to 'YYYY-MM-DD'.
 * @param value - The date value to format.
 * @returns The formatted date string.
 */
const formatDate = (value: Date | number | string): string => {
const date = new Date(value);
return date.toISOString().split('T')[0];
};

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 2rem;
  box-sizing: border-box;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 500px; // Set explicit height
  position: relative;
`;

const ControlsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    marginRight?: boolean;
  }
  
  const Button = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== 'marginRight',
  })<ButtonProps>`
    background-color: #1f77b4;
    color: #ffffff;
    border: none;
    padding: 0.5rem 1rem;
    margin-right: ${(props) => (props.marginRight ? '1rem' : '0')};
    cursor: pointer;
    font-size: 1rem;
    border-radius: 4px;
  
    &:hover {
      background-color: #155a8a;
    }
  `;

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 1rem;
`;

const Heading = styled.h1`
  margin-bottom: 1rem;
  text-align: center;
`;

/**
 * Main application component.
 * Displays an animated line chart of GitHub star counts over time
 * with highlighted top projects and event markers.
 */
export const App: React.FC = () => {
    // State variables
    const [data, setData] = useState<Serie[]>([]);
    const [timeline, setTimeline] = useState<Date[]>([]);
    const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [visibleData, setVisibleData] = useState<Serie[]>([]);
    const [aggregateStars, setAggregateStars] = useState<number>(0);
    const [topProjects, setTopProjects] = useState<Set<string>>(new Set());
    const [xAxisTickValues, setXAxisTickValues] = useState<string | Date[]>('every year');
  
    const [projectCreationTimes, setProjectCreationTimes] = useState<Map<string, Date>>(new Map());
    const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());
    const [newProjectIds, setNewProjectIds] = useState<Set<string>>(new Set());
    const [leavingTopProjects, setLeavingTopProjects] = useState<Set<string>>(new Set());
    const [enteringTopProjects, setEnteringTopProjects] = useState<Set<string>>(new Set());
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [projectData, setProjectData] = useState<ProjectData[]>([]);

    useEffect(() => {
        if (timeline.length > 0 && data.length > 0) {
          updateVisibleData(0);
        }
      }, [timeline, data]);

    useEffect(() => {
        // Load project data from JSON file
        setProjectData(projectDataJson as ProjectData[]);
      }, []);
  
     // Update colorScale inside the component
    const colorScale = useMemo(() => {
        return d3
        .scaleOrdinal<string, string>()
        .domain(projectData.map((project) => project.name))
        .range(colorPalette);
    }, [projectData]);

    /**
     * Processes the project data into interpolated data points for smooth animation.
     * @returns An object containing the series data and the timeline of dates.
     */
    const processData = useCallback(() => {
      // Determine the overall date range
      const allDates = projectData.flatMap((project) =>
        project.starHistory.map((history) => new Date(history.date))
    );
      const minDate = d3.min(allDates) || new Date();
      const maxDate = d3.max(allDates) || new Date();
  
      // Adjust maxDate to ensure the timeline is not empty
      const adjustedMaxDate = new Date(maxDate);
      adjustedMaxDate.setMonth(adjustedMaxDate.getMonth() + 1);
  
      // Create a regular timeline (monthly intervals)
      const timeline: Date[] = d3.timeMonths(
        d3.timeMonth.floor(minDate),
        adjustedMaxDate
      );
  
      // Interpolate data for each project
      const seriesData: Serie[] = projectData.map((project) => {
        // Sort the star history by date
        const sortedHistory = project.starHistory
  .map((history) => ({
    date: new Date(history.date), // Ensure this correctly parses the date
    count: history.count,
  }))
  .sort((a, b) => a.date.getTime() - b.date.getTime());
  
        // Create a lookup for existing data points
        const starHistoryMap = new Map(
          sortedHistory.map((d) => [d.date.getTime(), d.count])
        );
  
        // Interpolate data points for the timeline
        const series: DataPoint[] = timeline.map((date) => {
          const timestamp = date.getTime();
  
          // Check if star count exists for this date
          if (starHistoryMap.has(timestamp)) {
            return { x: date, y: starHistoryMap.get(timestamp)! };
          }
  
          // Find surrounding dates for interpolation
          const previousEntries = sortedHistory.filter(
            (d) => d.date.getTime() <= timestamp
          );
          const nextEntries = sortedHistory.filter(
            (d) => d.date.getTime() >= timestamp
          );
  
          const previousEntry = previousEntries[previousEntries.length - 1];
          const nextEntry = nextEntries[0];
  
          let interpolatedCount = 0;
  
          if (previousEntry && nextEntry) {
            const t =
              (timestamp - previousEntry.date.getTime()) /
              (nextEntry.date.getTime() - previousEntry.date.getTime());
            interpolatedCount =
              previousEntry.count +
              t * (nextEntry.count - previousEntry.count);
          } else if (previousEntry) {
            interpolatedCount = previousEntry.count;
          }
  
          return { x: date, y: interpolatedCount };
        });
  
        // Filter out data points before the project exists
        const firstNonZeroIndex = series.findIndex((d) => d.y > 0);
        const filteredSeries =
          firstNonZeroIndex >= 0 ? series.slice(firstNonZeroIndex) : [];
  
        return {
          id: project.name,
          data: filteredSeries,
        };
      });
  
      // Record project creation times
      const creationTimes = new Map<string, Date>();
      seriesData.forEach((serie) => {
        const dataPoints = serie.data as DataPoint[];
        if (dataPoints.length > 0) {
          creationTimes.set(serie.id as string, dataPoints[0].x as Date);
        }
      });
      setProjectCreationTimes(creationTimes);
  
      return { seriesData, timeline };
    }, [projectData]);
  
    useEffect(() => {
        if (projectData.length > 0) {
          const { seriesData, timeline } = processData();
          setData(seriesData);
          setTimeline(timeline);
          setVisibleData(seriesData); // Use full data for testing
          setVisibleProjects(new Set(seriesData.map((serie) => String(serie.id))));
        }
      }, [projectData, processData]);
  
    useEffect(() => {
      let intervalId: NodeJS.Timeout;
  
      if (isPlaying && timeline.length > 0) {
        intervalId = setInterval(() => {
          setCurrentTimeIndex((prevIndex) => {
            if (prevIndex < timeline.length - 1) {
              const newIndex = prevIndex + 1;
              updateVisibleData(newIndex);
              return newIndex;
            } else {
              setIsPlaying(false);
              return prevIndex;
            }
          });
        }, 300); // Adjust interval for smoother animation
      }
  
      return () => clearInterval(intervalId);
    }, [isPlaying, timeline, data]);
  
    /**
     * Updates the visible data for the current time index.
     * @param timeIndex The index of the current time point in the timeline.
     */
    const updateVisibleData = (timeIndex: number) => {
      const currentTime = timeline[timeIndex];
  
      // Update visible projects based on creation times
      const newVisibleProjects = new Set(visibleProjects);
      data.forEach((serie) => {
        const creationTime = projectCreationTimes.get(serie.id as string);
        if (creationTime && creationTime.getTime() <= currentTime.getTime()) {
          if (!visibleProjects.has(serie.id as string)) {
            newVisibleProjects.add(serie.id as string);
            setNewProjectIds((prev) => new Set(prev).add(serie.id as string));
          }
        }
      });
      setVisibleProjects(newVisibleProjects);
  
      // Update visible data up to the current time
      const newVisibleData = data
        .filter((serie) => visibleProjects.has(serie.id as string))
        .map((serie) => {
          const filteredData = (serie.data as DataPoint[]).filter((d) => {
            const xDate = d.x instanceof Date ? d.x : new Date(d.x);
            return xDate.getTime() <= currentTime.getTime();
          });
          return {
            ...serie,
            data: filteredData,
          };
        });
      setVisibleData(newVisibleData);
  
      // Update aggregate stars
      const totalStars = newVisibleData.reduce((sum, serie) => {
        const lastPoint = serie.data[serie.data.length - 1];
        return sum + (typeof lastPoint?.y === 'number' ? lastPoint.y : 0);
      }, 0);
      setAggregateStars(Math.round(totalStars));
  
      // Identify top five projects
      const latestCounts: ProjectCount[] = newVisibleData.map((serie) => {
        const lastPoint = serie.data[serie.data.length - 1];
        return {
          id: String(serie.id),
          count:
            lastPoint && typeof lastPoint.y === 'number' ? lastPoint.y : 0,
        };
      });
  
      latestCounts.sort((a, b) => b.count - a.count);
      const topFiveIds = latestCounts.slice(0, 5).map((item) => item.id);
      const newTopProjects = new Set(topFiveIds);
  
      // Determine projects entering or leaving top 5
      const leavingProjects = new Set([...topProjects].filter((x) => !newTopProjects.has(x)));
      const enteringProjects = new Set([...newTopProjects].filter((x) => !topProjects.has(x)));
  
      setLeavingTopProjects(leavingProjects);
      setEnteringTopProjects(enteringProjects);
  
      setTopProjects(newTopProjects);
  
      // Update current events
      const currentTimeStr = currentTime.toISOString().split('T')[0];
      const currentTimeEvents = events.filter(
        (event) => event.date === currentTimeStr
      );
      if (currentTimeEvents.length > 0) {
        setCurrentEvent(currentTimeEvents[0]); // Show one event at a time
        // Hide the event after some time
        setTimeout(() => {
          setCurrentEvent(null);
        }, 5000); // Display event for 5 seconds
      } else {
        setCurrentEvent(null);
      }
  
      // Adjust x-axis tick values based on time index
      if (timeIndex > timeline.length * 0.8) {
        // At the end of the timeline, show yearly ticks
        setXAxisTickValues('every year');
      } else {
        setXAxisTickValues('every 6 months');
      }
    };
  
    /**
     * Handles play and pause functionality.
     */
    const handlePlayPause = () => {
        if (!isPlaying) {
          if (timeline.length === 0) {
            return;
          }
          if (currentTimeIndex >= timeline.length - 1) {
            handleReset();
          }
          // Update visible data when starting to play
          updateVisibleData(currentTimeIndex);
        }
        setIsPlaying(!isPlaying);
      };
  
    /**
     * Resets the animation to the beginning.
     */
    const handleReset = () => {
      setIsPlaying(false);
      setCurrentTimeIndex(0);
      setVisibleData(
        data.map((serie) => ({
          ...serie,
          data: [],
        }))
      );
      setVisibleProjects(new Set());
      setAggregateStars(0);
      setTopProjects(new Set());
      setEnteringTopProjects(new Set());
      setLeavingTopProjects(new Set());
      setCurrentEvent(null);
    };
  
    return (
        <AppContainer>
          <Heading>GitHub Projects Timeline</Heading>
          <ChartContainer>
            <ResponsiveLine
              data={visibleData}
              margin={{ top: 50, right: 200, bottom: 80, left: 80 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
              }}
              xFormat="time:%Y-%m-%d"
              yScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickValues: xAxisTickValues,
                format: (value) => formatDate(value),
                legend: 'Date',
                legendOffset: 40,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Stars',
                legendOffset: -60,
                legendPosition: 'middle',
              }}
              lineWidth={2}
              pointSize={0}
              useMesh={true}
              enableSlices={false}
              animate={true}
              motionConfig="gentle"
              colors={(serie) => colorScale(serie.id as string)}
              theme={{
                background: '#ffffff',
                text: {
                    fill: '#333333',
                    fontSize: 12,
                },
                axis: {
                  domain: {
                    line: {
                      stroke: '#777777',
                      strokeWidth: 1,
                    },
                  },
                  ticks: {
                    line: {
                      stroke: '#777777',
                      strokeWidth: 1,
                    },
                    text: {},
                  },
                  legend: {
                    text: {
                      fontSize: 12,
                      fill: '#333333',
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: '#dddddd',
                    strokeWidth: 1,
                  },
                },
              }}
              layers={[
                'grid',
                'markers',
                'areas',
                'lines',
                'points',
                'axes',
                // Custom layer for project labels at the end of lines
                (props) => (
                    <LineEndLabels
                      topProjects={topProjects}
                      enteringTopProjects={enteringTopProjects}
                      leavingTopProjects={leavingTopProjects}
                      newProjectIds={newProjectIds}
                      series={props.series as ComputedSerie[]} // Ensure correct typing
                    />
                  ),
                // Custom layer for event markers
                (props) => (
                  <EventMarkersLayer {...props} events={events} />
                ),
              ]}
            />
            {/* Event Modal */}
            {currentEvent && (
              <Modal>
                {currentEvent.logoUrl && (
                  <ModalImage
                    src={currentEvent.logoUrl}
                    alt={currentEvent.title}
                  />
                )}
                <div>
                  <h2>{currentEvent.title}</h2>
                  <p>{currentEvent.description}</p>
                </div>
              </Modal>
            )}
          </ChartContainer>
          <ControlsContainer>
            <div>
              <h3>
                Date: {timeline[currentTimeIndex]?.toISOString().split('T')[0]}
              </h3>
              <h3>
                Total Stars: {aggregateStars.toLocaleString()}
              </h3>
            </div>
            <div>
              <Button onClick={handlePlayPause} marginRight>
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          </ControlsContainer>
        </AppContainer>
      );
  };
