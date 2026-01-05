var values = msg.payload;
msg.payload = {};
msg.payload.variables = [];

var testL = global.get(`TestL`);
var testR = global.get(`TestR`);
var batchNumberL = global.get(`BatchNumberL`);
var batchNumberR = global.get(`BatchNumberR`);
var m = global.get(`machineNumber`);
var firstZone = 1;

if (msg.modbusRequest.unitid == "1" || msg.modbusRequest.unitid == "4" || msg.modbusRequest.unitid == "10")
    firstZone = 1;
else if (msg.modbusRequest.unitid == "2" || msg.modbusRequest.unitid == "5" || msg.modbusRequest.unitid == "11")
    firstZone = 5;
else if (msg.modbusRequest.unitid == "3" || msg.modbusRequest.unitid == "6" || msg.modbusRequest.unitid == "12")
    firstZone = 9;
else if (msg.modbusRequest.unitid == "7" || msg.modbusRequest.unitid == "13")
    firstZone = 13;
else if (msg.modbusRequest.unitid == "8" || msg.modbusRequest.unitid == "14")
    firstZone = 17;
else if (msg.modbusRequest.unitid == "9" || msg.modbusRequest.unitid == "15")
    firstZone = 21;

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

var influxMsg = {};
influxMsg.payload = [];
mqttMsg = {};
mqttMsg.topic = `AAP/Hamilton/Pultrusion/Machine${m}/stream${stream}/`;
mqttMsg.payload = [{},{}];
var v = 0;
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
    var test = z<13 ? testR : testL;
    var batchNumber = z<13 ? batchNumberR : batchNumberL;
    
    //PLC
    msg.payload.variables[v++] = makeVariable(z,"PV", pv);
    msg.payload.variables[v++] = makeVariable(z,"SPA", spa);
    msg.payload.variables[v++] = makeVariable(z,"Output", output);
    msg.payload.variables[v++] = makeVariable(z,"Alarms", alarms);
    msg.payload.variables[v++] = makeVariable(z,"Amps", amps);
    msg.payload.variables[v++] = makeVariable(z,"Enabled", enabled);
    msg.payload.variables[v++] = makeVariable(z,"SelfTuning", selfTuning);
    
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
    mqttMsg.payload[z].fields[q++] = {name: "BatchNumber", value: batchNumber};
        
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
                batchNumber: batchNumber,
            },
        ];
}

return [msg,mqttMsg,influxMsg];