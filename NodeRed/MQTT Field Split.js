msgs = [];
for (var i = 0; i < 7 && i < msg.payload.length; i++) {
    msgs[i] = {
        topic: msg.topic + msg.payload[i].name,
        payload: msg.payload[i].value,
    }
}
return msgs;