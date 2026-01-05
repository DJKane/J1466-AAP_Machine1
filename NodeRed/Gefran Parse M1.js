values = msg.payload;
msg.payload = {};
msg.payload.variables = [];

var test = global.get(`Test`);
var m = global.get(`machineNumber`);
var firstZone = 1;

if (msg.modbusRequest.unitid == "1")
    firstZone = 1;
else if (msg.modbusRequest.unitid == "2")
    firstZone = 5;
else if (msg.modbusRequest.unitid == "3")
    firstZone = 9;
    
if (msg.topic == "requestB")
    firstZone += 2;

var stream = m*2-1;
if (m > 1 && firstZone < 13)
    stream -= 1;

function makeVariable(zone, name, value)
{
    return {
        path:`Arp.Plc.Eclr/Zone[${zone+firstZone}].${name}`,
        value: value,
        valueType:"Constant"
    }
}

var influxMsg = {tags:{
    machine: m,
    stream: stream,
    zone: firstZone,
}}
influxMsg = {};
influxMsg.payload = [];
mqttMsg = {};
mqttMsg.topic = `AAP/Hamilton/Pultrusion/Machine${m}/stream${stream}/`;
mqttMsg.payload = [{},{}];
for (var z=0; z<2; z++)
{
    var pv = values[z*9+0];
    var spa = values[z*9+1];
    var output = values[z*9+2]*0.1;
    var alarms = values[z*9+3];
    var amps = values[z*9+4]*0.1;
    var enabled = (values[z*9+5] & 8) == 0;
    var selfTuning = (values[z*9+5] & 4) > 0;
    var zone = (z + firstZone - 1)%12 + 1;
    var plug = z + firstZone;
    
    //PLC
    var v = 0;
    msg.payload.variables[v++] = makeVariable(z,"PV", pv);
    msg.payload.variables[v++] = makeVariable(z,"SPA", spa);
    msg.payload.variables[v++] = makeVariable(z,"Output", output);
    msg.payload.variables[v++] = makeVariable(z,"Alarms", alarms);
    msg.payload.variables[v++] = makeVariable(z,"Amps", amps);
    msg.payload.variables[v++] = makeVariable(z,"Enabled", enabled);
    msg.payload.variables[v++] = makeVariable(z,"SelfTuning", selfTuning);
        
    //InfluxDB
    flow.set(`${z+firstZone}PV`, pv);
    flow.set(`${z+firstZone}Output`, output);
    if (output > 0.05)
        flow.set(`${z+firstZone}Amps`, amps);
    if (global.get(`${z + firstZone}Enabled`))
        influxMsg.payload[z] = [
            {
                duty_pct:output,
            },
            {
                machine: m,
                stream: stream,
                zone: zone,
                plug: plug,
                test: test,
            },
        ];
    
    //MQTT
    mqttMsg.payload[z].zone = (z + firstZone - 1)%12 + 1;
    mqttMsg.payload[z].fields = [];
    var q =0;
    mqttMsg.payload[z].fields[q++] = {name: "PV", value: pv};
    mqttMsg.payload[z].fields[q++] = {name: "SPA", value: spa};
    mqttMsg.payload[z].fields[q++] = {name: "Output", value: output};
    mqttMsg.payload[z].fields[q++] = {name: "Alarms", value: alarms};
    if (output > 0.05)
        mqttMsg.payload[z].fields[q++] = {name: "Amps", value: amps};
    mqttMsg.payload[z].fields[q++] = {name: "Enabled", value: enabled};
    mqttMsg.payload[z].fields[q++] = {name: "SelfTuning", value: selfTuning};
}

return [msg,mqttMsg,influxMsg];