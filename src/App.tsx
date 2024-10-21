import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResponsiveLine, Serie, CustomLayerProps, Layer } from '@nivo/line';
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

import projectDataJson from './assets/legaltech_focused.json';

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
        description: "Noah Waisberg and Dr. Alexander Hudek found Kira Systems, a machine learning contract analysis company, in Toronto, Canada.",
        logoUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/304183100365917.5f2b3a0ecc388.png"
    },
    {
        date: "2014-08-01", // Month is approximate
        title: "Ironclad Founded",
        description: "Jason Boehmig and Cai GoGwilt found Ironclad, a contract lifecycle management platform, in San Francisco, California. The company aims to streamline contract creation and management processes for legal and business teams.",
        logoUrl: "https://cdn.prod.website-files.com/6640cd28f51f13175e577c05/664e00971d6823ba36c59860_fb865d17-ccaf-50c6-8599-360d05eb0b1f.svg"
    },
    {
        date: "2015-05-19",
        title: "Dentons Launches NextLaw Labs",
        description: "Dentons announces the launch of NextLaw Labs, a global collaborative innovation platform focused on developing, deploying, and investing in new technologies and processes to transform the practice of law.",
        logoUrl: "https://yt3.googleusercontent.com/VyW_AAZbcQmNgZubwi1pR4E7293stbzxgmJRWQOAxvziS1OthlRdm9H-w6BumE8xPHXrY1EyOw=s900-c-k-c0x00ffffff-no-rj"
    },
    {
        date: "2017-01-01", // Approximate date based on the information provided
        title: "Allen & Overy Launches FUSE",
        description: "Allen & Overy establishes FUSE, a tech innovation hub designed to explore, develop, and implement digital solutions in the legal sector. Since its inception, FUSE has hosted over 50 companies and welcomed more than 10,000 visitors.",
        logoUrl: "https://pbcdn1.podbean.com/imglogo/image-logo/7625884/A_O_White_on_red_logo_7pweh.jpg"
    },
    {
        date: "2016-01-01", // Approximate date based on the article
        title: "Wavelength Law Founded",
        description: "Peter Lee and Drew Winlaw establish Wavelength Law in Cambridge, UK, positioning it as the world's first regulated legal engineering firm. The company quickly gains prominence in legal tech and innovation.",
        logoUrl: "https://pbs.twimg.com/profile_images/1547231423517663232/1aZ0XWke_400x400.jpg"
    },
    {
        date: "2024-06-03",
        title: "LexisNexis Acquires Henchman",
        description: "LexisNexis Legal & Professional announces an agreement to acquire Henchman, a Belgian contract drafting startup founded in 2020. Henchman's technology enriches data from Document Management Systems for faster document drafting.",
        logoUrl: "https://pbs.twimg.com/profile_images/630755063758233600/rlDiqKH7_400x400.png"
    },
    {
        date: "2024-03-15",
        title: "Thomson Reuters Acquires CoCounsel",
        description: "Thomson Reuters announces the acquisition of CoCounsel, an AI legal assistant developed by Casetext, for $650 million cash.",
        logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG5Bq5iOB4QE-yu_XNx6h-W9mECU3_UUbOgw&s"
    },
    {
        date: "2017-06-12",
        title: "Transformer Architecture Introduced",
        description: "Google researchers publish 'Attention is All You Need', introducing the Transformer architecture that revolutionizes natural language processing.",
        logoUrl: "https://banner2.cleanpng.com/20190228/qby/kisspng-google-logo-google-account-g-suite-google-images-g-icon-archives-search-png-1713904157115.webp"
    },
    {
        date: "2019-07-24",
        title: "Simmons & Simmons Acquires Wavelength",
        description: "Simmons & Simmons, a leading international law firm, acquires Wavelength Law to enhance its legal technology and innovation capabilities. This move signifies a major shift in how law firms are integrating tech expertise.",
        logoUrl: "https://pbs.twimg.com/profile_images/1547231423517663232/1aZ0XWke_400x400.jpg"
    },
    {
        date: "2017-09-14", // Estimated based on available information
        title: "Atrium LTS Founded",
        description: "Justin Kan founds Atrium LTS, a legal technology startup aimed at revolutionizing legal services through technology and a new business model.",
        logoUrl: "https://dioguwdgf472v.cloudfront.net/media/logos/equityinvest/Company/qv1h6djxbpbmbjx9sxwi-45c295899063c6ca.png"
    },
    {
        date: "2020-03-03",
        title: "Atrium LTS Shuts Down",
        description: "Atrium, the legal tech startup that raised $75 million to revolutionize legal services, announces it is shutting down its operations.",
        logoUrl: "https://dioguwdgf472v.cloudfront.net/media/logos/equityinvest/Company/qv1h6djxbpbmbjx9sxwi-45c295899063c6ca.png"
    },
    {
        date: "2020-06-11",
        title: "GPT-3 Released",
        description: "OpenAI releases GPT-3, a large language model with 175 billion parameters, marking a significant advancement in natural language processing.",
        logoUrl: "https://i.pinimg.com/originals/2a/62/c3/2a62c34e0d217a7aa14645ce114d84b3.png"
    },
    {
        date: "2021-08-10",
        title: "Litera Acquires Kira Systems",
        description: "Litera, a global leader in legal technology solutions, announces the acquisition of Kira Systems, transforming its due diligence process and marking Litera's 12th legal tech acquisition.",
        logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMBaiArpbkQmZvIQ9op30xkCyRD9yUCSEk-Q&s"
    },
    {
        date: "2022-01-01", // Exact date not provided, using year only
        title: "Harvey.ai Founded",
        description: "Gabriel Pereyra, a former Meta AI researcher, and Winston Weinberg, an ex-O'Melveny & Myers lawyer, found Harvey.ai, a legal tech startup leveraging advanced natural language processing to streamline legal workflows.",
        logoUrl: "https://www.finsmes.com/wp-content/uploads/2024/07/Harvey.png"
    },
    {
        date: "2022-11-30",
        title: "ChatGPT Released",
        description: "OpenAI releases ChatGPT, an AI-powered chatbot based on the GPT-3.5 architecture, to the public.",
        logoUrl: "https://i.pinimg.com/originals/2a/62/c3/2a62c34e0d217a7aa14645ce114d84b3.png"
    },
    {
        date: "2018-07-01", // Approximate date based on available information
        title: "Clifford Chance Launches Applied Solutions",
        description: "Clifford Chance establishes Applied Solutions, a separate entity focused on delivering tech-enabled products to clients. This move represents a significant step in integrating technology into legal services delivery.",
        logoUrl: "https://pbs.twimg.com/profile_images/1675856704364335107/wj0lqUju_400x400.png"
    },
    {
        date: "2019-02-05",
        title: "Wilson Sonsini Launches SixFifty",
        description: "Wilson Sonsini Goodrich & Rosati announces the formation of SixFifty, a new software subsidiary. SixFifty aims to develop automated tools to make legal processes efficient and affordable, combining technology with human expertise from Wilson Sonsini attorneys.",
        logoUrl: "https://cdn.prod.website-files.com/622357b2bf2cca337e9cf3aa/64e93be697a309c331a877cb_Wilson%20Sonsini%20logo%20dark.webp"
    },
    {
        date: "2023-05-01",
        title: "ChatGD Released",
        description: "Gunderson Dettmer releases ChatGD, an AI-powered legal assistant for startup and venture capital law.",
        logoUrl: "https://vault.com/_next/image?url=https%3A%2F%2Fmedia2.vault.com%2F14347497%2Fgunderson-logo-brand-mark-navy.jpg&w=384&q=75"
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
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    marginRight?: boolean;
    primary?: boolean;
}

const Button = styled.button.withConfig({
    shouldForwardProp: (prop) => !['marginRight', 'primary'].includes(prop),
}) <ButtonProps>`
  background: ${(props) => (props.primary ? 'linear-gradient(135deg, #4263eb 0%, #3b5bdb 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)')};
  color: ${(props) => (props.primary ? '#ffffff' : '#4263eb')};
  border: none;
  padding: 0.75rem 1.5rem;
  margin-right: ${(props) => (props.marginRight ? '1rem' : '0')};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  box-sizing: border-box;
  font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  overflow: hidden;
`;

const DashboardCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
`;

const ControlsContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 600;
`;

const StatLabel = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ... existing Button component ...

const Heading = styled.h1`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #212529;
  font-size: 2.25rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ToggleLabel = styled.span`
  margin-right: 0.75rem;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
`;

// Number of milliseconds to display the event modal
const EVENT_DISPLAY_DURATION = 5000; // Adjust 'n' seconds here

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
    const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [visibleData, setVisibleData] = useState<Serie[]>([]);
    const [aggregateStars, setAggregateStars] = useState<number>(0);
    const [topProjects, setTopProjects] = useState<Set<string>>(new Set());
    const [xAxisTickValues, setXAxisTickValues] = useState<string | Date[]>('every year');

    const [projectCreationTimes, setProjectCreationTimes] = useState<Map<string, Date>>(new Map());
    const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());
    const [leavingTopProjects, setLeavingTopProjects] = useState<Set<string>>(new Set());
    const [enteringTopProjects, setEnteringTopProjects] = useState<Set<string>>(new Set());
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [pauseOnEvents, setPauseOnEvents] = useState<boolean>(false);

    useEffect(() => {
        if (currentEvent) {
            console.log('currentEvent', currentEvent);
        }
    }, [currentEvent])

    useEffect(() => {
        if (timeline.length > 0 && data.length > 0) {
            updateVisibleData(currentTimeIndex); // Use currentTimeIndex, which is -1 initially
        }
    }, [timeline, data, currentTimeIndex]);

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
        // Removed setting visibleData to seriesData
        // setVisibleData(seriesData); // <-- Removed this line
        setVisibleProjects(new Set()); // Initialized to an empty set

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
            if (timeIndex < 0) {
                // Set visible data to empty arrays when timeIndex is less than 0
                const emptyVisibleData = data.map((serie) => ({
                    ...serie,
                    data: [],
                }));
                setVisibleData(emptyVisibleData);
                setAggregateStars(0);
                return;
            }

            const currentTime = processedTimeline[timeIndex];

            // Remove this condition
            // if (currentTimeIndex === timeIndex) {
            //   return;
            // }

            // Proceed to update visible data up to the current time

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
                .filter((serie) => newVisibleProjects.has(serie.id as string))
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
            let maxY = initialMaxY;
            newVisibleData.forEach((serie) => {
                const lastPoint = serie.data[serie.data.length - 1];
                const yValue = typeof lastPoint?.y === 'number' ? lastPoint.y : 0;
                if (yValue > maxY) {
                    maxY = yValue;
                }
            });
            setCurrentMaxY(maxY * 1.1);

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
            processedTimeline.length,
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
                if (currentTimeIndex >= processedTimeline.length - 1 || currentTimeIndex < 0) {
                    handleReset();
                }

                // Hide the event card if resuming
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
        setCurrentTimeIndex(-1); // Reset to -1 so no data is displayed
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
                series={props.series}
                innerWidth={props.innerWidth} // Passed here
            />
        ),
        [topProjects, enteringTopProjects, leavingTopProjects]
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

    // Add a function to handle toggle change
    const handlePauseOnEventsToggle = () => {
        setPauseOnEvents(prev => !prev);
    };

    return (
        <AppContainer>
            <DashboardCard>
                <Heading>Legal Industry Milestones vs Development Velocity</Heading>
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
                            background: 'transparent',
                            text: {
                                fill: '#495057',
                                fontSize: 12,
                                fontWeight: 500,
                            },
                            axis: {
                                domain: {
                                    line: {
                                        stroke: '#ced4da',
                                        strokeWidth: 1,
                                    },
                                },
                                ticks: {
                                    line: {
                                        stroke: '#ced4da',
                                        strokeWidth: 1,
                                    },
                                    text: {
                                        fill: '#495057',
                                        fontSize: 11,
                                    },
                                },
                                legend: {
                                    text: {
                                        fontSize: 12,
                                        fill: '#343a40',
                                        fontWeight: 600,
                                    },
                                },
                            },
                            grid: {
                                line: {
                                    stroke: '#e9ecef',
                                    strokeWidth: 1,
                                },
                            },
                            legends: {
                                text: {
                                    fill: '#495057',
                                    fontSize: 11,
                                },
                            },
                            tooltip: {
                                container: {
                                    background: '#ffffff',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
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
