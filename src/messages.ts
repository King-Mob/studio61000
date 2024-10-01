import { sendMessage } from "./matrixClientRequests";

const handleMessage = (event) => {
    const message = event.event.content.body;

    if (message.includes("studio61000")) {
        sendMessage(event.event.room_id, "🤖studio61000🤖: that's me!");
    }

}

export default handleMessage;