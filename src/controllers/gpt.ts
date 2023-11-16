import { FastifyInstance } from "fastify";
import { canMakeApiCall, getUserFromToken } from "./common/auth";
import { getUserBillingConfig } from "../actions/billing";

export default async function gpt(server: FastifyInstance) {
  server.get("/hello-world", async (request, reply) => {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      reply.code(404).send({ error: "User not found" });
      return;
    }

    if (!(await canMakeApiCall(token))) {
      const billingConfig = await getUserBillingConfig(user);
      return reply.code(402).send({
        error: `Please subscribe to continue using this API by visiting: ${billingConfig.purchaseSubscriptionLink}`,
      });
    }

    reply.code(200).send({
      message: "Hello world",
    });
  });
}
