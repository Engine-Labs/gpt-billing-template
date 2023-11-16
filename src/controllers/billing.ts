import { FastifyInstance } from "fastify";
import { BillingResponseType, BillingResponseSchema } from "../types/billing";
import { getUserBillingConfig } from "../actions/billing";
import { getUserFromToken } from "./common/auth";

export default async function billing(server: FastifyInstance) {
  server.get<{
    Reply: BillingResponseType;
  }>(
    "/billing",
    {
      schema: {
        response: BillingResponseSchema,
        operationId: "getBilling",
      },
    },
    async (request, reply) => {
      const token = request.headers.authorization?.split(" ")[1];
      if (!token) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      const user = await getUserFromToken(token);

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      const billingConfig = await getUserBillingConfig(user);

      return reply.code(200).send(billingConfig);
    }
  );
}
