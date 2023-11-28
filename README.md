<h1 style="font-weight:normal">
  GPT Billing API Template
</h1>

[![](https://img.shields.io/discord/1113845829741056101?logo=discord&style=flat)](https://discord.gg/QnytC3Y7Wx)

**Add billing/auth to your OpenAI GPT**

Get [hosted version](https://share-eu1.hsforms.com/1s6stLQg1SqqSJzRjF-xOBg2b9ek1)

# Features

A starter template to write Fastify APIs for OpenAI GPTs with auth, billing and OpenAPI spec generation.

- OAuth authentication with Clerk
- Stripe billing
- Prisma/SQLite for persistence
- 100% TypeScript
- Deploy wherever you like (we use Render)

# Getting Started

```bash
npm i
npm run dev
```

## Clerk Setup

1. Make a [Clerk](https://www.clerk.com) application
2. Get your publishable key and expose it as `CLERK_PUBLISHABLE_KEY`
3. Get your secret key and expose it as `CLERK_SECRET_KEY`
4. Make a Clerk webhook
   1. Point it to the route `/webhooks/clerk` in this API wherever you've deployed it
   2. Subscribe to the `user.created` event
5. Expose the webhook signing secret as `CLERK_WEBHOOK_SECRET`
6. Add a custom domain to your Clerk application that matches the `SERVER_URL` in your environment variables, which is where you have deployed this API

## Clerk OAuth Setup

The app uses Clerk to provide oauth for you GPT.

Run the following to create a Clerk oauth server on your production account:

```bash
npm run clerk-oauth-create
```

This will write the file `./clerk_oauth.json`. Use these parameters in the GPT UI to create your oauth login for your GPT.

OpenAI will then generate a callback URL for your GPT, copy this from the UI and run the following script to update
your Clerk oauth to use it:

```bash
npm run clerk-oauth-update https://chat.openai.com/aip/g-123/oauth/callback
```

Note you must use a production Clerk account with a custom domain, as the domain of your oauth must match that in your
actions openapi spec.

## Stripe Setup

1. Get an API key from Stripe: https://dashboard.stripe.com/apikeys
2. Expose it as the env variable `STRIPE_SECRET_KEY`
3. Make a subscription product in the Stripe UI: https://dashboard.stripe.com/products/create
4. Get the resulting price ID and expose it as `STRIPE_PRICE_ID`
5. Make a webhook: https://dashboard.stripe.com/webhooks/create
   1. Point it to the route `/webhooks/stripe` in this API wherever you've deployed it
   2. Make it handle the following events:
      - `checkout.session.completed`
      - `customer.subscription.updated`
      - `customer.subscription.deleted`
6. Obtain the signing secret for your webhook and expose it as `STRIPE_WEBHOOK_SECRET`

By default, protected API routes will require a subscription after 7 days.
Change this by editing `TRIAL_DAYS` in `src/constants.ts` or by setting the `TRIAL DAYS`
environment variable.

## Other Environment Variables

`SERVER_URL` should point to wherever you've deployed this API,
e.g. `https://example.com/api`.

`DATABASE_URL` should point to wherever your database is.
You will also need to update the `prisma.schema` file to use whatever database
you have chosen, if it is not SQLite.

`GPT_URL` should point to your GPT. It is used for redirection from billing pages.

## GPT configuration

Point your GPT actions at the route `/docs/json` wherever you have deployed this API.

If you want to set `x-openai-isConsequential` for any routes, you will instead need
to copy the JSON at `/docs/json`, manually alter it, and put the resulting spec
into your GPT actions.

Tell your GPT about the billing in your `instructions` (aka prompt), for example:

> After a user signs in via OAuth, check their billing subscription status and inform
> them about the 7-day free trial for this service and display any generated links from actions.

# Our GPTs

Built using this backend template.

[Database Builder](https://chat.openai.com/g/g-A3ueeULl8-database-builder)

- Create and Execute Database Migrations: I can help you create and execute database migrations to update the structure of your PostgreSQL database. This includes adding tables, modifying columns, creating indexes, and more.
- Rollback Migrations: If a recent migration didn't go as planned, I can help you roll it back to the previous state.
- Retrieve Current Database Schema: I can fetch and display the current schema of your database, allowing you to see the structure of your tables, columns, and relationships.
- Execute SQL Statements: You can ask me to execute specific SQL statements on your database. This is useful for querying data, updating records, deleting entries, and other database operations.
- Provide Database URL: If you need to connect to the database using external tools or applications, I can provide you with the database URL.
- Check Billing Subscription Status: After you sign in via OAuth, I will check your billing subscription status. I'll inform you about the 7-day free trial for this service and provide any necessary links for subscription management or purchase.
