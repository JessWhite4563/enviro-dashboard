import {useState, useEffect} from 'react';
import type {sensorData} from "../App.tsx";
import {calculateDifference} from "../utils/time-display.ts";
import "./latest.css";


interface LatestProps {
    data: sensorData[];
    handleSensorSelect: (sensorName: string) => void;
}

const Latest = (props: LatestProps) => {

    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const line = (lineData: sensorData) => {
        const lastPoll = lineData.pings.length > 0 ? lineData.pings[0] : null;
        return (
            <div className="lineContainer" key={lineData.name}>
                <span className={'lineHeader'} onClick={()=>{
                    props.handleSensorSelect(lineData.name);
                }}>{lineData.name}</span>
                { lastPoll ?
                    <div>
                        <div className={'line'}>
                            <span className={'lineTitle'}>Temperature :</span>
                            <span className={'lineContent'}>{lastPoll.temperature} c</span>
                        </div>
                        <div className={'line'}>
                            <span className={'lineTitle'}>Humidity :</span>
                            <span className={'lineContent'}>{lastPoll.humidity} %</span>
                        </div>
                        <div className={'line'}>
                            <span className={'lineTitle'}>Pressure :</span>
                            <span className={'lineContent'}>{lastPoll.pressure} hpa</span>
                        </div>
                        <div className={'line'}>
                            <span className={'lineTitle'}>Last Updated :</span>
                            <span className={'lineContent'}>{calculateDifference(lastPoll.datetime)}</span>
                        </div>
                    </div> :
                    <div>none</div>}
            </div>
        );
    }
    const children = props.data.map((sensorData: sensorData) => line(sensorData))

    return (
        <div className={'latestContainer'}>
            <div className={'header'}>Latest Polls</div>
            <div className={'latestChildren'}>{children}</div>
        </div>
    );

}

export default Latest;