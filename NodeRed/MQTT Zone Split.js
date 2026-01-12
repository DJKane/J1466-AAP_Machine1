msgs = [{},{}];
for (var z=0; z<2; z++)
{
    msgs[z].topic = `AAP/Hamilton/Pultrusion/Machine${msg.payload[z].machine}/stream${msg.payload[z].stream}/zone${msg.payload[z].zone}/`,
    msgs[z].payload = [];
    var q =0;
    msgs[z].payload[q++] = {name: "PV", value: msg.payload[z].pv};
    msgs[z].payload[q++] = {name: "SPA", value: msg.payload[z].spa};
    msgs[z].payload[q++] = {name: "Output", value: msg.payload[z].output};
    msgs[z].payload[q++] = {name: "Alarms", value: msg.payload[z].alarms};
    if (msg.payload[z].output > 0.05)
        msgs[z].payload[q++] = {name: "Amps", value: msg.payload[z].amps};
    msgs[z].payload[q++] = {name: "Enabled", value: msg.payload[z].enabled};
    msgs[z].payload[q++] = {name: "SelfTuning", value: msg.payload[z].selfTuning};
}
return msgs;