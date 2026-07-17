import { useEffect, useState, useRef} from "react";
import Latest from "./components/latest.tsx";
import "./styles.css";
import Chart from "./components/chart.tsx";

export interface sensorPing {
    temperature: number;
    humidity: number;
    pressure: number;
    datetime: string;
    displayTime?: string;
}
export interface sensorData {
    name: string;
    pings: sensorPing[];
}

export const App = () => {
    const [data, setData] = useState<sensorData[] | undefined>(undefined);
    const [selectedSensor, setSelectedSensor] = useState<sensorData | undefined>(undefined);

    const handleSensorSelected = (name: string) => {
        if (data) setSelectedSensor(data.find((sensor) => sensor.name === name));
    }

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFetching = useRef(false); // Track in-progress requests

    const fetchData = async () => {
        if (isFetching.current) return; // ✅ Abort if a request is already running
        isFetching.current = true; // Mark request as in-progress
        setLoading(true);

        try {
            const response = await fetch('http://192.168.1.58:3000/get-sensors/');
            if (!response.ok) throw new Error('Failed to fetch data');
            const newData = await response.json();
            setData(newData); // Update state
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
            isFetching.current = false; // Reset flag when done
        }
    };

    useEffect(() => {
        // ✅ Wrap async logic in a synchronous function
        const fetchDataInterval = () => {
            fetchData().catch((err) => {
                console.error('API call failed:', err); // Handle errors explicitly
            });
        };

        // Start interval: run fetchDataInterval every 60 seconds
        const intervalId = setInterval(fetchDataInterval, 30000);

        // Fetch data immediately on mount
        fetchDataInterval();

        // ✅ Cleanup: Clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty deps: interval is set once on mount

    return (
        <div className={'mainContainer'}>
            {data && <Latest data={data} handleSensorSelect={handleSensorSelected} />}
            {<Chart data={selectedSensor} />}
        </div>
    )
}