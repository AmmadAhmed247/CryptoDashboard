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

export const connectToBinance=async(onData)=>{
    const socket=new WebSocket("wss://fstream.binance.com/ws/!forceOrder@arr")
    socket.on("open",()=>{
        console.log("Connected to Binance");
    })
              
    socket.on("message", (data) => {
    const parsed = JSON.parse(data);
    if (parsed.e === "forceOrder" && parsed.o) {
        const order = parsed.o;
        onData({
            exchange: "Binance",
            symbol: order.s,
            side: order.S,
            price: parseFloat(order.p),
            qty: parseFloat(order.q),
            totalUSD:(parseFloat(order.p)*parseFloat(order.q)).toFixed(2),
            timestamp: order.T 
        });
    }
});


    socket.on("close",()=>{
        console.log("Binance Web Socket is Closed, Reconnecting.....");
        setTimeout(()=>connectToBinance(onData),5000)

        
    })
    socket.on("error",(error)=>{
        console.error("Binance Socket Error",error.message);
        
    })
}