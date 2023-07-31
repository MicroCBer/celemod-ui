import { h } from "preact";
import { useMemo, useState } from "preact/hooks";
import { GameSelector } from "../components/GameSelector";
import { Icon } from "../components/Icon";
import { callRemote } from "../utils";
import strawberry from "../resources/Strawberry.webp"
import { useDownloadSettings, useGamePath } from "../states";

export const Home = () => {
    const [gamePath, setGamePath] = useGamePath(v => [v.gamePath, v.setGamePath]);
    const gamePaths = useMemo(() => {
        const paths = callRemote("get_celeste_dirs").split("\n").filter((v: string | null) => v);
        setGamePath(paths[0]);
        return paths;
    }, []);
    const [useChinaMirror, setUseChinaMirror] = useDownloadSettings(v => [v.useCNMirror, v.setUseCNMirror]);
    const [counter, setCounter] = useState(0);

    return <div class="home">
        <div className="info">
            <span className="part">
                <img src={strawberry} alt="" srcset="" />
            </span>
            <span className="part">
                <div className="title">
                    CeleMod
                </div>
                <div className="subtitle">
                    A mod manager for Celeste
                </div>
            </span>
        </div>
        <br />
        <br />

        <div className="config">
            <GameSelector paths={gamePaths} onSelect={(e: InputEvent) => {
                // @ts-ignore
                setGamePath(e.target.value);
            }} />
            
        </div>


        <div className="config">
            <Icon name="download" />
            &nbsp;
            <span>下载设置</span>
        </div>

        <div className="config-block">
            <input type="checkbox" checked={useChinaMirror} name="usecnmirror" onChange={e => {
                //@ts-ignore
                const checked = e.target.checked;
                setUseChinaMirror(checked);
            }} />
            <label for="usecnmirror"> 使用中国镜像 ( @WEGFan )</label>
        </div>

        <div className="config-block">
            <input type="checkbox" checked={true} disabled/>
            <label> 使用 16 线程下载</label>
        </div>
    </div>;
};
