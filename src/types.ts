import { IClearEvent } from "matrix-js-sdk";

export type item = {
    type: string;
    [key: string]: any;
}

export type profile = {
    displayname: string;
}

export type EventTimeline = {
    chunk: IClearEvent[]
}