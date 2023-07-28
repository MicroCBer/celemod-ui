import { Fragment, h } from "preact";
import { Button } from "./components/all"

export default () => {
    return (
        <Fragment>
            <h1>Buttons</h1>
            <Button large={true} type={"primary"}>Large Primary Button</Button>
            <Button large={true}>Large Button</Button>
            <Button>Normal Button</Button>
            <Button type={"primary"}>Primary Button</Button>

        </Fragment>
    );
}