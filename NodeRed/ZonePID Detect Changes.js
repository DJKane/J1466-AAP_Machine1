var z = env.get("zoneNumber");
var lastP = flow.get(`${z}Pl`);
var lastI = flow.get(`${z}Il`);
var lastD = flow.get(`${z}Dl`);
var lastT = flow.get(`${z}Tl`);
var wasEnabled = flow.get(`${z}e`);
var isEnabled = global.get(`${z}Enabled`);
flow.set(`${z}e`, isEnabled);

//check if we're running
if (!isEnabled)
    return null;

//skip change check on rising edge of enable to always record the PID values on start
if (wasEnabled)
    //check if there are changes
    if (lastP ==  msg.p && lastI ==  msg.i && lastD ==  msg.d && lastT ==  msg.t)
        return null;
    
var m = global.get("machineNumber");
var stream = 2*m - 1;
if (m > 1 && z <= 12)
    stream -= 1;
   
var test = global.get(`Test`);
   
msg.payload = [
    {
        PID_Pb:msg.p,
        PID_It:msg.i,
        PID_dt:msg.d,
        PID_Ct:msg.t
    },
    {
        machine: m,
        stream: stream,
        zone: (z-1)%12+1,
        plug: z,
        test: test,
    },
];

flow.set(`${z}Pl`, msg.p);
flow.set(`${z}Il`, msg.i);
flow.set(`${z}Dl`, msg.d);
flow.set(`${z}Tl`, msg.t);

return msg;