var influxMsg = {};
influxMsg.payload = [];
var v = 0;
for (var z=0; z<2; z++)
{
    //set flow variables for slower poll rate to pick up later
    flow.set(`${msg.payload[z].plug}PV`, msg.payload[z].pv);
    flow.set(`${msg.payload[z].plug}Output`, msg.payload[z].output);
    if (msg.payload[z].output > 0.05)
        flow.set(`${msg.payload[z].plug}Amps`, msg.payload[z].amps);

    //output duty to influx at regular rate
    if (global.get(`${msg.payload[z].plug}Enabled`))
        influxMsg.payload[z] = [
            {
                duty_pct:msg.payload[z].output,
            },
            {
                machine: msg.payload[z].machine,
                stream: msg.payload[z].stream,
                zone: msg.payload[z].zone,
                plug: msg.payload[z].plug,
                test: msg.payload[z].test,
            },
        ];
}

return influxMsg;