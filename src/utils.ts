export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const callRemote = (name: string, ...args: any[]) => {
    // @ts-ignore
    return Window.this.xcall(name, ...args)
}