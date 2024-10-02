import { profile, EventTimeline } from "./types";
import { sendMessage, storeItem, getProfile, getStorageEvents } from "./matrixClientRequests";

const hello = async (sender: string, roomId: string) => {
    const profileResponse = await getProfile(sender);
    const { displayname } = await profileResponse.json() as profile;

    const name = displayname.split(" (WhatsApp)")[0];

    sendMessage(roomId, `🤖Studio61000🤖: hello ${name}, it's nice to meet you`);
}

const register = async (sender: string, message: string, roomId: string) => {
    const profileResponse = await getProfile(sender);
    const { displayname } = await profileResponse.json() as profile;

    const bio = message.split("studio61000 please register me ")[1];

    const profile = {
        type: "studio61000.member.profile",
        name: displayname.split("(WhatsApp)")[0],
        number: sender.split("@whatsapp_")[1].split(":")[0],
        bio
    }

    storeItem(profile);
    sendMessage(roomId, `🤖Studio61000🤖: I have registered that ${bio.replaceAll("i", "you")}`);
}

const search = async (message: string, roomId: string) => {
    const need = message.split("studio61000 please find ")[1];

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

    if (results.length === 0) {
        sendMessage(roomId, `🤖Studio61000🤖: I'm sorry, I couldn't find anyone to help with ${need}`);
        return;
    }
    if (results.length === 1) {
        sendMessage(roomId, `🤖Studio61000🤖: here's someone who might be able to help: ${results[0].name} - ${results[0].number}`);
        return;
    }
    if (results.length > 1) {
        sendMessage(roomId, `🤖Studio61000🤖: here are some people who might be able to help: ${results.map(profile => profile.name + " - " + profile.number).join(", ")}`);
        return;
    }
}

const handleMessage = async (event) => {
    const message = event.event.content.body.toLowerCase();
    const { sender, room_id } = event.event;

    if (message.includes("studio61000 hello")) {
        hello(sender, room_id);
    }

    if (message.includes("studio61000 please register me")) {
        register(sender, message, room_id);
    }

    if (message.includes("studio61000 please find")) {
        search(message, room_id);
    }
}

export default handleMessage;