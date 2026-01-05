msg1 = {
    topic: msg.topic + `zone${msg.payload[0].zone}/`,
    payload: msg.payload[0].fields,
}
msg2 = {
    topic: msg.topic + `zone${msg.payload[1].zone}/`,
    payload: msg.payload[1].fields,
}
return [msg1, msg2];