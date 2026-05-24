import { NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring and uptime services
 */
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    app: "CrysLearn",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
