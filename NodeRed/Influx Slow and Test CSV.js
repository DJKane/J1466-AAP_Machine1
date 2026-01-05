msg.payload = [];

var m = global.get(`machineNumber`);
var stream = m*2-1;
if (m == 1)
    stream = 2;

var sampleL = null;
var testL = global.get(`TestL`);
if (testL && m > 1)
    sampleL = {
        payload:{
            timestamp: Date.now()
        },
        filename:`nodered:/data/stream${stream}.csv`,
        columns:"timestamp",
    };
var sampleR = null;
var testR = global.get(`TestR`);
if (testR)
    sampleR = {
        payload:{
            timestamp: Date.now()
        },
        filename:`nodered:/data/stream${stream - 1}.csv`,
        columns:"timestamp",
    };

    var numOfZones = m > 1 ? 24 : 12;
var j = 0;
for(var i = 1; i <= numOfZones; i++)
{
    if (global.get(`${i}Enabled`))
    {
        msg.payload[j++] = [
            {
                temperature_F: flow.get(`${i}PV`),
                current_A: flow.get(`${i}Amps`),
            },
            {
                machine: global.get(`machineNumber`),
                stream: i<13 ? stream - 1 : stream,
                zone: (i-1)%12+1,
                plug: i,
                test: i<13 ? testR : testL,
            },
        ]
        if (testL && i >= 13)
        {
            sampleL.columns += `,temp${i-12},duty${i-12},amps${i-12}`;
            sampleL.payload[`temp${i-12}`] = flow.get(`${i}PV`);
            sampleL.payload[`duty${i-12}`] = flow.get(`${i}Output`);
            sampleL.payload[`amps${i-12}`] = flow.get(`${i}Amps`);
        }
        if (testR && i < 13)
        {
            sampleR.columns += `,temp${i},duty${i},amps${i}`;
            sampleR.payload[`temp${i}`] = flow.get(`${i}PV`);
            sampleR.payload[`duty${i}`] = flow.get(`${i}Output`);
            sampleR.payload[`amps${i}`] = flow.get(`${i}Amps`);
        }
    }
}
return [ msg, sampleL, sampleR ];