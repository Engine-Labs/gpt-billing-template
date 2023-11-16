import { FastifyInstance } from "fastify";
import { createUser } from "../actions/user";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { CLERK_ENDPOINT_SECRET } from "../constants";

const webhook = new Webhook(CLERK_ENDPOINT_SECRET!);

export default async function clerkWebhooks(server: FastifyInstance) {
  server.post(
    "/webhooks/clerk",
    {
      schema: {
        hide: true,
      },
    },
    async (request, reply) => {
      const body = request.body as any;

      try {
        webhook.verify(
          request.body as any,
          request.headers as Record<string, string>
        ) as WebhookEvent;
      } catch (err) {
        throw new Error(`Webhook verification error: ${err}`);
      }

      switch (body.type) {
        case "user.created":
          console.log(`Clerk webhook: user.created ${body.data.id}`);
          await createUser(body.data.id);
          return reply.code(204).send({});
      }

      reply.code(400).send({});
    }
  );
}
