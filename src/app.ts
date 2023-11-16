import "dotenv/config";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { LOG_LEVEL } from "./constants";

const app = fastify({
  logger: {
    level: LOG_LEVEL,
  },
}).withTypeProvider<TypeBoxTypeProvider>();

export default app;
export const logger = app.log;
