import { FastifyInstance } from "fastify";
import { STRIPE_ENDPOINT_SECRET } from "../constants";
import Stripe from "stripe";
import { stripeClient } from "../stripeClient";

export default async function stripeWebhooks(server: FastifyInstance) {
  // TODO: Add validation and types
  server.post("/webhooks/stripe", async (request, reply) => {
    const body = request.body as any;

    const sig = request.headers["stripe-signature"];
    if (body) {
      return reply.code(400).send({ error: "No request body provided" });
    }
    if (!sig) {
      return reply.code(400).send({ error: "No signature header found" });
    }
    if (!STRIPE_ENDPOINT_SECRET) {
      return reply.code(400).send({ error: "Endpoint secret not set" });
    }

    let webhookEvent: Stripe.Event;
    try {
      webhookEvent = stripeClient.webhooks.constructEvent(
        body,
        sig,
        STRIPE_ENDPOINT_SECRET
      );
    } catch (err) {
      return reply
        .code(400)
        .send({ error: `Webhook verification error: ${err}` });
    }

    switch (webhookEvent.type) {
      case "customer.subscription.deleted": {
        // TODO
        return reply.code(204).send({});
      }
      case "customer.subscription.updated": {
        // TODO
        return reply.code(204).send({});
      }
      case "checkout.session.completed": {
        // TODO
        return reply.code(204).send({});
      }
      default: {
        return reply.code(400).send({ error: "Unhandled event type" });
      }
    }
  });
}
