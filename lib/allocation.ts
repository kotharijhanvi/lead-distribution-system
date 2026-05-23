import { prisma } from "./prisma";

const mandatoryProviders: Record<number, number[]> = {
  1: [1],
  2: [5],
  3: [1, 4],
};

const providerPools: Record<number, number[]> = {
  1: [2, 3, 4],
  2: [6, 7, 8],
  3: [2, 3, 5, 6, 7, 8],
};

export async function createLeadAndAssign(data: {
  name: string;
  phone: string;
  city: string;
  description: string;
  serviceId: number;
}) {

  return await prisma.$transaction(

    async (tx) => {

      // Create lead
      const lead = await tx.lead.create({
        data,
      });

      // Mandatory providers for this service
      const mandatoryRaw =
        mandatoryProviders[data.serviceId] || [];

      // Only mandatory providers with quota remaining
      const mandatoryProvidersWithQuota =
        await tx.provider.findMany({
          where: {
            id: {
              in: mandatoryRaw,
            },
            usedQuota: {
              lt: 10,
            },
          },
          orderBy: {
            id: "asc",
          },
        });

      const mandatory =
        mandatoryProvidersWithQuota.map((p) => p.id);

      // Remaining slots needed
      const needed = 3 - mandatory.length;

      // Provider pool
      const pool =
        providerPools[data.serviceId] || [];

      // Allocation state
      const state =
        await tx.allocationState.findUnique({
          where: {
            serviceId: data.serviceId,
          },
        });

      if (!state) {
        throw new Error("Allocation state missing");
      }

      // Available rotating providers
      const availableProviders =
        await tx.provider.findMany({
          where: {
            id: {
              in: pool,
            },
            usedQuota: {
              lt: 10,
            },
          },
          orderBy: {
            id: "asc",
          },
        });

      if (
        needed > 0 &&
        availableProviders.length === 0
      ) {
        throw new Error(
          "No providers available"
        );
      }

      // Rotate fairly
      const rotated = [
        ...availableProviders.slice(
          state.lastProviderIndex
        ),
        ...availableProviders.slice(
          0,
          state.lastProviderIndex
        ),
      ];

      // Select providers
      const selectedRotating = rotated
        .map((p) => p.id)
        .filter((id) => !mandatory.includes(id))
        .slice(0, needed);

      // Final providers
      const finalProviders = [
        ...mandatory,
        ...selectedRotating,
      ];

      // Ensure exactly 3 providers
      if (finalProviders.length !== 3) {
        throw new Error(
          "Not enough providers available"
        );
      }

      // Create assignments
      await tx.leadAssignment.createMany({
        data: finalProviders.map(
          (providerId) => ({
            leadId: lead.id,
            providerId,
          })
        ),
      });

      // Increment provider quotas
      for (const providerId of finalProviders) {

        await tx.provider.update({
          where: {
            id: providerId,
          },
          data: {
            usedQuota: {
              increment: 1,
            },
          },
        });
      }

      // Update rotation state
      await tx.allocationState.update({
        where: {
          serviceId: data.serviceId,
        },
        data: {
          lastProviderIndex:
            availableProviders.length > 0
              ? (
                  state.lastProviderIndex +
                  selectedRotating.length
                ) % availableProviders.length
              : 0,
        },
      });

      return {
        lead,
        assignedProviders: finalProviders,
      };
    },

    {
      isolationLevel: "Serializable",
    }
  );
}