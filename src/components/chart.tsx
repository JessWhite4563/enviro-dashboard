import React, { useEffect, useState } from "react";
import type {sensorData, sensorPing} from "../App.tsx";
import moment from "moment";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./chart.css";

interface ChartProps {
    data: sensorData | undefined;
}
const Chart = (props: ChartProps) => {
    const [chartData, setChartData] = useState<React.JSX.Element | undefined>(undefined);

    const filterData = (data: sensorData) => {
        let filtered: sensorPing[] = [];
        if (data) {
            filtered = data.pings.filter((ping :sensorPing, index: number) => {
                return !(index % 12);
            }).map((ping) => {
                const m = moment(ping.datetime).minutes();
                const ms = m > 9 ? m : `0${m}`;
                const h = moment(ping.datetime).hours();
                const hs = h > 9 ? h : `0${h}`;
                ping.displayTime = `${hs}:${ms}`;
                return ping;
            }).reverse();
        }
        return filtered;
    }

    const generateChart = (chartData: sensorPing[]) => {
      return  (<LineChart
          style={{ width: '100%', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
          responsive
          data={chartData}
          margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
          }}

      >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
          <XAxis dataKey="displayTime" stroke="var(--color-text-3)" />
          <YAxis width="auto" stroke="var(--color-text-3)" />
          <Tooltip
              cursor={{
                  stroke: 'var(--color-border-2)',
              }}
              contentStyle={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border-2)',
              }}
          />
          <Legend />
          <Line
              dataKey="temperature"
              stroke="red"
              activeDot={false}
          />
          <Line
              dataKey="humidity"
              stroke="blue"
              activeDot={false}
          />
      </LineChart>)
    };
    useEffect(() => {
        if (props.data){
            const filtered = filterData((props.data));
            const chartData = generateChart(filtered);
            setChartData(chartData);
        }

    }, [props.data])
    return (
        (props.data ? <div className={'chartContainer'}>
                <div className={'header'}>24hr Record for {props.data.name}</div>
                <div className={'chartBody'}>
                    {chartData}
                </div>
            </div>:
            <div className={'chartNoData'}></div>)
    );
}
export default Chart;