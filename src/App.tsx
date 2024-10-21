import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResponsiveLine, Serie, CustomLayerProps, ComputedSerie, Layer } from '@nivo/line';
import styled from 'styled-components';

import * as d3 from 'd3';
import { LineEndLabels } from './LineEndLabels';
import EventMarkersLayer from './EventMarkersLayer';
import { Switch } from './Switch';
import { EventCard } from './EventCard';

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
        date: "2011-01-01",
        title: "Kira Systems Founded",
        description: "Noah Waisberg and Dr. Alexander Hudek found Kira Systems, a machine learning contract analysis company, in Toronto, Canada[5].",
        logoUrl: "https://kirasystems.com/favicon.ico"
    },
    {
        date: '2013-05-29',
        title: 'React Released',
        description: 'Facebook open-sources React library.',
        logoUrl:
            'https://raw.githubusercontent.com/facebook/react/master/fixtures/dom/public/react-logo.svg',
    },
    {
        date: '2014-01-09',
        title: 'TensorFlow Released',
        description: 'Google releases TensorFlow as an open-source project.',
        logoUrl:
            'https://raw.githubusercontent.com/tensorflow/tensorflow/master/tensorflow/logos/pngs/TF_FullColor_Icon.png',
    },
    {
        date: "2014-08-01", // Month is approximate
        title: "Ironclad Founded",
        description: "Jason Boehmig and Cai GoGwilt found Ironclad, a contract lifecycle management platform, in San Francisco, California. The company aims to streamline contract creation and management processes for legal and business teams[1][2][5].",
        logoUrl: "https://ironclad.com/favicon.ico"
    },
    {
        date: "2015-05-19",
        title: "Dentons Launches NextLaw Labs",
        description: "Dentons announces the launch of NextLaw Labs, a global collaborative innovation platform focused on developing, deploying, and investing in new technologies and processes to transform the practice of law[3].",
        logoUrl: "https://www.dentons.com/favicon.ico"
    },
    {
        date: "2017-01-01", // Approximate date, as exact founding date wasn't provided
        title: "MDR Lab Founded by Mishcon de Reya",
        description: "Mishcon de Reya launches MDR Lab, an incubator program for tech startups in the legal space, aiming to collaborate with and support innovative legal technology companies.",
        logoUrl: "https://www.mishcon.com/favicon.ico"
    },
    {
        date: "2017-01-01", // Approximate date based on the information provided
        title: "Allen & Overy Launches FUSE",
        description: "Allen & Overy establishes FUSE, a tech innovation hub designed to explore, develop, and implement digital solutions in the legal sector. Since its inception, FUSE has hosted over 50 companies and welcomed more than 10,000 visitors[3].",
        logoUrl: "https://www.allenovery.com/favicon.ico"
    },
    {
        date: "2017-06-12",
        title: "Transformer Architecture Introduced",
        description: "Google researchers publish 'Attention is All You Need', introducing the Transformer architecture that revolutionizes natural language processing.",
        logoUrl: "https://www.google.com/favicon.ico"
    },
    {
        date: "2017-09-14", // Estimated based on available information
        title: "Atrium LTS Founded",
        description: "Justin Kan founds Atrium LTS, a legal technology startup aimed at revolutionizing legal services through technology and a new business model[6].",
        logoUrl: "https://www.atrium.co/favicon.ico"
    },
    {
        date: "2020-03-03",
        title: "Atrium LTS Shuts Down",
        description: "Atrium, the legal tech startup that raised $75 million to revolutionize legal services, announces it is shutting down its operations[6].",
        logoUrl: "https://www.atrium.co/favicon.ico"
    },
    {   
        date: "2020-06-11",
        title: "GPT-3 Released",
        description: "OpenAI releases GPT-3, a large language model with 175 billion parameters, marking a significant advancement in natural language processing[2].",
        logoUrl: "https://openai.com/favicon.ico"
    },
    {
        date: "2021-08-10",
        title: "Litera Acquires Kira Systems",
        description: "Litera, a global leader in legal technology solutions, announces the acquisition of Kira Systems, transforming its due diligence process and marking Litera's 12th legal tech acquisition[1][2][4].",
        logoUrl: "https://www.litera.com/favicon.ico"
    },
    {
        date: "2022-01-01", // Exact date not provided, using year only
        title: "Harvey.ai Founded",
        description: "Gabriel Pereyra, a former Meta AI researcher, and Winston Weinberg, an ex-O'Melveny & Myers lawyer, found Harvey.ai, a legal tech startup leveraging advanced natural language processing to streamline legal workflows[4].",
        logoUrl: "https://harvey.ai/favicon.ico"
    },
    {
        date: "2022-11-30",
        title: "ChatGPT Released",
        description: "OpenAI releases ChatGPT, an AI-powered chatbot based on the GPT-3.5 architecture, to the public.",
        logoUrl: "https://openai.com/favicon.ico"
    },
    {
        date: "2023-05-01",
        title: "ChatGD Released",
        description: "Gunderson Dettmer releases ChatGD, an AI-powered legal assistant for startup and venture capital law.",
        logoUrl: "https://www.gunder.com/favicon.ico"
    }
].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  

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

// Updated styled components
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  padding: 1rem;
  box-sizing: border-box;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  overflow: hidden;
`;

const DashboardCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`;

const ControlsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

const StatItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #1f77b4;
`;

const StatLabel = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  marginRight?: boolean;
  primary?: boolean;
}

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['marginRight', 'primary'].includes(prop),
})<ButtonProps>`
  background-color: ${(props) => (props.primary ? '#1f77b4' : '#ffffff')};
  color: ${(props) => (props.primary ? '#ffffff' : '#1f77b4')};
  border: 2px solid #1f77b4;
  padding: 0.5rem 1rem;
  margin-right: ${(props) => (props.marginRight ? '1rem' : '0')};
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? '#155a8a' : '#e6f2ff')};
  }
`;


const Heading = styled.h1`
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
  font-size: 1.75rem;
`;

// Number of milliseconds to display the event modal
const EVENT_DISPLAY_DURATION = 5000; // Adjust 'n' seconds here

// Add this new interface
interface AppState {
  isPlaying: boolean;
  currentTimeIndex: number;
  pauseOnEvents: boolean;
}

// Add this new styled component
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const ToggleLabel = styled.span`
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;



/**
 * Main application component.
 * Displays an animated line chart of GitHub star counts over time
 * with highlighted top projects and event markers.
 */
export const App: React.FC = () => {
    // State variables
    const [initialMaxY, setInitialMaxY] = useState<number>(100);
    const [currentMaxY, setCurrentMaxY] = useState<number>(100);

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
    const [eventTimerId, setEventTimerId] = useState<NodeJS.Timeout | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [pauseOnEvents, setPauseOnEvents] = useState<boolean>(false);
    const [appState, setAppState] = useState<AppState>({
      isPlaying: false,
      currentTimeIndex: 0,
      pauseOnEvents: false,
    });

    useEffect(() => {
        if (currentEvent) {
            console.log('currentEvent', currentEvent);
        }
    }, [currentEvent])

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
  
    const { seriesData, timeline: processedTimeline } = useMemo(() => {
      if (projectData.length > 0) {
        return processData();
      } else {
        return { seriesData: [], timeline: [] };
      }
    }, [projectData]);
  
    useEffect(() => {
      setData(seriesData);
      setTimeline(processedTimeline);
      setVisibleData(seriesData);
      setVisibleProjects(new Set(seriesData.map((serie) => String(serie.id))));

      // Compute the initial maximum y-value
      let maxY = 0;
      seriesData.forEach((serie) => {
        const firstPoint = serie.data[0];
        const yValue = typeof firstPoint?.y === 'number' ? firstPoint.y : 0;
        if (yValue > maxY) {
          maxY = yValue;
        }
      });
      setInitialMaxY(maxY * 2);
    }, [seriesData, processedTimeline]);
  
    useEffect(() => {
      let intervalId: NodeJS.Timeout | null = null;
  
      if (isPlaying && processedTimeline.length > 0) {
        intervalId = setInterval(() => {
          setCurrentTimeIndex((prevIndex) => {
            if (prevIndex < processedTimeline.length - 1) {
              const newIndex = prevIndex + 1;
              updateVisibleData(newIndex);
              return newIndex;
            } else {
              setIsPlaying(false);
              return prevIndex;
            }
          });
        }, 300);
      }
  
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [isPlaying, processedTimeline]);
  
    /**
     * Updates the visible data for the current time index.
     * @param timeIndex - The index of the current time point in the timeline.
     */
    const updateVisibleData = useCallback(
      (timeIndex: number) => {
        const currentTime = processedTimeline[timeIndex];
  
        // Only proceed if timeIndex has changed
        if (currentTimeIndex === timeIndex) {
          return;
        }
  
        // Update visible projects based on creation times
        const newVisibleProjects = new Set(visibleProjects);
        let projectsAdded = false;

        data.forEach((serie) => {
          const creationTime = projectCreationTimes.get(serie.id as string);
          if (
            creationTime &&
            creationTime.getTime() <= currentTime.getTime() &&
            !visibleProjects.has(serie.id as string)
          ) {
            newVisibleProjects.add(serie.id as string);
            projectsAdded = true;
          }
        });

        if (projectsAdded) {
          setVisibleProjects(newVisibleProjects);
        }
  
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

         // Compute the current maximum y-value
    let maxY = initialMaxY; // Start with initialMaxY
    newVisibleData.forEach((serie) => {
    const lastPoint = serie.data[serie.data.length - 1];
    const yValue = typeof lastPoint?.y === 'number' ? lastPoint.y : 0;
    if (yValue > maxY) {
        maxY = yValue;
    }
    });

    // Optionally add some padding to maxY
    setCurrentMaxY(maxY * 1.1); // Increase maxY by 10% for padding

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
        const newTopProjects = new Set<string>(topFiveIds);
  
        // Update topProjects and determine entering and leaving projects
        setTopProjects((prevTopProjects) => {
          const leavingProjects = new Set<string>(
            [...prevTopProjects].filter((x) => !newTopProjects.has(x))
          );
          const enteringProjects = new Set<string>(
            [...newTopProjects].filter((x) => !prevTopProjects.has(x))
          );
  
          setLeavingTopProjects(leavingProjects);
          setEnteringTopProjects(enteringProjects);
  
          return newTopProjects;
        });
  
        // Adjust x-axis tick values based on time index
        if (timeIndex > processedTimeline.length * 0.8) {
          // At the end of the timeline, show yearly ticks
          setXAxisTickValues('every year');
        } else {
          setXAxisTickValues('every 6 months');
        }
      },
      [
        data,
        visibleProjects,
        aggregateStars,
        initialMaxY,
        projectCreationTimes,
        currentTimeIndex,
        // Other dependencies
      ]
    );
  
    /**
     * Handles play and pause functionality.
     */
    const handlePlayPause = () => {
      setIsPlaying((prevIsPlaying) => {
        const newIsPlaying = !prevIsPlaying;

        if (newIsPlaying) {
          if (currentTimeIndex >= processedTimeline.length - 1) {
            handleReset();
            return true; // Start playing from the beginning
          }
          // If resuming, hide the event card
          if (showModal) {
            setShowModal(false);
            setCurrentEvent(null);
          }
        }
        return newIsPlaying;
      });
    };
  
    /**
     * Resets the animation to the beginning.
     */
    const handleReset = () => {
      setIsPlaying(false);
      setCurrentTimeIndex(0);
      setVisibleData(data.map(serie => ({ ...serie, data: [] })));
      setVisibleProjects(new Set());
      setAggregateStars(0);
      setTopProjects(new Set());
      setEnteringTopProjects(new Set());
      setLeavingTopProjects(new Set());
      setCurrentEvent(null);
      setShowModal(false);
    };

    /**
   * Memoized custom layer for line end labels.
   */
  const lineEndLabelsLayer = useCallback(
    (props: CustomLayerProps) => (
      <LineEndLabels
        topProjects={topProjects}
        enteringTopProjects={enteringTopProjects}
        leavingTopProjects={leavingTopProjects}
        newProjectIds={newProjectIds}
        series={props.series}
        innerWidth={props.innerWidth} // Passed here
      />
    ),
    [topProjects, enteringTopProjects, leavingTopProjects, newProjectIds]
  );

   /**
   * Handles the rendering of events.
   * @param event - The current event to display or null.
   */
  const handleEventRendered = (event: Event | null) => {
    if (event) {
      if (
        !currentEvent ||
        currentEvent.date !== event.date
      ) {
        setCurrentEvent(event);
        setShowModal(true);

        // Clear any existing timer
        if (eventTimerRef.current) {
          clearTimeout(eventTimerRef.current);
        }

        // Pause if pauseOnEvents is true
        if (pauseOnEvents) {
          setIsPlaying(false);
        } else {
          // Set a timer to hide the modal after EVENT_DISPLAY_DURATION
          eventTimerRef.current = setTimeout(() => {
            setShowModal(false);
            setCurrentEvent(null);
          }, EVENT_DISPLAY_DURATION);
        }
      }
    } else {
      setShowModal(false);
      setCurrentEvent(null);

      if (eventTimerRef.current) {
        clearTimeout(eventTimerRef.current);
      }
    }
  };

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (eventTimerRef.current) {
        clearTimeout(eventTimerRef.current);
      }
    };
  }, []);

    const eventMarkersLayer = useCallback(
      (props: CustomLayerProps) => (
        <EventMarkersLayer
          {...props}
          events={events}
          currentTime={processedTimeline[currentTimeIndex]}
          onEventRendered={handleEventRendered}
        />
      ),
      [events, handleEventRendered, processedTimeline, currentTimeIndex]
    );

    /**
   * Layers array memoized to update when custom layers change.
   */
  const layers: Layer[] = [
    'grid',
    'markers',
    'areas',
    'lines',
    'points',
    'axes',
    lineEndLabelsLayer,
    eventMarkersLayer,
  ];
  
    // Add this new function
    const handleTogglePauseOnEvents = () => {
      setAppState(prevState => ({
        ...prevState,
        pauseOnEvents: !prevState.pauseOnEvents,
      }));
    };

    // Add a function to handle toggle change
    const handlePauseOnEventsToggle = () => {
      setPauseOnEvents(prev => !prev);
    };

    return (
        <AppContainer>
          <DashboardCard>
            <Heading>GitHub Projects Timeline</Heading>
            <ChartContainer>
              <ResponsiveLine
                data={visibleData}
                margin={{ top: 30, right: 110, bottom: 50, left: 90 }} // Increased left margin from 60 to 90
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
                  max: currentMaxY, // Use the computed initial maximum
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
                    fontSize: 14, // Increased base font size
                  },
                  axis: {
                    domain: {
                      line: {
                        stroke: '#e0e0e0',
                        strokeWidth: 1,
                      },
                    },
                    ticks: {
                      line: {
                        stroke: '#e0e0e0',
                        strokeWidth: 1,
                      },
                      text: {
                        fill: '#666666',
                        fontSize: 14, // Increased tick label font size
                      },
                    },
                    legend: {
                      text: {
                        fontSize: 16, // Increased legend font size
                        fill: '#333333',
                        fontWeight: 'bold',
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: '#f0f0f0',
                      strokeWidth: 1,
                    },
                  },
                  legends: {
                    text: {
                      fill: '#333333',
                      fontSize: 14, // Increased legend text size
                    },
                  },
                  tooltip: {
                    container: {
                      background: '#ffffff',
                      boxShadow: '0 3px 9px rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                    },
                  },
                }}
                layers={layers}
              />
              {showModal && currentEvent && (
                <EventCard
                  title={currentEvent.title}
                  description={currentEvent.description}
                  logoUrl={currentEvent.logoUrl || ''}
                  date={currentEvent.date} // Ensure this is a string
                />
              )}
            </ChartContainer>
            <ControlsContainer>
              <StatsContainer>
                <StatItem>
                  <StatValue>
                    {processedTimeline[currentTimeIndex]?.toISOString().split('T')[0]}
                  </StatValue>
                  <StatLabel>Date</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{aggregateStars.toLocaleString()}</StatValue>
                  <StatLabel>Total Stars</StatLabel>
                </StatItem>
              </StatsContainer>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ToggleContainer>
                  <ToggleLabel>Pause on events</ToggleLabel>
                  <Switch
                    checked={pauseOnEvents}
                    onChange={handlePauseOnEventsToggle}
                  />
                </ToggleContainer>
                <Button onClick={handlePlayPause} marginRight primary>
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            </ControlsContainer>
          </DashboardCard>
        </AppContainer>
      );
  };































