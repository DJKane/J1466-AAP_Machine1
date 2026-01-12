var values = msg.payload;
msg.payload = [{},{}];

var testL = global.get(`TestL`);
var testR = global.get(`TestR`);
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

var v = 0;
for (var z=0; z<2; z++)
{
    msg.payload[z].pv = values[z*9+0];
    msg.payload[z].spa = values[z*9+1];
    msg.payload[z].output = values[z*9+2]*0.1;
    msg.payload[z].alarms = values[z*9+3];
    msg.payload[z].amps = values[z*9+4]*0.1;
    msg.payload[z].enabled = (values[z*9+5] & 8) == 0;
    msg.payload[z].selfTuning = (values[z*9+5] & 4) > 0;
    msg.payload[z].zone = (z + firstZone - 1)%12 + 1;
    msg.payload[z].plug = z + firstZone;
    msg.payload[z].test = z<13 ? testR : testL;
    msg.payload[z].stream = stream;
    msg.payload[z].machine = m;
}

return msg;