import { useEffect, useState } from "react";
import Latest from "./components/latest.tsx";
import "./styles.css";
import Chart from "./components/chart.tsx";

interface sensorPing {
    temperature: number;
    humidity: number;
    pressure: number;
    datetime: string;
}
export interface sensorData {
    name: string;
    pings: sensorPing[];
}

export const App = () => {
    const [data, setData] = useState<sensorData[] | undefined>(undefined);
    const [selectedSensor, setSelectedSensor] = useState<sensorData | undefined>(undefined);

    const handleSensorSelected = (name: string) => {
        console.log(name);
        if (data) setSelectedSensor(data.find((sensor) => sensor.name === name));
    }

    useEffect(() => {
        fetch('http://192.168.1.58:3000/get-sensors/')
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    return (
        <div className={'mainContainer'}>
            {data && <Latest data={data} handleSensorSelect={handleSensorSelected} />}
            {<Chart data={selectedSensor} />}
        </div>
    )
}