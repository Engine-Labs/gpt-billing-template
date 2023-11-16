import { FastifyInstance } from "fastify";
import { STRIPE_ENDPOINT_SECRET } from "../constants";
import Stripe from "stripe";
import { stripeClient } from "../stripeClient";
import prisma from "../prisma";

export default async function stripeWebhooks(server: FastifyInstance) {
  // TODO: Add validation and types
  server.post(
    "/webhooks/stripe",
    {
      schema: {
        hide: true,
      },
    },
    async (request, reply) => {
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

      // HACK: there should only be one user per stripe customer ID
      switch (webhookEvent.type) {
        case "customer.subscription.deleted": {
          await prisma.user.updateMany({
            where: {
              stripe_customer_id: webhookEvent.data.object.customer as string,
            },
            data: {
              subscribed: false,
            },
          });
          return reply.code(204).send({});
        }
        case "customer.subscription.updated": {
          await prisma.user.updateMany({
            where: {
              stripe_customer_id: webhookEvent.data.object.customer as string,
            },
            data: {
              subscribed: webhookEvent.data.object.status === "active",
            },
          });
          return reply.code(204).send({});
        }
        case "checkout.session.completed": {
          const checkoutSession = webhookEvent.data
            .object as Stripe.Checkout.Session;
          await prisma.user.updateMany({
            where: {
              stripe_checkout_session_id: checkoutSession.id,
            },
            data: {
              stripe_subscription_id: checkoutSession.subscription as string,
              subscribed: true,
            },
          });
          return reply.code(204).send({});
        }
        default: {
          return reply.code(400).send({ error: "Unhandled event type" });
        }
      }
    }
  );
}
