import { Fragment, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { ModList } from "../components/ModList";
import { GBMod, getMods, CategoryEnum } from "../gamebanana";
import { useGamePath } from "../states";
import "./Search.module.scss"

export const Search = () => {
    const [gbMods, setGBMods] = useState<GBMod[]>([]);
    const selectedPath = useGamePath(v => v.gamePath);
    useEffect(() => {
        getMods(1, {
            category: CategoryEnum.Maps
        }).then(setGBMods);
    }, []);
    return <Fragment>
        <div className="filter">
            <input type="text" className="searchinput" />
            <select value={"Maps"}>
                <option value="Maps">地图</option>
            </select>
        </div>
        <ModList mods={gbMods} onLoadMore={() => {
            console.log("Loading...");
            getMods(Math.floor(gbMods.length / 20) + 1, {
                category: CategoryEnum.Maps
            }).then(m => setGBMods([...gbMods, ...m]));
        }} modFolder={selectedPath + "/Mods"} />
    </Fragment>;
};
