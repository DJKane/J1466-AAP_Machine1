var m = global.get("machineNumber");
var z = env.get("zoneNumber");
var s = m*2 - 1;
if (m > 1 && z < 13)
    s -= 1;
    
var topicBase = `AAP/Hamilton/Pultrusion/Machine${m}/stream${s}/zone${z > 12 ? z - 12 : z}/`
return [
    {topic: topicBase + 'p', payload: msg.p},
    {topic: topicBase + 'i', payload: msg.i},
    {topic: topicBase + 'd', payload: msg.d},
    {topic: topicBase + 't', payload: msg.t},
    ];