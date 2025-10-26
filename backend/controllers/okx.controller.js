import WebSocket from "ws";

const formattedHelper=({ exchange, symbol, side, price, qty, timestamp,totalUSD })=>({
    exchange,
    symbol:symbol.replace(/[^A-Z]/g, ""),
    side,
    price:Number(price),
    qty:Number(qty),
    timestamp:Number(timestamp),
    totalUSD
})


export const connectToOkx=async(onData)=>{
    const socket=new WebSocket("wss://ws.okx.com:8443/ws/v5/public")

    socket.on("open",()=>{
        console.log("Connected to OKX");
        socket.send(JSON.stringify({
            op:"subscribe",
            args:[
                {channel:"liquidation-orders",instType:"SWAP"}
            ]
        }))
        
    })
    socket.on("message",(msg)=>{
        const parsed=JSON.parse(msg)  
        if (parsed.arg?.channel === "liquidation-orders" && parsed.data?.length) {
    parsed.data.forEach(d => {
        if (d.details?.length) {
            d.details.forEach(detail => {
                onData(formattedHelper({
                    exchange: "OKX",
                    symbol: d.instId,
                    side: detail.side.toUpperCase(),
                    price: Number(detail.bkPx),
                    qty: Number(detail.sz),
                    timestamp: Number(detail.ts),
                    totalUSD:Number(detail.sz)*Number(detail.bkPx),
                }));
            });
        }
    });
}

    })
    socket.on("close", () => {
        console.log("OKX WebSocket closed, reconnecting...");
        setTimeout(() => connectToOkx(onData), 5000);
    });
    socket.on("error", (err) => {
        console.error("OKX Socket Error:", err.message);
    });
}