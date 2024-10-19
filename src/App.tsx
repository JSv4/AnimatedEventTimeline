import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveLine, Serie } from '@nivo/line';
import { Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';
import * as d3 from 'd3';

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
}

/**
 * Represents an interpolated data point for a project.
 */
interface InterpolatedDataPoint {
  date: Date;
  count: number;
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

/**
 * Add this interface definition near the top of your file, with other interfaces
 */
interface CustomDatum {
  x: Date | string;
  y: number;
}

/**
 * Sample data for demonstration purposes.
 */
const sampleData: ProjectData[] = [{"name": "JSv4/OpenContracts", "starHistory": [{"date": "2022-10-24", "count": 0}, {"date": "2024-07-03", "count": 100}, {"date": "2024-07-04", "count": 200}, {"date": "2024-07-06", "count": 300}, {"date": "2024-07-11", "count": 400}, {"date": "2024-07-12", "count": 500}, {"date": "2024-07-17", "count": 600}, {"date": "2024-09-08", "count": 668}, {"date": "2024-09-08", "count": 669}], "logoUrl": "https://avatars.githubusercontent.com/u/5049984?v=4"}, {"name": "nltk/nltk", "starHistory": [{"date": "2009-09-07", "count": 0}, {"date": "2009-09-07", "count": 100}, {"date": "2011-10-18", "count": 500}, {"date": "2013-08-15", "count": 900}, {"date": "2014-05-19", "count": 1300}, {"date": "2014-12-24", "count": 1700}, {"date": "2015-06-21", "count": 2100}, {"date": "2015-11-30", "count": 2500}, {"date": "2016-03-27", "count": 2900}, {"date": "2016-08-05", "count": 3300}, {"date": "2016-12-06", "count": 3700}, {"date": "2017-03-21", "count": 4100}, {"date": "2017-06-15", "count": 4500}, {"date": "2017-09-18", "count": 4900}, {"date": "2017-12-21", "count": 5300}, {"date": "2018-03-19", "count": 5700}, {"date": "2018-06-14", "count": 6100}, {"date": "2018-10-04", "count": 6500}, {"date": "2019-01-18", "count": 6900}, {"date": "2019-05-08", "count": 7300}, {"date": "2019-09-03", "count": 7700}, {"date": "2019-12-26", "count": 8100}, {"date": "2020-05-06", "count": 8500}, {"date": "2020-09-20", "count": 8900}, {"date": "2021-02-14", "count": 9300}, {"date": "2021-07-21", "count": 9700}, {"date": "2022-01-17", "count": 10100}, {"date": "2022-05-17", "count": 10500}, {"date": "2022-10-10", "count": 10900}, {"date": "2023-02-10", "count": 11300}, {"date": "2023-05-02", "count": 11700}, {"date": "2023-08-24", "count": 12100}, {"date": "2023-12-22", "count": 12500}, {"date": "2024-04-04", "count": 12900}, {"date": "2024-08-07", "count": 13300}, {"date": "2024-09-08", "count": 13408}], "logoUrl": "https://avatars.githubusercontent.com/u/124114?v=4"}, {"name": "LexPredict/lexpredict-lexnlp", "starHistory": [{"date": "2017-09-30", "count": 0}, {"date": "2018-12-15", "count": 100}, {"date": "2019-08-13", "count": 200}, {"date": "2020-06-07", "count": 300}, {"date": "2020-12-15", "count": 400}, {"date": "2022-03-23", "count": 500}, {"date": "2023-06-09", "count": 600}, {"date": "2024-09-04", "count": 690}, {"date": "2024-09-08", "count": 690}], "logoUrl": "https://avatars.githubusercontent.com/u/8458599?v=4"}, {"name": "nlmatics/nlm-ingestor", "starHistory": [{"date": "2024-01-17", "count": 0}, {"date": "2024-01-24", "count": 100}, {"date": "2024-01-24", "count": 200}, {"date": "2024-01-24", "count": 300}, {"date": "2024-01-24", "count": 400}, {"date": "2024-01-25", "count": 500}, {"date": "2024-02-09", "count": 600}, {"date": "2024-03-19", "count": 700}, {"date": "2024-04-29", "count": 800}, {"date": "2024-07-03", "count": 900}, {"date": "2024-08-21", "count": 1000}, {"date": "2024-09-06", "count": 1022}, {"date": "2024-09-08", "count": 1022}], "logoUrl": "https://avatars.githubusercontent.com/u/52432964?v=4"}, {"name": "deepdoctection/deepdoctection", "starHistory": [{"date": "2021-12-09", "count": 0}, {"date": "2022-08-08", "count": 100}, {"date": "2023-02-01", "count": 200}, {"date": "2023-04-26", "count": 300}, {"date": "2023-04-27", "count": 400}, {"date": "2023-04-27", "count": 500}, {"date": "2023-04-27", "count": 600}, {"date": "2023-04-27", "count": 700}, {"date": "2023-04-27", "count": 800}, {"date": "2023-04-27", "count": 900}, {"date": "2023-04-28", "count": 1000}, {"date": "2023-04-29", "count": 1100}, {"date": "2023-05-01", "count": 1200}, {"date": "2023-05-05", "count": 1300}, {"date": "2023-05-21", "count": 1400}, {"date": "2023-07-03", "count": 1500}, {"date": "2023-08-19", "count": 1600}, {"date": "2023-10-15", "count": 1700}, {"date": "2023-11-27", "count": 1800}, {"date": "2024-01-18", "count": 1900}, {"date": "2024-02-27", "count": 2000}, {"date": "2024-04-07", "count": 2100}, {"date": "2024-05-06", "count": 2200}, {"date": "2024-06-12", "count": 2300}, {"date": "2024-08-01", "count": 2400}, {"date": "2024-09-07", "count": 2475}, {"date": "2024-09-08", "count": 2476}], "logoUrl": "https://avatars.githubusercontent.com/u/93912194?v=4"}, {"name": "allenai/pawls", "starHistory": [{"date": "2020-08-10", "count": 0}, {"date": "2021-02-22", "count": 100}, {"date": "2022-04-15", "count": 200}, {"date": "2023-06-28", "count": 300}, {"date": "2024-08-21", "count": 380}, {"date": "2024-09-08", "count": 380}], "logoUrl": "https://avatars.githubusercontent.com/u/5667695?v=4"}, {"name": "jhpyle/docassemble", "starHistory": [{"date": "2015-04-18", "count": 0}, {"date": "2018-12-05", "count": 100}, {"date": "2019-09-14", "count": 200}, {"date": "2020-03-28", "count": 300}, {"date": "2021-03-18", "count": 400}, {"date": "2021-12-04", "count": 500}, {"date": "2023-01-22", "count": 600}, {"date": "2024-01-08", "count": 700}, {"date": "2024-09-04", "count": 768}, {"date": "2024-09-08", "count": 768}], "logoUrl": "https://avatars.githubusercontent.com/u/11341940?v=4"}, {"name": "accordproject/template-archive", "starHistory": [{"date": "2017-11-02", "count": 0}, {"date": "2019-12-29", "count": 100}, {"date": "2022-03-09", "count": 200}, {"date": "2024-08-21", "count": 280}, {"date": "2024-09-08", "count": 280}], "logoUrl": "https://avatars.githubusercontent.com/u/29445438?v=4"}, {"name": "Open-Cap-Table-Coalition/Open-Cap-Format-OCF", "starHistory": [{"date": "2021-09-29", "count": 0}, {"date": "2023-11-17", "count": 100}, {"date": "2024-09-06", "count": 142}, {"date": "2024-09-08", "count": 142}], "logoUrl": "https://avatars.githubusercontent.com/u/90472853?v=4"}, {"name": "JSv4/Python-Redlines", "starHistory": [{"date": "2024-01-15", "count": 0}, {"date": "2024-09-03", "count": 44}, {"date": "2024-09-08", "count": 44}], "logoUrl": "https://avatars.githubusercontent.com/u/5049984?v=4"}, {"name": "sloev/sentimental-onix", "starHistory": [{"date": "2023-03-15", "count": 0}, {"date": "2023-12-19", "count": 3}, {"date": "2024-09-08", "count": 3}], "logoUrl": "https://avatars.githubusercontent.com/u/873297?v=4"}, {"name": "QData/TextAttack", "starHistory": [{"date": "2019-10-15", "count": 0}, {"date": "2020-05-30", "count": 100}, {"date": "2020-06-26", "count": 200}, {"date": "2020-06-28", "count": 300}, {"date": "2020-06-30", "count": 400}, {"date": "2020-07-03", "count": 500}, {"date": "2020-07-21", "count": 600}, {"date": "2020-08-05", "count": 700}, {"date": "2020-09-04", "count": 800}, {"date": "2020-10-27", "count": 900}, {"date": "2020-11-20", "count": 1000}, {"date": "2021-01-01", "count": 1100}, {"date": "2021-02-23", "count": 1200}, {"date": "2021-04-19", "count": 1300}, {"date": "2021-05-20", "count": 1400}, {"date": "2021-08-02", "count": 1500}, {"date": "2021-10-05", "count": 1600}, {"date": "2021-12-12", "count": 1700}, {"date": "2022-03-01", "count": 1800}, {"date": "2022-05-12", "count": 1900}, {"date": "2022-08-11", "count": 2000}, {"date": "2022-11-22", "count": 2100}, {"date": "2023-02-18", "count": 2200}, {"date": "2023-05-11", "count": 2300}, {"date": "2023-07-28", "count": 2400}, {"date": "2023-10-18", "count": 2500}, {"date": "2023-12-29", "count": 2600}, {"date": "2024-03-29", "count": 2700}, {"date": "2024-06-18", "count": 2800}, {"date": "2024-09-08", "count": 2887}, {"date": "2024-09-08", "count": 2887}], "logoUrl": "https://avatars.githubusercontent.com/u/20266371?v=4"}, {"name": "clips/pattern", "starHistory": [{"date": "2011-05-03", "count": 0}, {"date": "2011-05-03", "count": 100}, {"date": "2011-05-03", "count": 300}, {"date": "2011-05-03", "count": 500}, {"date": "2011-05-03", "count": 700}, {"date": "2011-05-14", "count": 900}, {"date": "2011-12-02", "count": 1100}, {"date": "2013-02-13", "count": 1300}, {"date": "2013-07-05", "count": 1500}, {"date": "2013-10-15", "count": 1700}, {"date": "2014-02-26", "count": 1900}, {"date": "2014-06-08", "count": 2100}, {"date": "2014-09-09", "count": 2300}, {"date": "2014-12-22", "count": 2500}, {"date": "2015-04-06", "count": 2700}, {"date": "2015-06-01", "count": 2900}, {"date": "2015-08-15", "count": 3100}, {"date": "2015-10-22", "count": 3300}, {"date": "2015-12-19", "count": 3500}, {"date": "2016-01-29", "count": 3700}, {"date": "2016-04-08", "count": 3900}, {"date": "2016-06-03", "count": 4100}, {"date": "2016-08-26", "count": 4300}, {"date": "2016-11-10", "count": 4500}, {"date": "2017-01-26", "count": 4700}, {"date": "2017-04-10", "count": 4900}, {"date": "2017-07-10", "count": 5100}, {"date": "2017-09-25", "count": 5300}, {"date": "2017-12-09", "count": 5500}, {"date": "2018-02-25", "count": 5700}, {"date": "2018-05-24", "count": 5900}, {"date": "2018-09-08", "count": 6100}, {"date": "2018-12-07", "count": 6300}, {"date": "2019-03-26", "count": 6500}, {"date": "2019-07-14", "count": 6700}, {"date": "2019-11-22", "count": 6900}, {"date": "2020-04-30", "count": 7100}, {"date": "2020-08-31", "count": 7300}, {"date": "2020-12-28", "count": 7500}, {"date": "2021-05-07", "count": 7700}, {"date": "2021-11-01", "count": 7900}, {"date": "2022-06-24", "count": 8100}, {"date": "2023-01-23", "count": 8300}, {"date": "2023-10-02", "count": 8500}, {"date": "2024-07-25", "count": 8700}, {"date": "2024-09-08", "count": 8719}], "logoUrl": "https://avatars.githubusercontent.com/u/765924?v=4"}, {"name": "explosion/spaCy", "starHistory": [{"date": "2014-07-03", "count": 0}, {"date": "2015-01-25", "count": 100}, {"date": "2015-09-20", "count": 1000}, {"date": "2016-07-16", "count": 1900}, {"date": "2016-11-18", "count": 2800}, {"date": "2017-03-16", "count": 3700}, {"date": "2017-07-09", "count": 4600}, {"date": "2017-11-04", "count": 5500}, {"date": "2017-11-13", "count": 6400}, {"date": "2018-01-18", "count": 7300}, {"date": "2018-04-04", "count": 8200}, {"date": "2018-07-05", "count": 9100}, {"date": "2018-09-19", "count": 10000}, {"date": "2018-12-19", "count": 10900}, {"date": "2019-03-20", "count": 11800}, {"date": "2019-06-03", "count": 12700}, {"date": "2019-09-08", "count": 13600}, {"date": "2019-12-13", "count": 14500}, {"date": "2020-04-15", "count": 15400}, {"date": "2020-08-16", "count": 16300}, {"date": "2020-12-30", "count": 17200}, {"date": "2021-02-02", "count": 18100}, {"date": "2021-03-05", "count": 19000}, {"date": "2021-06-12", "count": 19900}, {"date": "2021-10-09", "count": 20800}, {"date": "2022-01-27", "count": 21700}, {"date": "2022-04-22", "count": 22600}, {"date": "2022-08-22", "count": 23500}, {"date": "2022-12-25", "count": 24400}, {"date": "2023-04-05", "count": 25300}, {"date": "2023-07-05", "count": 26200}, {"date": "2023-10-20", "count": 27100}, {"date": "2024-02-07", "count": 28000}, {"date": "2024-05-31", "count": 28900}, {"date": "2024-09-08", "count": 29625}], "logoUrl": "https://avatars.githubusercontent.com/u/20011530?v=4"}, {"name": "nebuly-ai/nebullvm", "starHistory": [{"date": "2022-02-12", "count": 0}, {"date": "2022-02-22", "count": 100}, {"date": "2022-02-24", "count": 300}, {"date": "2022-03-22", "count": 500}, {"date": "2022-03-24", "count": 700}, {"date": "2022-04-08", "count": 900}, {"date": "2022-06-05", "count": 1100}, {"date": "2022-09-27", "count": 1300}, {"date": "2022-12-24", "count": 1500}, {"date": "2023-01-01", "count": 1700}, {"date": "2023-01-12", "count": 1900}, {"date": "2023-02-05", "count": 2100}, {"date": "2023-02-27", "count": 2300}, {"date": "2023-02-27", "count": 2500}, {"date": "2023-02-27", "count": 2700}, {"date": "2023-02-27", "count": 2900}, {"date": "2023-02-28", "count": 3100}, {"date": "2023-02-28", "count": 3300}, {"date": "2023-02-28", "count": 3500}, {"date": "2023-02-28", "count": 3700}, {"date": "2023-02-28", "count": 3900}, {"date": "2023-03-01", "count": 4100}, {"date": "2023-03-01", "count": 4300}, {"date": "2023-03-02", "count": 4500}, {"date": "2023-03-02", "count": 4700}, {"date": "2023-03-04", "count": 4900}, {"date": "2023-03-05", "count": 5100}, {"date": "2023-03-06", "count": 5300}, {"date": "2023-03-06", "count": 5500}, {"date": "2023-03-08", "count": 5700}, {"date": "2023-03-09", "count": 5900}, {"date": "2023-03-11", "count": 6100}, {"date": "2023-03-14", "count": 6300}, {"date": "2023-03-17", "count": 6500}, {"date": "2023-03-21", "count": 6700}, {"date": "2023-03-24", "count": 6900}, {"date": "2023-03-30", "count": 7100}, {"date": "2023-04-06", "count": 7300}, {"date": "2023-04-12", "count": 7500}, {"date": "2023-04-20", "count": 7700}, {"date": "2023-05-11", "count": 7900}, {"date": "2023-07-25", "count": 8100}, {"date": "2024-03-26", "count": 8300}, {"date": "2024-09-08", "count": 8371}], "logoUrl": "https://avatars.githubusercontent.com/u/83510798?v=4"}, {"name": "chartbeat-labs/textacy", "starHistory": [{"date": "2016-02-03", "count": 0}, {"date": "2016-11-01", "count": 100}, {"date": "2016-12-30", "count": 200}, {"date": "2017-03-30", "count": 300}, {"date": "2017-07-01", "count": 400}, {"date": "2017-11-03", "count": 500}, {"date": "2018-02-01", "count": 600}, {"date": "2018-04-26", "count": 700}, {"date": "2018-08-06", "count": 800}, {"date": "2018-11-02", "count": 900}, {"date": "2019-02-14", "count": 1000}, {"date": "2019-05-14", "count": 1100}, {"date": "2019-08-30", "count": 1200}, {"date": "2020-01-02", "count": 1300}, {"date": "2020-06-17", "count": 1400}, {"date": "2020-10-24", "count": 1500}, {"date": "2021-04-02", "count": 1600}, {"date": "2021-09-07", "count": 1700}, {"date": "2021-12-07", "count": 1800}, {"date": "2022-06-02", "count": 1900}, {"date": "2023-01-30", "count": 2000}, {"date": "2023-10-13", "count": 2100}, {"date": "2024-09-04", "count": 2200}, {"date": "2024-09-08", "count": 2201}], "logoUrl": "https://avatars.githubusercontent.com/u/5552574?v=4"}, {"name": "JasonKessler/scattertext", "starHistory": [{"date": "2016-07-21", "count": 0}, {"date": "2017-04-12", "count": 100}, {"date": "2017-06-10", "count": 200}, {"date": "2017-08-02", "count": 300}, {"date": "2017-12-05", "count": 400}, {"date": "2018-04-02", "count": 500}, {"date": "2018-07-12", "count": 600}, {"date": "2018-12-07", "count": 700}, {"date": "2019-03-23", "count": 800}, {"date": "2019-06-06", "count": 900}, {"date": "2019-09-25", "count": 1000}, {"date": "2019-12-29", "count": 1100}, {"date": "2020-04-27", "count": 1200}, {"date": "2020-08-22", "count": 1300}, {"date": "2020-11-30", "count": 1400}, {"date": "2021-04-16", "count": 1500}, {"date": "2021-08-03", "count": 1600}, {"date": "2022-01-18", "count": 1700}, {"date": "2022-06-16", "count": 1800}, {"date": "2022-09-06", "count": 1900}, {"date": "2023-02-02", "count": 2000}, {"date": "2023-08-11", "count": 2100}, {"date": "2024-05-09", "count": 2200}, {"date": "2024-09-03", "count": 2231}, {"date": "2024-09-08", "count": 2231}], "logoUrl": "https://avatars.githubusercontent.com/u/312924?v=4"}, {"name": "dmlc/gluon-nlp", "starHistory": [{"date": "2018-04-04", "count": 0}, {"date": "2018-04-25", "count": 100}, {"date": "2018-04-26", "count": 200}, {"date": "2018-04-28", "count": 300}, {"date": "2018-05-05", "count": 400}, {"date": "2018-05-19", "count": 500}, {"date": "2018-06-05", "count": 600}, {"date": "2018-07-25", "count": 700}, {"date": "2018-08-13", "count": 800}, {"date": "2018-10-04", "count": 900}, {"date": "2018-11-20", "count": 1000}, {"date": "2018-12-28", "count": 1100}, {"date": "2019-02-15", "count": 1200}, {"date": "2019-03-21", "count": 1300}, {"date": "2019-05-01", "count": 1400}, {"date": "2019-06-28", "count": 1500}, {"date": "2019-08-22", "count": 1600}, {"date": "2019-11-02", "count": 1700}, {"date": "2020-01-15", "count": 1800}, {"date": "2020-04-28", "count": 1900}, {"date": "2020-08-13", "count": 2000}, {"date": "2020-11-27", "count": 2100}, {"date": "2021-05-08", "count": 2200}, {"date": "2022-01-18", "count": 2300}, {"date": "2022-09-30", "count": 2400}, {"date": "2023-09-09", "count": 2500}, {"date": "2024-09-06", "count": 2554}, {"date": "2024-09-08", "count": 2555}], "logoUrl": "https://avatars.githubusercontent.com/u/11508361?v=4"}, {"name": "allenai/allennlp", "starHistory": [{"date": "2017-05-15", "count": 0}, {"date": "2017-09-09", "count": 100}, {"date": "2017-09-11", "count": 400}, {"date": "2017-09-17", "count": 700}, {"date": "2017-11-28", "count": 1000}, {"date": "2018-02-01", "count": 1300}, {"date": "2018-03-21", "count": 1600}, {"date": "2018-05-16", "count": 1900}, {"date": "2018-06-20", "count": 2200}, {"date": "2018-07-19", "count": 2500}, {"date": "2018-08-26", "count": 2800}, {"date": "2018-09-21", "count": 3100}, {"date": "2018-10-17", "count": 3400}, {"date": "2018-11-07", "count": 3700}, {"date": "2018-11-26", "count": 4000}, {"date": "2018-12-17", "count": 4300}, {"date": "2019-01-09", "count": 4600}, {"date": "2019-02-08", "count": 4900}, {"date": "2019-03-08", "count": 5200}, {"date": "2019-04-09", "count": 5500}, {"date": "2019-05-12", "count": 5800}, {"date": "2019-06-20", "count": 6100}, {"date": "2019-08-05", "count": 6400}, {"date": "2019-09-11", "count": 6700}, {"date": "2019-10-30", "count": 7000}, {"date": "2019-12-18", "count": 7300}, {"date": "2020-02-14", "count": 7600}, {"date": "2020-04-12", "count": 7900}, {"date": "2020-06-14", "count": 8200}, {"date": "2020-08-09", "count": 8500}, {"date": "2020-10-23", "count": 8800}, {"date": "2020-12-11", "count": 9100}, {"date": "2021-03-11", "count": 9400}, {"date": "2021-05-23", "count": 9700}, {"date": "2021-07-18", "count": 10000}, {"date": "2021-11-12", "count": 10300}, {"date": "2022-03-22", "count": 10600}, {"date": "2022-07-31", "count": 10900}, {"date": "2023-01-26", "count": 11200}, {"date": "2023-10-22", "count": 11500}, {"date": "2024-09-05", "count": 11728}, {"date": "2024-09-08", "count": 11728}], "logoUrl": "https://avatars.githubusercontent.com/u/5667695?v=4"}, {"name": "PetrochukM/PyTorch-NLP", "starHistory": [{"date": "2018-02-25", "count": 0}, {"date": "2018-03-20", "count": 100}, {"date": "2018-04-09", "count": 200}, {"date": "2018-04-10", "count": 300}, {"date": "2018-04-12", "count": 400}, {"date": "2018-04-14", "count": 500}, {"date": "2018-04-24", "count": 600}, {"date": "2018-05-07", "count": 700}, {"date": "2018-06-02", "count": 800}, {"date": "2018-08-09", "count": 900}, {"date": "2018-11-27", "count": 1000}, {"date": "2019-02-08", "count": 1100}, {"date": "2019-04-27", "count": 1200}, {"date": "2019-07-24", "count": 1300}, {"date": "2019-11-02", "count": 1400}, {"date": "2020-01-11", "count": 1500}, {"date": "2020-05-06", "count": 1600}, {"date": "2020-08-18", "count": 1700}, {"date": "2021-02-18", "count": 1800}, {"date": "2021-09-18", "count": 1900}, {"date": "2022-04-09", "count": 2000}, {"date": "2023-01-12", "count": 2100}, {"date": "2024-05-31", "count": 2200}, {"date": "2024-08-12", "count": 2208}, {"date": "2024-09-08", "count": 2208}], "logoUrl": "https://avatars.githubusercontent.com/u/7424737?v=4"}, {"name": "columbia-applied-data-science/rosetta", "starHistory": [{"date": "2013-11-03", "count": 0}, {"date": "2015-05-05", "count": 100}, {"date": "2021-11-25", "count": 200}, {"date": "2024-04-05", "count": 206}, {"date": "2024-09-08", "count": 206}], "logoUrl": "https://avatars.githubusercontent.com/u/2630798?v=4"}, {"name": "proycon/pynlpl", "starHistory": [{"date": "2010-07-06", "count": 0}, {"date": "2015-05-14", "count": 100}, {"date": "2016-10-22", "count": 200}, {"date": "2018-05-26", "count": 300}, {"date": "2020-06-09", "count": 400}, {"date": "2024-09-03", "count": 478}, {"date": "2024-09-08", "count": 479}], "logoUrl": "https://avatars.githubusercontent.com/u/75427?v=4"}, {"name": "proycon/foliapy", "starHistory": [{"date": "2018-09-06", "count": 0}, {"date": "2023-12-19", "count": 18}, {"date": "2024-09-08", "count": 18}], "logoUrl": "https://avatars.githubusercontent.com/u/75427?v=4"}, {"name": "sergioburdisso/pyss3", "starHistory": [{"date": "2019-11-11", "count": 0}, {"date": "2020-04-23", "count": 100}, {"date": "2021-06-11", "count": 200}, {"date": "2023-07-19", "count": 300}, {"date": "2024-08-30", "count": 332}, {"date": "2024-09-08", "count": 333}], "logoUrl": "https://avatars.githubusercontent.com/u/12646542?v=4"}, {"name": "datquocnguyen/jPTDP", "starHistory": [{"date": "2017-05-16", "count": 0}, {"date": "2019-04-01", "count": 100}, {"date": "2024-06-21", "count": 158}, {"date": "2024-09-08", "count": 158}], "logoUrl": "https://avatars.githubusercontent.com/u/2412555?v=4"}, {"name": "bigartm/bigartm", "starHistory": [{"date": "2014-09-15", "count": 0}, {"date": "2016-11-11", "count": 100}, {"date": "2017-09-23", "count": 200}, {"date": "2018-07-06", "count": 300}, {"date": "2019-05-19", "count": 400}, {"date": "2020-08-19", "count": 500}, {"date": "2022-03-24", "count": 600}, {"date": "2024-06-24", "count": 660}, {"date": "2024-09-08", "count": 661}], "logoUrl": "https://avatars.githubusercontent.com/u/8783740?v=4"}, {"name": "snipsco/snips-nlu", "starHistory": [{"date": "2017-02-08", "count": 0}, {"date": "2018-03-08", "count": 100}, {"date": "2018-03-09", "count": 200}, {"date": "2018-03-09", "count": 300}, {"date": "2018-03-10", "count": 400}, {"date": "2018-03-10", "count": 500}, {"date": "2018-03-11", "count": 600}, {"date": "2018-03-12", "count": 700}, {"date": "2018-03-12", "count": 800}, {"date": "2018-03-13", "count": 900}, {"date": "2018-03-14", "count": 1000}, {"date": "2018-03-17", "count": 1100}, {"date": "2018-03-26", "count": 1200}, {"date": "2018-04-11", "count": 1300}, {"date": "2018-04-30", "count": 1400}, {"date": "2018-05-17", "count": 1500}, {"date": "2018-06-13", "count": 1600}, {"date": "2018-07-14", "count": 1700}, {"date": "2018-08-16", "count": 1800}, {"date": "2018-09-24", "count": 1900}, {"date": "2018-11-07", "count": 2000}, {"date": "2018-12-19", "count": 2100}, {"date": "2019-01-29", "count": 2200}, {"date": "2019-04-09", "count": 2300}, {"date": "2019-04-22", "count": 2400}, {"date": "2019-05-07", "count": 2500}, {"date": "2019-06-20", "count": 2600}, {"date": "2019-08-11", "count": 2700}, {"date": "2019-10-10", "count": 2800}, {"date": "2019-12-02", "count": 2900}, {"date": "2020-02-12", "count": 3000}, {"date": "2020-05-04", "count": 3100}, {"date": "2020-08-24", "count": 3200}, {"date": "2021-01-06", "count": 3300}, {"date": "2021-06-18", "count": 3400}, {"date": "2022-01-08", "count": 3500}, {"date": "2022-07-16", "count": 3600}, {"date": "2023-03-02", "count": 3700}, {"date": "2023-10-25", "count": 3800}, {"date": "2024-08-30", "count": 3886}, {"date": "2024-09-08", "count": 3886}], "logoUrl": "https://avatars.githubusercontent.com/u/2564618?v=4"}, {"name": "chakki-works/chazutsu", "starHistory": [{"date": "2017-05-08", "count": 0}, {"date": "2018-03-01", "count": 100}, {"date": "2019-11-25", "count": 200}, {"date": "2024-02-21", "count": 244}, {"date": "2024-09-08", "count": 244}], "logoUrl": "https://avatars.githubusercontent.com/u/25578516?v=4"}, {"name": "gutfeeling/word_forms", "starHistory": [{"date": "2016-11-07", "count": 0}, {"date": "2016-11-13", "count": 100}, {"date": "2018-02-28", "count": 200}, {"date": "2019-07-29", "count": 300}, {"date": "2020-10-01", "count": 400}, {"date": "2022-01-17", "count": 500}, {"date": "2024-02-26", "count": 600}, {"date": "2024-09-04", "count": 616}, {"date": "2024-09-08", "count": 616}], "logoUrl": "https://avatars.githubusercontent.com/u/6130491?v=4"}, {"name": "ArtificiAI/Multilingual-Latent-Dirichlet-Allocation-LDA", "starHistory": [{"date": "2018-09-03", "count": 0}, {"date": "2024-05-10", "count": 82}, {"date": "2024-09-08", "count": 82}], "logoUrl": "https://avatars.githubusercontent.com/u/41756951?v=4"}, {"name": "NervanaSystems/nlp-architect", "starHistory": [{"date": "2018-05-17", "count": 0}, {"date": "2018-05-25", "count": 100}, {"date": "2018-05-25", "count": 200}, {"date": "2018-05-26", "count": 300}, {"date": "2018-05-27", "count": 400}, {"date": "2018-05-28", "count": 500}, {"date": "2018-05-28", "count": 600}, {"date": "2018-05-30", "count": 700}, {"date": "2018-06-03", "count": 800}, {"date": "2018-06-07", "count": 900}, {"date": "2018-06-13", "count": 1000}, {"date": "2018-06-22", "count": 1100}, {"date": "2018-06-28", "count": 1200}, {"date": "2018-07-16", "count": 1300}, {"date": "2018-10-04", "count": 1400}, {"date": "2018-12-06", "count": 1500}, {"date": "2019-01-10", "count": 1600}, {"date": "2019-02-25", "count": 1700}, {"date": "2019-05-03", "count": 1800}, {"date": "2019-06-22", "count": 1900}, {"date": "2019-09-16", "count": 2000}, {"date": "2019-11-10", "count": 2100}, {"date": "2020-01-26", "count": 2200}, {"date": "2020-05-12", "count": 2300}, {"date": "2020-09-08", "count": 2400}, {"date": "2021-01-25", "count": 2500}, {"date": "2021-06-15", "count": 2600}, {"date": "2021-11-29", "count": 2700}, {"date": "2022-07-14", "count": 2800}, {"date": "2023-11-17", "count": 2900}, {"date": "2024-08-28", "count": 2936}, {"date": "2024-09-08", "count": 2936}], "logoUrl": "https://avatars.githubusercontent.com/u/1492758?v=4"}, {"name": "zalandoresearch/flair", "starHistory": [{"date": "2018-06-11", "count": 0}, {"date": "2018-06-30", "count": 100}, {"date": "2018-10-18", "count": 500}, {"date": "2018-12-19", "count": 900}, {"date": "2018-12-27", "count": 1300}, {"date": "2019-01-02", "count": 1700}, {"date": "2019-01-02", "count": 2100}, {"date": "2019-01-02", "count": 2500}, {"date": "2019-01-03", "count": 2900}, {"date": "2019-01-05", "count": 3300}, {"date": "2019-01-09", "count": 3700}, {"date": "2019-01-21", "count": 4100}, {"date": "2019-02-11", "count": 4500}, {"date": "2019-03-04", "count": 4900}, {"date": "2019-04-08", "count": 5300}, {"date": "2019-05-20", "count": 5700}, {"date": "2019-07-03", "count": 6100}, {"date": "2019-08-12", "count": 6500}, {"date": "2019-09-30", "count": 6900}, {"date": "2019-11-28", "count": 7300}, {"date": "2020-02-11", "count": 7700}, {"date": "2020-05-01", "count": 8100}, {"date": "2020-06-23", "count": 8500}, {"date": "2020-09-07", "count": 8900}, {"date": "2020-12-13", "count": 9300}, {"date": "2021-03-10", "count": 9700}, {"date": "2021-06-08", "count": 10100}, {"date": "2021-09-30", "count": 10500}, {"date": "2022-01-24", "count": 10900}, {"date": "2022-05-05", "count": 11300}, {"date": "2022-08-07", "count": 11700}, {"date": "2022-12-08", "count": 12100}, {"date": "2023-04-09", "count": 12500}, {"date": "2023-08-20", "count": 12900}, {"date": "2024-01-27", "count": 13300}, {"date": "2024-07-14", "count": 13700}, {"date": "2024-09-08", "count": 13804}], "logoUrl": "https://avatars.githubusercontent.com/u/59021421?v=4"}, {"name": "BrikerMan/Kashgari", "starHistory": [{"date": "2019-01-19", "count": 0}, {"date": "2019-01-30", "count": 100}, {"date": "2019-02-23", "count": 200}, {"date": "2019-03-07", "count": 300}, {"date": "2019-04-22", "count": 400}, {"date": "2019-05-20", "count": 500}, {"date": "2019-06-21", "count": 600}, {"date": "2019-07-17", "count": 700}, {"date": "2019-08-01", "count": 800}, {"date": "2019-08-29", "count": 900}, {"date": "2019-10-04", "count": 1000}, {"date": "2019-11-08", "count": 1100}, {"date": "2019-12-11", "count": 1200}, {"date": "2020-01-27", "count": 1300}, {"date": "2020-03-18", "count": 1400}, {"date": "2020-04-30", "count": 1500}, {"date": "2020-06-23", "count": 1600}, {"date": "2020-08-28", "count": 1700}, {"date": "2020-11-05", "count": 1800}, {"date": "2021-01-12", "count": 1900}, {"date": "2021-05-01", "count": 2000}, {"date": "2021-10-06", "count": 2100}, {"date": "2022-03-09", "count": 2200}, {"date": "2023-03-07", "count": 2300}, {"date": "2024-09-07", "count": 2386}, {"date": "2024-09-08", "count": 2387}], "logoUrl": "https://avatars.githubusercontent.com/u/9368907?v=4"}, {"name": "deepset-ai/FARM", "starHistory": [{"date": "2019-07-17", "count": 0}, {"date": "2019-07-31", "count": 100}, {"date": "2019-08-28", "count": 200}, {"date": "2019-09-18", "count": 300}, {"date": "2019-11-26", "count": 400}, {"date": "2020-02-04", "count": 500}, {"date": "2020-03-26", "count": 600}, {"date": "2020-05-20", "count": 700}, {"date": "2020-07-13", "count": 800}, {"date": "2020-09-01", "count": 900}, {"date": "2020-12-08", "count": 1000}, {"date": "2021-03-14", "count": 1100}, {"date": "2021-06-22", "count": 1200}, {"date": "2021-09-07", "count": 1300}, {"date": "2021-12-12", "count": 1400}, {"date": "2022-06-02", "count": 1500}, {"date": "2023-01-25", "count": 1600}, {"date": "2024-01-04", "count": 1700}, {"date": "2024-07-24", "count": 1732}, {"date": "2024-09-08", "count": 1733}], "logoUrl": "https://avatars.githubusercontent.com/u/51827949?v=4"}, {"name": "deepset-ai/haystack", "starHistory": [{"date": "2019-11-14", "count": 0}, {"date": "2020-03-23", "count": 100}, {"date": "2020-08-03", "count": 600}, {"date": "2020-12-21", "count": 1100}, {"date": "2021-04-22", "count": 1600}, {"date": "2021-08-14", "count": 2100}, {"date": "2021-11-28", "count": 2600}, {"date": "2021-12-13", "count": 3100}, {"date": "2022-01-21", "count": 3600}, {"date": "2022-03-09", "count": 4100}, {"date": "2022-06-06", "count": 4600}, {"date": "2022-09-06", "count": 5100}, {"date": "2022-10-08", "count": 5600}, {"date": "2023-01-02", "count": 6100}, {"date": "2023-02-14", "count": 6600}, {"date": "2023-03-13", "count": 7100}, {"date": "2023-04-04", "count": 7600}, {"date": "2023-04-23", "count": 8100}, {"date": "2023-05-19", "count": 8600}, {"date": "2023-07-02", "count": 9100}, {"date": "2023-07-15", "count": 9600}, {"date": "2023-08-09", "count": 10100}, {"date": "2023-09-24", "count": 10600}, {"date": "2023-10-25", "count": 11100}, {"date": "2023-12-03", "count": 11600}, {"date": "2024-01-10", "count": 12100}, {"date": "2024-02-22", "count": 12600}, {"date": "2024-03-25", "count": 13100}, {"date": "2024-05-02", "count": 13600}, {"date": "2024-06-06", "count": 14100}, {"date": "2024-07-15", "count": 14600}, {"date": "2024-08-14", "count": 15100}, {"date": "2024-08-25", "count": 15600}, {"date": "2024-08-31", "count": 16100}, {"date": "2024-09-08", "count": 16577}, {"date": "2024-09-08", "count": 16577}], "logoUrl": "https://avatars.githubusercontent.com/u/51827949?v=4"}, {"name": "zaibacu/rita-dsl", "starHistory": [{"date": "2019-07-06", "count": 0}, {"date": "2024-05-31", "count": 64}, {"date": "2024-09-08", "count": 65}], "logoUrl": "https://avatars.githubusercontent.com/u/606346?v=4"}, {"name": "huggingface/transformers", "starHistory": [{"date": "2018-10-29", "count": 0}, {"date": "2018-11-05", "count": 100}, {"date": "2018-11-22", "count": 1400}, {"date": "2019-02-03", "count": 2700}, {"date": "2019-03-14", "count": 4000}, {"date": "2019-05-10", "count": 5300}, {"date": "2019-06-30", "count": 6600}, {"date": "2019-07-18", "count": 7900}, {"date": "2019-08-04", "count": 9200}, {"date": "2019-09-03", "count": 10500}, {"date": "2019-09-22", "count": 11800}, {"date": "2019-10-02", "count": 13100}, {"date": "2019-10-26", "count": 14400}, {"date": "2019-11-18", "count": 15700}, {"date": "2019-12-11", "count": 17000}, {"date": "2020-01-02", "count": 18300}, {"date": "2020-01-28", "count": 19600}, {"date": "2020-02-27", "count": 20900}, {"date": "2020-03-25", "count": 22200}, {"date": "2020-04-20", "count": 23500}, {"date": "2020-05-15", "count": 24800}, {"date": "2020-06-02", "count": 26100}, {"date": "2020-06-22", "count": 27400}, {"date": "2020-07-16", "count": 28700}, {"date": "2020-08-10", "count": 30000}, {"date": "2020-09-09", "count": 31300}, {"date": "2020-10-10", "count": 32600}, {"date": "2020-11-04", "count": 33900}, {"date": "2020-12-01", "count": 35200}, {"date": "2021-01-01", "count": 36500}, {"date": "2021-01-28", "count": 37800}, {"date": "2021-02-26", "count": 39100}, {"date": "2024-09-08", "count": 131720}], "logoUrl": "https://avatars.githubusercontent.com/u/25720743?v=4"}, {"name": "huggingface/tokenizers", "starHistory": [{"date": "2019-11-01", "count": 0}, {"date": "2020-01-11", "count": 100}, {"date": "2020-01-13", "count": 300}, {"date": "2020-01-13", "count": 500}, {"date": "2020-01-14", "count": 700}, {"date": "2020-01-14", "count": 900}, {"date": "2020-01-14", "count": 1100}, {"date": "2020-01-15", "count": 1300}, {"date": "2020-01-17", "count": 1500}, {"date": "2020-01-23", "count": 1700}, {"date": "2020-02-09", "count": 1900}, {"date": "2020-02-24", "count": 2100}, {"date": "2020-03-17", "count": 2300}, {"date": "2020-04-17", "count": 2500}, {"date": "2020-05-16", "count": 2700}, {"date": "2020-05-27", "count": 2900}, {"date": "2020-06-16", "count": 3100}, {"date": "2020-07-21", "count": 3300}, {"date": "2020-09-06", "count": 3500}, {"date": "2020-10-29", "count": 3700}, {"date": "2020-12-17", "count": 3900}, {"date": "2021-02-24", "count": 4100}, {"date": "2021-04-27", "count": 4300}, {"date": "2021-07-05", "count": 4500}, {"date": "2021-10-01", "count": 4700}, {"date": "2021-12-12", "count": 4900}, {"date": "2022-02-17", "count": 5100}, {"date": "2022-04-07", "count": 5300}, {"date": "2022-05-30", "count": 5500}, {"date": "2022-08-31", "count": 5700}, {"date": "2022-11-16", "count": 5900}, {"date": "2023-01-09", "count": 6100}, {"date": "2023-02-24", "count": 6300}, {"date": "2023-03-28", "count": 6500}, {"date": "2023-04-26", "count": 6700}, {"date": "2023-05-25", "count": 6900}, {"date": "2023-07-12", "count": 7100}, {"date": "2023-08-14", "count": 7300}, {"date": "2023-09-27", "count": 7500}, {"date": "2023-11-15", "count": 7700}, {"date": "2024-01-04", "count": 7900}, {"date": "2024-02-23", "count": 8100}, {"date": "2024-04-11", "count": 8300}, {"date": "2024-05-25", "count": 8500}, {"date": "2024-07-17", "count": 8700}, {"date": "2024-09-07", "count": 8875}, {"date": "2024-09-08", "count": 8875}], "logoUrl": "https://avatars.githubusercontent.com/u/25720743?v=4"}, {"name": "pytorch/fairseq", "starHistory": [{"date": "2017-08-29", "count": 0}, {"date": "2017-09-18", "count": 100}, {"date": "2018-04-17", "count": 1100}, {"date": "2018-10-20", "count": 2100}, {"date": "2019-04-02", "count": 3100}, {"date": "2019-07-30", "count": 4100}, {"date": "2019-09-23", "count": 5100}, {"date": "2019-12-28", "count": 6100}, {"date": "2020-04-28", "count": 7100}, {"date": "2020-08-05", "count": 8100}, {"date": "2020-10-22", "count": 9100}, {"date": "2020-12-14", "count": 10100}, {"date": "2021-03-28", "count": 11100}, {"date": "2021-05-25", "count": 12100}, {"date": "2021-08-31", "count": 13100}, {"date": "2021-11-28", "count": 14100}, {"date": "2022-01-26", "count": 15100}, {"date": "2022-04-12", "count": 16100}, {"date": "2022-07-06", "count": 17100}, {"date": "2022-07-22", "count": 18100}, {"date": "2022-10-23", "count": 19100}, {"date": "2023-01-08", "count": 20100}, {"date": "2023-04-04", "count": 21100}, {"date": "2023-05-22", "count": 22100}, {"date": "2023-05-23", "count": 23100}, {"date": "2023-05-24", "count": 24100}, {"date": "2023-05-27", "count": 25100}, {"date": "2023-06-21", "count": 26100}, {"date": "2023-09-16", "count": 27100}, {"date": "2024-01-02", "count": 28100}, {"date": "2024-04-25", "count": 29100}, {"date": "2024-09-04", "count": 30100}, {"date": "2024-09-08", "count": 30128}], "logoUrl": "https://avatars.githubusercontent.com/u/16943930?v=4"}, {"name": "gregversteeg/corex_topic", "starHistory": [{"date": "2015-10-16", "count": 0}, {"date": "2018-06-03", "count": 100}, {"date": "2019-07-24", "count": 200}, {"date": "2020-05-04", "count": 300}, {"date": "2020-12-15", "count": 400}, {"date": "2022-01-13", "count": 500}, {"date": "2023-06-12", "count": 600}, {"date": "2024-07-04", "count": 625}, {"date": "2024-09-08", "count": 625}], "logoUrl": "https://avatars.githubusercontent.com/u/8333703?v=4"}, {"name": "awslabs/sockeye", "starHistory": [{"date": "2017-06-08", "count": 0}, {"date": "2017-07-14", "count": 100}, {"date": "2017-09-21", "count": 200}, {"date": "2017-12-25", "count": 300}, {"date": "2018-03-15", "count": 400}, {"date": "2018-06-01", "count": 500}, {"date": "2018-10-16", "count": 600}, {"date": "2019-02-13", "count": 700}, {"date": "2019-08-20", "count": 800}, {"date": "2020-06-03", "count": 900}, {"date": "2021-10-25", "count": 1000}, {"date": "2022-09-07", "count": 1100}, {"date": "2024-03-26", "count": 1200}, {"date": "2024-08-04", "count": 1210}, {"date": "2024-09-08", "count": 1210}], "logoUrl": "https://avatars.githubusercontent.com/u/3299148?v=4"}, {"name": "xhlulu/dl-translate", "starHistory": [{"date": "2021-02-22", "count": 0}, {"date": "2021-04-03", "count": 100}, {"date": "2022-05-18", "count": 200}, {"date": "2023-06-10", "count": 300}, {"date": "2024-05-01", "count": 400}, {"date": "2024-09-07", "count": 431}, {"date": "2024-09-08", "count": 432}], "logoUrl": "https://avatars.githubusercontent.com/u/21180505?v=4"}, {"name": "obss/jury", "starHistory": [{"date": "2021-07-14", "count": 0}, {"date": "2022-07-07", "count": 100}, {"date": "2024-08-31", "count": 183}, {"date": "2024-09-08", "count": 185}], "logoUrl": "https://avatars.githubusercontent.com/u/63360722?v=4"}, {"name": "proycon/python-ucto", "starHistory": [{"date": "2014-05-21", "count": 0}, {"date": "2023-09-13", "count": 29}, {"date": "2024-09-08", "count": 29}], "logoUrl": "https://avatars.githubusercontent.com/u/75427?v=4"}]

/**
 * Sample events to be displayed on the chart.
 */
const events: Event[] = [
  {
    date: '2021-01-01',
    title: 'Major Update Released',
    description: 'Version 2.0 of the project was released with significant improvements.',
  },
  // Add more events as needed
];

/**
 * Main application component.
 * Displays an animated line chart of GitHub star counts over time
 * with highlighted top projects and event markers.
 */
const App: React.FC = () => {
  const [data, setData] = useState<Serie[]>([]);
  const [timeline, setTimeline] = useState<Date[]>([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [visibleData, setVisibleData] = useState<Serie[]>([]);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [aggregateStars, setAggregateStars] = useState<number>(0);
  const [topProjects, setTopProjects] = useState<Set<string>>(new Set());

  /**
   * Processes the project data into interpolated data points for smooth animation.
   * @returns An object containing the series data and the timeline of dates.
   */
  const processData = useCallback(() => {
    // Determine the overall date range
    const allDates = sampleData.flatMap((project) =>
      project.starHistory.map((history) => new Date(history.date))
    );
    const minDate = d3.min(allDates) || new Date();
    const maxDate = d3.max(allDates) || new Date();

    // Adjust maxDate to ensure the timeline is not empty
    const adjustedMaxDate = new Date(maxDate);
    adjustedMaxDate.setDate(adjustedMaxDate.getDate() + 1);

    // Create a regular timeline (quarterly intervals)
    const timeline: Date[] = d3.timeMonths(
      d3.timeMonth.floor(minDate),
      adjustedMaxDate
    ).filter((d) => d.getMonth() % 3 === 0); // Quarterly intervals

    // Interpolate data for each project
    const seriesData: Serie[] = sampleData.map((project) => {
      // Sort the star history by date
      const sortedHistory = project.starHistory
        .map((history) => ({
          date: new Date(history.date),
          count: history.count,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      // Create a lookup for existing data points
      const starHistoryMap = new Map(
        sortedHistory.map((d) => [d.date.getTime(), d.count])
      );

      // Interpolate data points for the timeline
      const series: { x: Date; y: number }[] = timeline.map((date) => {
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

    return { seriesData, timeline };
  }, []);

  useEffect(() => {
    const { seriesData, timeline } = processData();
    setData(seriesData);
    setTimeline(timeline);
    setVisibleData(
      seriesData.map((serie) => ({
        ...serie,
        data: [serie.data[0]].filter(Boolean),
      }))
    );
  }, [processData]);

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
      }, 500); // Adjusted interval for smoother animation
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, timeline, data]);

  /**
   * Updates the visible data for the current time index.
   * @param timeIndex The index of the current time point in the timeline.
   */
  const updateVisibleData = (timeIndex: number) => {
    const currentTime = timeline[timeIndex];

    // Update visible data up to the current time
    const newVisibleData = data.map((serie) => {
      const filteredData = serie.data.filter((d: CustomDatum) => {
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
        id: String(serie.id), // Convert id to string
        count: typeof lastPoint?.y === 'number' ? lastPoint.y : 0
      };
    });

    latestCounts.sort((a, b) => b.count - a.count);
    const topFive = new Set(latestCounts.slice(0, 5).map((item) => item.id));
    setTopProjects(topFive);

    // Update current events
    const currentTimeStr = currentTime.toISOString().split('T')[0];
    const currentTimeEvents = events.filter((event) => event.date === currentTimeStr);
    setCurrentEvents(currentTimeEvents);
  };

  /**
   * Handles play and pause functionality.
   */
  const handlePlayPause = () => {
    if (!isPlaying) {
      // Start animation
      if (timeline.length === 0) {
        // Timeline is not ready yet
        return;
      }
      if (currentTimeIndex >= timeline.length - 1) {
        // If at the end, reset
        setCurrentTimeIndex(0);
        updateVisibleData(0);
      }
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Resets the animation to the beginning.
   */
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeIndex(0);
    updateVisibleData(0);
  };

  return (
    <div
      className="app-container"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '2rem',
      }}
    >
      <Card raised style={{ width: '90%', maxWidth: '1200px' }}>
        <CardHeader title="GitHub Projects Timeline" />
        <CardContent>
          <div style={{ height: '600px', width: '100%' }}>
            <ResponsiveLine
              data={visibleData}
              margin={{ top: 50, right: 150, bottom: 80, left: 80 }}
              xScale={{ type: 'time', useUTC: false, format: '%Y-%m-%d', precision: 'day' }}
              xFormat="time:%Y-%m-%d"
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                format: '%b %Y',
                tickValues: 'every 3 months',
                tickRotation: -45,
                legend: 'Date',
                legendOffset: 46,
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
              pointSize={4}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'color' }}
              pointLabelYOffset={-12}
              useMesh={true}
              enableSlices={false}
              animate={true}
              motionConfig="default"
              colors={(serie) =>
                topProjects.has(serie.id as string) ? serie.color : '#ccc'
              }
              legends={[
                {
                  anchor: 'top-right',
                  direction: 'column',
                  justify: false,
                  translateX: 140,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  data: visibleData
                    .filter((serie) => topProjects.has(serie.id as string))
                    .map((serie) => ({
                      id: serie.id,
                      label: serie.id,
                      color: serie.color,
                    })),
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
              theme={{
                background: '#ffffff',
                text: {
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
                    text: {
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
                tooltip: {
                  container: {
                    fontSize: '13px',
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
                'legends',
                // Custom layer for event markers
                (props) => (
                  <EventMarkersLayer {...props} events={events} timeline={timeline} />
                ),
              ]}
            />
          </div>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Typography variant="h6">
                Date: {timeline[currentTimeIndex]?.toISOString().split('T')[0]}
              </Typography>
              <Typography variant="h6">
                Total Stars: {aggregateStars.toLocaleString()}
              </Typography>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlayPause}
                startIcon={isPlaying ? <Pause /> : <PlayArrow />}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleReset}
                startIcon={<Refresh />}
                style={{ marginLeft: '1rem' }}
              >
                Reset
              </Button>
            </div>
          </div>
          {currentEvents.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <Typography variant="h5">Events:</Typography>
              {currentEvents.map((event, index) => (
                <Card key={index} style={{ marginTop: '1rem' }}>
                  <CardContent>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body1">{event.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Custom layer to render event markers on the chart.
 * @param props Nivo chart properties and custom event data
 */
const EventMarkersLayer: React.FC<{
  xScale: (value: any) => number;
  yScale: (value: any) => number;
  innerHeight: number;
  events: Event[];
  timeline: Date[];
}> = ({ xScale, innerHeight, events }) => {
  const eventDates = new Set(events.map((event) => event.date));

  const markers = Array.from(eventDates).map((dateStr) => {
    const date = new Date(dateStr);
    const x = xScale(date);

    return (
      <line
        key={dateStr}
        x1={x}
        x2={x}
        y1={0}
        y2={innerHeight}
        stroke="rgba(255,0,0,0.5)"
        strokeWidth={2}
        strokeDasharray="6 6"
      />
    );
  });

  return <g>{markers}</g>;
};

export default App;
