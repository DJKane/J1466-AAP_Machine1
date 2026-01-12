function makeVariable(zone, name, value)
{
    return {
        path:`Arp.Plc.Eclr/Zone[${zone}].${name}`,
        value: value,
        valueType:"Constant"
    }
}

var v = 0;
var plcMsg = {};
plcMsg.payload = {variables:[]};
for (var z=0; z<2; z++)
{
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"PV", msg.payload[z].pv);
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"SPA", msg.payload[z].spa);
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"Output", msg.payload[z].output);
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"Alarms", msg.payload[z].alarms);
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"Amps", msg.payload[z].amps);
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"Enabled", msg.payload[z].enabled);
    plcMsg.payload.variables[v++] = makeVariable(msg.payload[z].plug,"SelfTuning", msg.payload[z].selfTuning);
}

return plcMsg;