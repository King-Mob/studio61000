const { auth_token, homeserver, member_storage_room_id } = process.env;

import { item } from "./types";

export const sendMessage = (roomId: string, message: string, context = {}) => {
    return fetch(
        `https://matrix.${homeserver}/_matrix/client/v3/rooms/${roomId}/send/m.room.message`,
        {
            method: "POST",
            body: JSON.stringify({
                body: message,
                msgtype: "m.text",
                context
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        }
    );
};

export const storeItem = (item: item) => {
    return fetch(`https://matrix.${homeserver}/_matrix/client/v3/rooms/${member_storage_room_id}/send/${item.type}`, {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${auth_token}`
        }
    });
}

export const getStorageEvents = () => {
    return fetch(`https://matrix.${homeserver}/_matrix/client/v3/rooms/${member_storage_room_id}/messages?limit=10000&dir=b`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${auth_token}`
        }
    });
}

export const getProfile = async (userId: string) => {
    return fetch(`https://matrix.${homeserver}/_matrix/client/v3/profile/${userId}`, {
        headers: {
            Authorization: `Bearer ${auth_token}`
        }
    })
}