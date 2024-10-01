import "dotenv/config";
import * as sdk from "matrix-js-sdk";
import { RoomEvent, ClientEvent } from "matrix-js-sdk";
import handleMessage from "./messages";
import handleReaction from "./reactions";

const { homeserver, auth_token } = process.env;

const client = sdk.createClient({
    baseUrl: `https://matrix.${homeserver}`,
    accessToken: auth_token,
    userId: `@studio61000:${homeserver}`,
});

const start = async () => {
    await client.startClient({ initialSyncLimit: 10 });

    client.once(ClientEvent.Sync, async (state, prevState, res) => {
        // state will be 'PREPARED' when the client is ready to use
        console.log(state);
    });

    const scriptStart = Date.now();

    client.on(RoomEvent.Timeline, async function (event, room, toStartOfTimeline) {
        const eventTime = event.event.origin_server_ts;

        if (scriptStart > eventTime) {
            return; //don't run commands for old messages
        }

        if (event.event.sender === `@studio61000:${homeserver}`) {
            return; //don't reply to yourself
        }

        if (event.getType() !== "m.room.message" && event.getType() !== "m.reaction") {
            console.log("skipping event:", event)
            return; // only use messages or reactions
        }

        if (event.getType() === "m.room.message")
            handleMessage(event);

        if (event.getType() === "m.reaction")
            handleReaction(event);
    })
}

start();