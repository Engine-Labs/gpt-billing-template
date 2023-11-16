import { FastifyInstance } from "fastify";
import { createUser } from "../actions/user";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export default async function clerkWebhooks(server: FastifyInstance) {
  server.post("/webhooks/clerk", async (request, reply) => {
    const body = request.body as WebhookEvent;
    // TODO: webhook secret validation
    switch (body.type) {
      case "user.created":
        console.log(`Clerk webhook: user.created ${body.data.id}`);
        await createUser(body.data.id);
        return reply.code(204).send({});
    }

    reply.code(400).send({});
  });
}
