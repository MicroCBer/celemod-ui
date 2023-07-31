import { h } from "preact";
import { Icon } from "./Icon";
import "./GameSelector.module.scss"
import { callRemote } from "../utils";

export const GameSelector = (props: { paths: string[], onSelect: any, selectedPath?: string }) => {
    if (!props.paths.length) return <div>No games found</div>;

    return (
        <div class="gameSelector">
            <div className="title">
                <Icon name="save" />
                <span>选择游戏路径</span>
            </div>
            <select onChange={props.onSelect} value={props.selectedPath || props.paths[0]}>
                {props.paths.map(p => <option value={p}>{p}</option>)}
            </select>

            <button style={{marginLeft:5, borderRadius: 4}} onClick={()=>{
                callRemote("start_game", props.selectedPath || props.paths[0]);
            }}>启动</button>
        </div>
    );
}