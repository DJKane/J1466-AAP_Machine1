var zones = msg.payload.variables[0].value;
global.set(`Test`, msg.payload.variables[1].value === true);
var lastValues = [];
var msgs = [{},{},{}];
var anyChanges = [false,false,false];


for(var i = 0; i < 12; i++)
    global.set(`${i+1}Enabled`, zones[i].Enabled);

function clampTemp(temp)
{
    if (temp < 32)
        return 32;
    if (temp > 999)
        return 999;
    return temp;
}

function makeWord(num)
{
    if (num < 0)
        num += 32768;
        
    return num & 0xFFFF;
}

for (var unit = 0; unit < 3; unit++)
{
    lastValues[unit] = global.get(`Write${unit}Vals`);

    msgs[unit] = {
        payload: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
        ]
    };

    for (var z = 0; z < 4; z++)
    {
        msgs[unit].payload[z*4+0] = makeWord(clampTemp(zones[4*unit+z].SP));
        msgs[unit].payload[z*4+1] = makeWord((zones[4*unit+z].Enabled?0:8) + (zones[4*unit+z].SelfTune?4:0));
        msgs[unit].payload[z*4+2] = makeWord(clampTemp(0));
        msgs[unit].payload[z*4+3] = makeWord(clampTemp(0));
    }
    if (Array.isArray(lastValues[unit])) {
        for (var i = 0; i < 16; i++) {
            if (msgs[unit].payload[i] != lastValues[unit][i]) {
                anyChanges[unit] = true;
                break;
            }
        }
    }
    else {
        anyChanges[unit] = true;
    }

    if (anyChanges[unit])
    {
        global.set(`Write${unit}Vals`, msgs[unit].payload);
    }
}

return [
    anyChanges[0] ? msgs[0] : null,
    anyChanges[1] ? msgs[1] : null,
    anyChanges[2] ? msgs[2] : null,
];