"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [providers, setProviders] =
    useState<any[]>([]);

  async function fetchDashboard() {

    const res = await fetch(
      "/api/dashboard"
    );

    const data = await res.json();

    if (data.success) {
      setProviders(data.providers);
    }
  }

  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(
      fetchDashboard,
      3000
    );

    return () =>
      clearInterval(interval);

  }, []);

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Provider Dashboard
      </h1>

      <div className="space-y-6">

        {providers.map((provider) => (

          <div
            key={provider.id}
            className="border p-4 rounded"
          >

            <h2 className="text-xl font-semibold">
              {provider.name}
            </h2>

            <p>
              Used Quota:
              {" "}
              {provider.usedQuota}
            </p>

            <p>
              Remaining Quota:
              {" "}
              {provider.remainingQuota}
            </p>

            <h3 className="font-semibold mt-4">
              Assigned Leads
            </h3>

            <div className="mt-2 space-y-2">

              {provider.leads.length === 0 && (
                <p>No leads assigned</p>
              )}

              {provider.leads.map(
                (assignment: any) => (

                  <div
                    key={assignment.id}
                    className="border p-2"
                  >

                    <p>
                      Lead ID:
                      {" "}
                      {assignment.lead.id}
                    </p>

                    <p>
                      Customer:
                      {" "}
                      {assignment.lead.name}
                    </p>

                    <p>
                      Phone:
                      {" "}
                      {assignment.lead.phone}
                    </p>

                    <p>
                      Service:
                      {" "}
                      {assignment.lead.serviceId}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}