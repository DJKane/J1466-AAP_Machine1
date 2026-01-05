values = msg.payload;

function makeMessage(rawData)
{
    return {
        p: rawData[0] * 0.1,
        i: rawData[1] * 0.01,
        d: rawData[2] * 0.01,
        t: rawData[3],
    };
}

return [
    makeMessage(values),
    makeMessage(values.slice(4,8)),
    makeMessage(values.slice(8,12)),
    makeMessage(values.slice(12,16))];