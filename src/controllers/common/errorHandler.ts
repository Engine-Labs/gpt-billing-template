import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../app";
import axios from "axios";

export function errorHandler(
  this: FastifyInstance,
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error(error);
  let errorMessage = error.message;
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data.errorMessage;
  }

  reply.code(500).send({
    status: 500,
    error: errorMessage,
  });
}
