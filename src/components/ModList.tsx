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
import { memo } from "react";

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

const BackgroundEle = memo(({ preview }) => (<div className="bg">
    <img src={preview} alt="" srcset="" />
</div>));

const GUTTER_SIZE = 30;

const Mod = (props: { mod: GBMod, onClick?: any, expanded?: boolean, modFolder: string, isInstalled: boolean, style?: any }) => {
    const preview = props.mod._aPreviewMedia._aImages[0]._sBaseUrl + "/" + props.mod._aPreviewMedia._aImages[0]._sFile530;

    const [downloadingState, setDownloadingState] = useState(props.isInstalled ? DownloadState.Downloaded : DownloadState.NotDownloaded);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const { style } = props;

    return (
        <Fragment>
            <div onClick={props.onClick} class={`mod ${props.expanded && 'expanded'}`} style={{
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
                        const detail = await getModDetail(props.mod._idRow);
                        callRemote("download_mod", detail._aFiles![0]._sDownloadUrl, props.modFolder + "/" + detail._aFiles![0]._sFile,
                            (progress: number) => {
                                setDownloadProgress(progress);
                                setDownloadingState(DownloadState.Downloading);

                                if (progress === 100) setDownloadingState(DownloadState.Downloaded);
                            });
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
                    <div className="name">{props.mod._sName}</div>
                    <div className="author">{props.mod._aSubmitter._sName}</div>
                    <div className="other">{props.mod._nLikeCount} 🥰&nbsp;Ⅰ&nbsp;{processViewNum(props.mod._nViewCount)} 👀</div>
                </div>
            </div>
        </Fragment>
    );
}
const Row = ({ index, style }) => (
    <div style={style}>Row {index}</div>
);

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

    const [installedModIDs, setInstalledModIDs] = useState<string[]>([]);

    useMemo(() => {
        callRemote('get_installed_mod_ids', props.modFolder, (ids: string) => {
            setInstalledModIDs(ids.split("\n"));
        });
    }, [props.modFolder]);

    useEffect(() => {
        setLoading(false);
    }, [props.mods]);

    return (
        <div>
            <FixedSizeGrid innerRef={refGrid} onScroll={onScroll} height={470} width={800} rowCount={props.mods.length / 2} columnCount={2} rowHeight={230} columnWidth={350}
                itemData={props.mods}>{({ style, data, rowIndex, columnIndex }) => {
                    const mod = data[rowIndex * 2 + columnIndex];
                    return <div>
                        <Mod mod={mod} style={style} modFolder={props.modFolder}
                            isInstalled={installedModIDs.includes(mod._idRow.toString())} onClick={() => {

                            }} />
                    </div> as any;
                }}</FixedSizeGrid>

            {loading && <div class="loader" style={{
                position: "fixed",
                bottom: 0,
                height: 24
            }}>
                <div class="bar"></div>
            </div>}
        </div>
    );
}

