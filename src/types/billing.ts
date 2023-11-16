import { Static, Type } from "@sinclair/typebox";

const BillingResponse = Type.Object({
  subscriptionStatus: Type.String(),
  trialDaysRemaining: Type.Optional(Type.Number()),
  purchaseSubscriptionLink: Type.Optional(Type.String()),
  subscriptionManagementLink: Type.Optional(Type.String()),
});

export type BillingConfig = Static<typeof BillingResponse>;

export const BillingResponseSchema = {
  200: BillingResponse,
  "4xx": Type.Object({
    error: Type.String(),
  }),
};

const BillingResponseObject = Type.Object(BillingResponseSchema);

export type BillingResponseType = Static<typeof BillingResponseObject>;
