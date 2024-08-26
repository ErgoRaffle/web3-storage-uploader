import fastify, { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { storageRoute } from '../api/storage';
import Configs from '../configs';
import multipart from '@fastify/multipart';
import WinstonLogger from '@rosen-bridge/winston-logger';

const logger = WinstonLogger.getInstance().getLogger(import.meta.url);

/**
 * initialize api server
 * register all routers
 * then start it
 */
let apiServer: FastifyInstance;
const initApiServer = async () => {
  apiServer = fastify({
    bodyLimit: Configs.apiBodyLimit,
  }).withTypeProvider<TypeBoxTypeProvider>();

  apiServer.register(multipart, {
    limits: {
      fileSize: Configs.apiMaxFileSize,
      files: Configs.apiMaxNumberFile,
    },
  });
  await apiServer.register(storageRoute);
  const port = Configs.apiPort;
  const host = Configs.apiHost;

  await apiServer.listen({ host, port });
  logger.info(`api service started at http://${host}:${port}`);
};

export { initApiServer, apiServer };
