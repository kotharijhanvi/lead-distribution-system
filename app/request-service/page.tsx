"use client";

import { useState } from "react";

export default function RequestServicePage() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    description: "",
    serviceId: "1",
  });

  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setMessage("");

    const res = await fetch(
      "/api/request-service",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (data.success) {
      setMessage("Lead created successfully");
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Request Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
        />

        <select
          className="border p-2 w-full"
          value={form.serviceId}
          onChange={(e) =>
            setForm({
              ...form,
              serviceId: e.target.value,
            })
          }
        >
          <option value="1">
            Service 1
          </option>

          <option value="2">
            Service 2
          </option>

          <option value="3">
            Service 3
          </option>
        </select>

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2"
        >
          Submit
        </button>
      </form>

      {message && (
        <p className="mt-4">
          {message}
        </p>
      )}
    </div>
  );
}