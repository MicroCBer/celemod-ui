import { h } from "preact"

export const Icon = ({ name }: { name: string }) => {
    return <div dangerouslySetInnerHTML={{__html:`<icon|${name} />`}} />
}