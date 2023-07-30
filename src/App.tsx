import { Fragment, h } from "preact";
import { Button, ModList } from "./components/all"
import { CategoryEnum, GBMod, getMods } from "./gamebanana";
import { useEffect, useMemo, useState } from "preact/hooks";
import { GameSelector } from "./components/all";
import { callRemote } from "./utils";


export default () => {
    const [gbMods, setGBMods] = useState<GBMod[]>([]);
    const gamePaths = useMemo(() => callRemote("get_celeste_dirs").split("\n").filter((v: string | null)=>v), [])

    const [selectedPath, setSelectedPath] = useState(gamePaths[0]);

    useEffect(() => {
        getMods(1, {
            category: CategoryEnum.Maps
        }).then(setGBMods);
    }, []);

    return (
        <Fragment>
            <GameSelector paths={gamePaths} onSelect={(e:InputEvent)=>{
                // @ts-ignore
                e.target.value && setSelectedPath(e.target.value);
            }} />
            <h1>Maps</h1>
            <ModList mods={gbMods} onLoadMore={
                () => {
                    console.log("Loading...");
                    getMods(Math.floor(gbMods.length / 20) + 1, {
                        category: CategoryEnum.Maps
                    }).then(m => setGBMods([...gbMods, ...m]))
                }
            } modFolder={selectedPath+"/Mods"} />
        </Fragment>
    );
}