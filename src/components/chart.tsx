import React, { useEffect, useState } from "react";
import type {sensorData, sensorPing} from "../App.tsx";
import moment from "moment";
import { ResponsiveLine, ResponsiveLineCanvas } from '@nivo/line'

import "./chart.css";

interface ChartDataBlock {
    x: string;
    y: number;
}

interface ChartDataSet {
    id: string;
    data: ChartDataBlock[];
}

interface ChartProps {
    inputData: sensorData | undefined;
}
const Chart = (props: ChartProps) => {
    const [chartData, setChartData] = useState<React.JSX.Element | undefined>(undefined);

    const filterData = (data: sensorData) => {
        const dataSets: ChartDataSet[] = [];
        if (data) {
            const temperature: ChartDataBlock[] = [];
            const humidity: ChartDataBlock[] = [];

            data.pings.filter((_ping :sensorPing, index: number) => {
                return !(index % 12);
            }).reverse().map((ping: sensorPing) => {
                const dt = moment.utc(ping.datetime);
                const ts = dt.local().format('HH:mm');
                temperature.push({x: ts, y: ping.temperature});
                humidity.push({x: ts, y: ping.humidity});
            });

            dataSets.push({id: 'temperature', data: temperature});
            dataSets.push({id: 'humidity', data: humidity});
        }
        return dataSets;
    }

    const generateChart = (chartDataSet: ChartDataSet[]) => {
      return (<ResponsiveLine /* or Line for fixed dimensions */
              data={chartDataSet}
              margin={{ top: 50, right: 140, bottom: 50, left: 60 }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
              axisBottom={{ legend: 'Time', legendOffset: 36, tickValues:[] }}
              pointSize={2}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'seriesColor' }}
              pointLabelYOffset={-12}
              enableTouchCrosshair={true}
              useMesh={true}
              legends={[
                  {
                      anchor: 'bottom-right',
                      direction: 'column',
                      translateX: 100,
                      itemWidth: 80,
                      itemHeight: 22,
                      symbolShape: 'circle'
                  }
              ]}
          />);
    };
    useEffect(() => {
        if (props.inputData){
            const filtered = filterData((props.inputData));
            const chartData = generateChart(filtered);
            setChartData(chartData);
        }

    }, [props.inputData])
    return (
        (props.inputData ? <div className={'chartContainer'}>
                <div className={'header'}>24hr Record for {props.inputData.name}</div>
                <div className={'chartBody'}>
                    {chartData}
                </div>
            </div>:
            <div className={'chartNoData'}></div>)
    );
}
export default Chart;