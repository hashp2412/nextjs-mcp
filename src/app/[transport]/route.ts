import { createMcpHandler } from "@vercel/mcp-adapter";
import { get } from "http";
import z from "zod";
const handler = createMcpHandler(
(server)=>{
    server.tool(
        "getHealthGoals",
        "give all health goals from clevo website",
        async ()=>{
            const response = await fetch("https://api.theorb.bio/api/v1/health-goals");
            if (!response.ok) {
                throw new Error("Failed to fetch health goals");
            }else {
                const data = await response.json();
                return data;
            }
        }
    )
},
{
    capabilities: {
        tools: {
            getHealthGoals: {
                description: "Fetch all health goals from the Clevo website",
            }
        },
    },
},
{
    redisUrl: process.env.REDIS_URL,
    ssEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    verboseLogs: true,
    maxDuration: 60

});

export {handler as GET, handler as POST, handler as DELETE};