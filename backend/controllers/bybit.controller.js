import axios from "axios";
import WebSocket from "ws";


const getUSDTcontracts = async () => {
    try {
        const res = await axios.get(
            "https://api.bybit.com/v5/market/instruments-info?category=linear"
        );
        return res.data.result.list
            .filter(item => item.symbol.endsWith("USDT"))
            .map(item => `liquidation.${item.symbol}`);
    } catch (error) {
        console.error("Failed to fetch Bybit symbols:", error.message);
        return [];
    }
};

const formattedHelper=({ exchange, symbol, side, price, qty, timestamp,totalUSD })=>({
    exchange,
    symbol:symbol.replace(/[^A-Z]/g, ""),
    side,
    price:Number(price),
    qty:Number(qty),
    timestamp:Number(timestamp),
    totalUSD
})

export const connectToBybit = async (onData) => {
    const args = await getUSDTcontracts();
    if (args.length === 0) return;

    const socket = new WebSocket("wss://stream.bybit.com/v5/public/linear");

    socket.on("open", () => {
        console.log("Connected to Bybit");
        socket.send(JSON.stringify({ op: "subscribe", args }));
    });

    socket.on("message", (data) => {
        const parsed = JSON.parse(data);      
        if (parsed.topic?.includes("liquidation")) {
            const d = parsed.data;
            onData(formattedHelper({
                exchange: "Bybit",
                symbol: d.symbol,
                side: d.side?.toUpperCase(),
                price: parseFloat(d.price),
                qty: parseFloat(d.size),
                timestamp: d.time || Date.now(),
                totalUSD:(parseFloat(d.price)*parseFloat(d.size)).toFixed(2),
            }));
        }
    });

    socket.on("close", () => {
        console.log("Bybit socket closed, reconnecting...");
        setTimeout(() => connectToBybit(onData), 5000);
    });

    socket.on("error", (err) => {
        console.error("Bybit socket error:", err.message);
    });
};