import { profile } from "./types";
import { sendMessage, storeItem, getProfile } from "./matrixClientRequests";
import { findStoredItems, removePreviousRegistrations } from "./storage";

const hello = async (sender: string, roomId: string) => {
    const profileResponse = await getProfile(sender);
    const { displayname } = await profileResponse.json() as profile;

    const name = displayname.split(" (WhatsApp)")[0];

    sendMessage(roomId, `🤖Studio61000🤖: hello ${name}, it's nice to meet you`);
}

const help = async (roomId: string) => {
    const helpMessages = [
        "I'm a bot that suggests members of studio61 who might be able to help with a query.",
        "Send 'Studio61000 please find your-query-here' for me to look in my list of members.",
        "Send 'Studio61000 please register me your-bio-here' for me to add you to my list of members."
    ];

    sendMessage(roomId, `🤖Studio61000🤖: ${helpMessages.join("\n- ")}`);
}

const register = async (sender: string, message: string, roomId: string) => {
    const number = sender.split("@whatsapp_")[1].split(":")[0];

    const profileResponsePromise = getProfile(sender);

    await removePreviousRegistrations(number);
    const profileResponse = await profileResponsePromise;

    const { displayname } = await profileResponse.json() as profile;

    const bio = message.split("studio61000 please register me")[1];

    const profile = {
        type: "studio61000.member.profile",
        name: displayname.split("(WhatsApp)")[0],
        number,
        bio
    }

    storeItem(profile);
    sendMessage(roomId, `🤖Studio61000🤖: I have registered ${bio.replaceAll(" i ", " you ").trim()}`);
}

const search = async (message: string, roomId: string) => {
    const need = message.split("studio61000 please find ")[1];

    const results = await findStoredItems(need);

    if (results.length === 0) {
        sendMessage(roomId, `🤖Studio61000🤖: I'm sorry, I couldn't find anyone to help with ${need}`);
        return;
    }
    if (results.length === 1) {
        sendMessage(roomId, `🤖Studio61000🤖: here's someone who might be able to help: ${results[0].name} - +${results[0].number}`);
        return;
    }
    if (results.length > 1) {
        sendMessage(roomId, `🤖Studio61000🤖: here are some people who might be able to help: ${results.map(profile => `${profile.name} - +${profile.number}`).join(", ")}`);
        return;
    }
}

const handleMessage = async (event) => {
    const message = event.event.content.body.toLowerCase();
    const { sender, room_id } = event.event;

    if (message.includes("studio61000 hello")) {
        hello(sender, room_id);
    }

    if (message.includes("studio61000 help")) {
        help(room_id);
    }

    if (message.includes("studio61000 please register me")) {
        register(sender, message, room_id);
    }

    if (message.includes("studio61000 please find")) {
        search(message, room_id);
    }
}

export default handleMessage;