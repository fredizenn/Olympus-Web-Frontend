import { writable } from "svelte/store";
interface IPageActionButtons {
    label: string;
    onClick: () => void;
    icon?: string;
    iconColor?: string;
}

export const activePageHeader = writable("Dashboard")
export const pageDescription = writable("Overview and Summary")
export const pageActionButtons = writable<IPageActionButtons[]>([])