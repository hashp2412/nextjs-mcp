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
            } else {
                const data = await response.json();
                return data;
            }
        }
    );

    server.tool(
        "loginWithOtp",
        "Send OTP to a phone number and log in to Clevo using the OTP",
        { phone: z.string().describe("Phone number to send OTP to") },
        async (input, context) => {
            // Step 1: Send OTP
            const sendOtpResponse = await fetch("https://api.theorb.bio/api/v1/send_otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: input.phone }),
            });
            if (!sendOtpResponse.ok) {
                throw new Error("Failed to send OTP");
            }

            // Step 2: Ask user for OTP
            // TODO: Implement a way to get OTP from user. Replace the line below with your own prompt logic.
            // const otp = await context.prompt("Please enter the OTP sent to your phone:");
            const otp = ""; // <-- Replace with actual OTP input from user

            // Step 3: Log in with OTP
            const loginResponse = await fetch("https://api.theorb.bio/api/v1/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: input.phone, otp }),
            });
            if (!loginResponse.ok) {
                throw new Error("Login failed");
            }
            const data = await loginResponse.json();
            return data;
        }
    );
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
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    verboseLogs: true,
    maxDuration: 60

});

export {handler as GET, handler as POST, handler as DELETE};