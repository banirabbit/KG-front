import { useSelector } from "react-redux"
import { AppState } from "../../store"
import "./index.css"
export default function RightTopStatistic() {
    const {length, selectedNodes, total} = useSelector((state:AppState) => state.GraphData);
    return (
        <div className="RightTop">
            <ul>
                <li>
                    <div>{length === undefined ? 0 : length}:{total === undefined ? 0 : total}</div>
                    <div>Nodes</div>
                </li>
                <li>
                    <div>{selectedNodes === undefined ? 0 :selectedNodes}</div>
                    <div>Selected Nodes</div>
                </li>
            </ul>
        </div>
    ) 
}