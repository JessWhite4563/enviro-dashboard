import type {sensorData} from "../App.tsx";
import "./chart.css";


interface ChartProps {
    data: sensorData | undefined;
}
const Chart = (props: ChartProps) => {
    const data = props.data;

    return (
        (data ? <div className={'chartContainer'}>
                <div className={'header'}>24hr Record for {data.name}</div></div> :
            <div className={'chartNoData'}></div>)
    );
}
export default Chart;