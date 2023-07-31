import { create } from 'zustand'

export const useGamePath = create<{
    gamePath: string,
    setGamePath: (gamePath: string) => void
}>((set) => ({
    gamePath: "",
    setGamePath: (gamePath: string) => set({ gamePath })
}));

export const useDownloadSettings = create<{
    useCNMirror: boolean,
    setUseCNMirror: (useCNMirror: boolean) => void
}>((set) => ({
    useCNMirror: true,
    setUseCNMirror: (useCNMirror: boolean) => set({ useCNMirror })
}));