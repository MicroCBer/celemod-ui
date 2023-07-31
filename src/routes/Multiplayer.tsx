
import { h } from "preact";
import { useGamePath } from "../states";
import { Mod } from "../components/ModList";
import { Button } from "../components/Button";

export const Multiplayer = () => {
    const selectedPath = useGamePath(v => v.gamePath);

    return <div className="multiplayer">
        <h1><small>1</small> 安装 Mod</h1>
        <p>为了在蔚蓝群服进行联机，你需要安装以下 Mod</p>

        <Mod mod={{
            name: "Celeste.Miao.Net",
            author: "MiaoWoo",
            other: "蔚蓝群服联机 Mod",
            downloadUrl: () => Promise.reject(""),
            previewUrl: "https://images.gamebanana.com/img/Webpage/Game/Profile/Background/5b05699bd0a6b.jpg"
        }} style={undefined} modFolder={selectedPath + "/Mods"}
            isInstalled={false} />

        <h1><small>2</small> 注册账号</h1>
        <p>你需要在 Celeste 群服论坛 注册一个账号</p>
        <Button>进入注册页</Button>

        <h1><small>3</small> 登录账号</h1>
        <p>请在下方输入账号和密码，CeleMod 将自动配置群服 Mod</p>

        <h1><small>4</small> 启用联机</h1>
        <p>打开游戏后，你将需要在 Mod 设置中启用群服 Mod，见如下动图</p>

        <style dangerouslySetInnerHTML={{__html:`small{
                font-size: 15px;
                font-weight: 400;
            }`}}>
            
        </style>
    </div>
}