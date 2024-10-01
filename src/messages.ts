import { sendMessage, storeItem, getProfile, getStorageEvents } from "./matrixClientRequests";

const register = async (sender: string, message: string, roomId: string) => {
    const profileResponse = await getProfile(sender);
    const { displayname } = await profileResponse.json();

    const bio = message.split("Studio61000 please register me ")[1];

    const profile = {
        type: "studio61000.member.profile",
        name: displayname.split("(WhatsApp)")[0],
        //   number: sender.split("@whatsapp_")[1].split(":")[0],
        bio
    }

    storeItem(profile);
    sendMessage(roomId, `🤖studio61000🤖: I have registered that ${bio.replaceAll("I", "you")}`);
}

const search = async (message: string, roomId: string) => {
    const need = message.split("Studio61000 please help I need a ")[1];

    const storageResponse = await getStorageEvents();
    const storedItems = await storageResponse.json();

    const results = [];

    for (const item of storedItems.chunk) {
        if (item.type === "studio61000.member.profile") {
            if (item.content.bio.includes(need)) {
                results.push(item.content);
            }
        }
    }

    if (results.length === 0) {
        sendMessage(roomId, `🤖studio61000🤖: I'm sorry, I couldn't find anyone with ${need}`);
        return;
    }
    if (results.length === 1) {
        sendMessage(roomId, `🤖studio61000🤖: here's someone who might be able to help: ${results[0].name}`);
        return;
    }
    if (results.length > 1) {
        sendMessage(roomId, `🤖studio61000🤖: ere are some people who might be able to help: ${results.map(profile => profile.name).join(", ")}`);
        return;
    }
}

const handleMessage = async (event) => {
    const message = event.event.content.body;
    const { sender, room_id } = event.event;

    if (message.toLowerCase().includes("studio61000 please register me")) {
        register(sender, message, room_id);
    }

    if (message.toLowerCase().includes("studio61000 please help")) {
        search(message, room_id);
    }
}

export default handleMessage;