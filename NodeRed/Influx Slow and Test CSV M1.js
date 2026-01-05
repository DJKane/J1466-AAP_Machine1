msg.payload = [];

var m = global.get(`machineNumber`);
var stream = m*2-1;
if (m == 1)
    stream = 2;

var sample = null;
var test = global.get(`Test`);
if (test)
    sample = {
        payload:{
            timestamp: Date.now()
        },
        filename:"nodered:/data/stream1.csv",
        columns:"timestamp",
    };

var j = 0;
for(var i = 1; i <= 24; i++)
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
                test: test,
            },
        ]
        if (test) {
            sample.columns += `,temp${i},duty${i},amps${i}`;
            sample.payload[`temp${i}`] = flow.get(`${i}PV`);
            sample.payload[`duty${i}`] = flow.get(`${i}Output`);
            sample.payload[`amps${i}`] = flow.get(`${i}Amps`);
        }
    }
}
return [ msg, sample ];