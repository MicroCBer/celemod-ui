import { Fragment, h } from "preact";
import "./ModList.module.scss"
import { GBMod, getModDetail } from "../gamebanana";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { GameSelector } from "./GameSelector";
import { callRemote } from "../utils";

import { FixedSizeGrid, FixedSizeList } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import { memo } from 'preact/compat';
import { useDownloadSettings } from "../states";

const processViewNum = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + "k";
    if (num < 1000000000) return (num / 1000000).toFixed(1) + "m";
    return (num / 1000000000).toFixed(1) + "b";
}

const enum DownloadState {
    NotDownloaded,
    Preparing,
    Downloading,
    Downloaded
}

const BackgroundEle = memo(({ preview }: { preview: string }) => (<div className="bg">
    <img src={preview} alt="" srcset="" />
</div>));

const GUTTER_SIZE = 10;

export interface ModInfo {
    name: string;
    downloadUrl: () => Promise<string>;
    previewUrl: string;
    author: string;
    other: string;
}

export const Mod = (props: { mod: ModInfo, onClick?: any, expanded?: boolean, modFolder: string, isInstalled: boolean, style?: any }) => {
    const { mod } = props;
    const preview = mod.previewUrl;

    const [downloadingState, setDownloadingState] = useState(props.isInstalled ? DownloadState.Downloaded : DownloadState.NotDownloaded);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const { style } = props;

    const useChinaMirror = useDownloadSettings(p => p.useCNMirror as boolean);

    return (
        <Fragment>
            <div onClick={props.onClick} class={`mod ${props.expanded && 'expanded'}`} style={style && {
                ...style,
                left: style.left + GUTTER_SIZE,
                top: style.top + GUTTER_SIZE,
                width: style.width - GUTTER_SIZE,
                height: style.height - GUTTER_SIZE
            }}>

                <BackgroundEle preview={preview} />
                <div className="operations">
                    <Button onClick={async () => {
                        if (downloadingState !== DownloadState.NotDownloaded) return;
                        setDownloadingState(DownloadState.Preparing);
                        console.log(useChinaMirror)
                        callRemote("download_mod",
                            await mod.downloadUrl(),
                            props.modFolder + "/" + mod.name + ".zip",
                            (progress: number) => {
                                setDownloadProgress(progress);
                                setDownloadingState(DownloadState.Downloading);

                                if (progress === 100) setDownloadingState(DownloadState.Downloaded);
                            }, useChinaMirror);
                    }}>
                        {
                            downloadingState === DownloadState.NotDownloaded ? <Icon name="download" /> :
                                downloadingState === DownloadState.Preparing ? <Icon name="clock" /> :
                                    downloadingState === DownloadState.Downloading ? downloadProgress :
                                        downloadingState === DownloadState.Downloaded ? <Icon name="i-tick" /> : ""
                        }
                    </Button>
                </div>

                <div className="info">
                    <div className="name">{mod.name}</div>
                    <div className="author">{mod.author}</div>
                    <div className="other">{mod.other}</div>
                </div>
            </div>
        </Fragment>
    );
}
export const ModList = (props: { mods: GBMod[], onLoadMore?: any, modFolder: string }) => {
    const [loading, setLoading] = useState(true);

    const refGrid = useRef(null);
    const onScroll = (e: UIEvent) => {
        // @ts-ignore

        const dif = Window.this.box()[3] - refGrid.current?.getBoundingClientRect().bottom;
        if (dif > -20 && !loading) {
            setLoading(true);
            props.onLoadMore?.();
        }
    }

    const useChinaMirror = useDownloadSettings(p => p.useCNMirror as boolean);

    const [installedModIDs, setInstalledModIDs] = useState<string[] | null>(null);

    useMemo(() => {
        callRemote('get_installed_mod_ids', props.modFolder, (ids: string) => {
            setInstalledModIDs(ids.split("\n"));
        });
    }, [props.modFolder]);

    useEffect(() => {
        setLoading(false);
    }, [props.mods]);

    if (installedModIDs === null) return <div class="loader" style={{
        position: "fixed",
        bottom: 200,
        height: 24,
        left: 200,
        right: 200
    }}>
        <div class="bar"></div>
    </div>;

    return (
        <div>
            <FixedSizeGrid innerRef={refGrid} onScroll={onScroll as any} height={470} width={699} rowCount={props.mods.length / 2} columnCount={2} rowHeight={230} columnWidth={350}
                itemData={props.mods}>{({ style, data, rowIndex, columnIndex }) => {
                    const mod = data[rowIndex * 2 + columnIndex];

                    const modParsed: ModInfo = {
                        name: mod._sName,
                        downloadUrl: async () => {
                            const detail = await getModDetail(mod._idRow);
                            return useChinaMirror ? `https://celeste.weg.fan/api/v2/download/gamebanana-files/${detail._aFiles![0]._idRow}` :
                                detail._aFiles![0]._sDownloadUrl;
                        },
                        previewUrl: mod._aPreviewMedia._aImages[0]._sBaseUrl + "/" + mod._aPreviewMedia._aImages[0]._sFile530,
                        author: mod._aSubmitter._sName,
                        other: mod._nLikeCount + " 🥰 Ⅰ " + processViewNum(mod._nViewCount) + " 👀",
                    }

                    return <div>
                        <Mod mod={modParsed} style={style} modFolder={props.modFolder}
                            isInstalled={installedModIDs.includes(mod._idRow.toString())} />
                    </div> as any;
                }}</FixedSizeGrid>

            {loading && <div class="loader" style={{
                position: "fixed",
                bottom: 0,
                height: 24,
                zIndex: 999
            }}>
                <div class="bar"></div>
            </div>}
        </div>
    );
}

