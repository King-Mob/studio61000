import { EventTimeline } from "./types";
import { getStorageEvents, redactEvent } from "./matrixClientRequests";

export const findStoredItems = async (need: string) => {
    const storageResponse = await getStorageEvents();
    const storedItems = await storageResponse.json() as EventTimeline;

    const results = [];

    for (const item of storedItems.chunk) {
        if (item.type === "studio61000.member.profile") {
            if (item.content.bio && item.content.bio.includes(need)) {
                results.push(item.content);
            }
        }
    }

    return results;
}

export const removePreviousRegistrations = async (number: string) => {
    const storageResponse = await getStorageEvents();
    const storedItems = await storageResponse.json() as EventTimeline;

    const redactions = [];

    for (const item of storedItems.chunk) {
        if (item.type === "studio61000.member.profile") {
            if (item.content.number && item.content.number === number) {
                const redaction = redactEvent(item.event_id, "duplicate registration");
                redactions.push(redaction);
            }
        }
    }

    for (const redaction of redactions) {
        await redaction;
    }

    return;
}