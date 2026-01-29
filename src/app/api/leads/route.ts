import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload?.name || !payload?.email || !payload?.message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (payload?.botcheck) {
      return NextResponse.json({ success: true, message: "Thanks!" });
    }

    const webhookUrl = process.env.LEADS_API_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, message: "Lead capture is not configured." },
        { status: 500 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const apiKey = process.env.LEADS_API_KEY;
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const forwardBody = {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      pageUrl: payload.pageUrl || null,
      source: "popup-widget",
      createdAt: new Date().toISOString(),
      ...(apiKey ? { secret: apiKey } : {}),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(forwardBody),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Lead submission failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll be in touch soon.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
