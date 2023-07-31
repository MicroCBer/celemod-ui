import { Fragment, FunctionComponent, h } from "preact";
import { useMemo, useState, useEffect } from "preact/hooks";
import { Icon } from "./components/Icon";

import { Search } from './routes/Search';
import { Home } from './routes/Home';
import { memo } from "preact/compat";
import { Manage } from "./routes/Manage";
import { Multiplayer } from "./routes/Multiplayer";


export default () => {
    const pages: {
        [key: string]: FunctionComponent
    } = {
        Search, Home, Manage, Multiplayer
    }

    const pagesEle = useMemo(() => {

    }, [pages])

    const [page, setPage] = useState("Home");

    const [pageElement, setPageElement] = useState<{
        [key: string]: Element
    }>({});

    const createPageElement = (pageName: string) => {
        if (pageElement[pageName])
            return;

        const ele = h(memo(pages[pageName]), {});
        setPageElement({
            ...pageElement,
            [pageName]: ele
        } as any);
    }

    useEffect(() => {
        createPageElement(page);
    }, [page]);

    const SidebarButton = ({ onClick, icon, name, title }: any) => {
        return (<span class={`navBtn ${name === page && "selected"}`} style={{
        }} onClick={() => {
            setPage(name);
        }}>
            <Icon name={icon} />
            <span class="title">{title || name}</span>
        </span>)
    }

    return (
        <Fragment>
            <nav className="sidebar">
                <SidebarButton icon="home" name="Home" title="主页" />
                <SidebarButton icon="search" name="Search" title="搜索" />
                <SidebarButton icon="drive" name="Local" title="管理" />
                <SidebarButton icon="web" name="Multiplayer" title="联机相关" />
            </nav>
            {Object.entries(pageElement).map(([key, value]) => {
                return <div className="page" style={{
                    display: key === page ? "block" : "none"
                }}>
                    {value}
                </div>
            })}
        </Fragment>
    );
}