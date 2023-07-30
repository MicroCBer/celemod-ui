import { h } from "preact";

export const GameSelector = (props: {paths: string[], onSelect: any, selectedPath?: string}) => {
    if(!props.paths.length) return <div>No games found</div>;

    return (
        <select onChange={props.onSelect} value={props.selectedPath || props.paths[0]}>
            {props.paths.map(p => <option value={p}>{p}</option>)}
        </select>
    );
}