"use client";

export default function TestToolsPage() {

  async function resetQuota() {

    const res = await fetch(
      "/api/webhook/reset-quota",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          eventId: "reset-123",
        }),
      }
    );

    const data = await res.json();

    alert(data.message);
  }

  async function callWebhookAgain() {

    const res = await fetch(
      "/api/webhook/reset-quota",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          eventId: "reset-123",
        }),
      }
    );

    const data = await res.json();

    alert(data.message);
  }

  async function generateLeads() {

    const requests = [];

    for (let i = 0; i < 10; i++) {

      requests.push(

        fetch(
          "/api/request-service",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: `User ${i}`,
              phone: `99999${i}`,
              city: "Surat",
              description:
                "Bulk test lead",
              serviceId:
                (i % 3) + 1,
            }),
          }
        )
      );
    }

    await Promise.all(requests);

    alert("10 leads generated");
  }

  return (
    <div className="p-8 space-y-4">

      <h1 className="text-3xl font-bold">
        Test Tools
      </h1>

      <button
        onClick={resetQuota}
        className="bg-black text-white px-4 py-2 block"
      >
        Reset Provider Quotas
      </button>

      <button
        onClick={callWebhookAgain}
        className="bg-blue-600 text-white px-4 py-2 block"
      >
        Call Webhook Again
      </button>

      <button
        onClick={generateLeads}
        className="bg-green-600 text-white px-4 py-2 block"
      >
        Generate 10 Leads
      </button>

    </div>
  );
}