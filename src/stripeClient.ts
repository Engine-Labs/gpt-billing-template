import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./constants";

export const stripeClient = new Stripe(STRIPE_SECRET_KEY!);
