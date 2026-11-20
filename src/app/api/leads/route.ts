const requiredMessage = "Ελέγξτε τα στοιχεία της φόρμας και δοκιμάστε ξανά.";
const failureMessage = "Το αίτημα δεν στάλθηκε. Δοκιμάστε ξανά ή καλέστε την κλινική.";

function result(success: boolean, message: string, status = 200) {
  return Response.json({ success, message }, { status });
}

function textField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return result(false, requiredMessage, 400);
  }

  const name = textField(payload.name);
  const email = textField(payload.email);
  const phone = textField(payload.phone);
  const message = textField(payload.message);
  if (payload.botcheck) return result(true, "Ευχαριστούμε.");

  if (
    !name || name.length > 120 ||
    email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length > 32 || !/^\+?[\d ().-]+$/.test(phone) ||
    !/^\d{7,15}$/.test(phone.replace(/\D/g, "")) ||
    !message || message.length > 3000
  ) {
    return result(false, requiredMessage, 400);
  }

  const webhookUrl = process.env.LEADS_API_URL;
  if (!webhookUrl) return result(false, failureMessage, 500);

  const apiKey = process.env.LEADS_API_KEY;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
        pageUrl: textField(payload.pageUrl).slice(0, 2048) || null,
        source: "popup-widget",
        createdAt: new Date().toISOString(),
        ...(apiKey ? { secret: apiKey } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return result(false, failureMessage, 502);

    const receipt = await response.json().catch(() => null);
    if (receipt?.success === false || receipt?.ok === false) {
      return result(false, failureMessage, 502);
    }

    return result(true, "Ευχαριστούμε. Θα επικοινωνήσουμε μαζί σας σύντομα.");
  } catch {
    return result(false, failureMessage, 502);
  }
}
