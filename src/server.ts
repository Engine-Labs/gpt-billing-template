import app from "./app";

import { clerkPlugin } from "@clerk/fastify";
import fastifySwagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import clerkWebhooks from "./controllers/clerkWebhooks";
import { errorHandler } from "./controllers/common/errorHandler";
import gpt from "./controllers/gpt";
import billing from "./controllers/billing";
import stripeWebhooks from "./controllers/stripeWebhooks";

const port = parseInt(process.env.PORT || "8080");
const host = "RENDER" in process.env ? "0.0.0.0" : "localhost";

const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: "GPT API Template",
      version: "0.1.0",
    },
  },
};
const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);
app.setErrorHandler(errorHandler);

app.register(gpt);
app.register(clerkWebhooks);
app.register(stripeWebhooks);
app.register(billing);

app.register(clerkPlugin);

app.listen({ host: host, port: port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
