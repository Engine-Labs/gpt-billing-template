import { User } from "@prisma/client";
import Stripe from "stripe";
import { GPT_URL, STRIPE_PRICE_ID, TRIAL_DAYS } from "../constants";
import prisma from "../prisma";
import { BillingConfig } from "../types/billing";
import { stripeClient } from "../stripeClient";

async function createStripeCustomer(user: User): Promise<string> {
  const params: Stripe.CustomerCreateParams = {
    metadata: {
      user_id: user.id,
    },
  };

  const customer = await stripeClient.customers.create(params, {
    idempotencyKey: `${user.id}`,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripe_customer_id: customer.id,
    },
  });

  return customer.id;
}

export async function getTrialDaysRemaining(user: User) {
  const daysSinceCreation = Math.floor(
    (Date.now() - user.created_at.getTime()) / 1000 / 60 / 60 / 24
  );

  return TRIAL_DAYS - daysSinceCreation;
}

async function getOrCreateCheckoutSession(
  user: User,
  stripeCustomerId: string
) {
  // if there's an open checkout session already, just return it
  if (user.stripe_checkout_session_id) {
    const checkoutSession = await stripeClient.checkout.sessions.retrieve(
      user.stripe_checkout_session_id
    );

    if (checkoutSession.status === "open") {
      return checkoutSession;
    }
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    customer: stripeCustomerId,
    success_url: GPT_URL,
    cancel_url: GPT_URL,
    allow_promotion_codes: true,
  };

  const checkoutSession = await stripeClient.checkout.sessions.create(params);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripe_checkout_session_id: checkoutSession.id,
    },
  });

  return checkoutSession;
}

export async function getUserBillingConfig(user: User): Promise<BillingConfig> {
  if (user.subscribed) {
    // paid tier - get subscription management link and return
    const billingPortal = await stripeClient.billingPortal.sessions.create({
      customer: user.stripe_customer_id!, // if stripe_subscription_id is set, then stripe_customer_id must be set
      return_url: GPT_URL,
    });

    return {
      subscriptionStatus: "subscription_active",
      subscriptionManagementLink: billingPortal.url,
    };
  } else {
    // free tier
    const trialDaysRemaining = await getTrialDaysRemaining(user);

    let stripeCustomerId = user.stripe_customer_id;
    if (!stripeCustomerId) {
      stripeCustomerId = await createStripeCustomer(user);
    }

    const checkoutSession = await getOrCreateCheckoutSession(
      user,
      stripeCustomerId
    );

    return {
      subscriptionStatus: "free_trial",
      trialDaysRemaining: trialDaysRemaining,
      purchaseSubscriptionLink: checkoutSession.url!,
    };
  }
}
