import { FastifySeverInstance } from './schemas';
import WinstonLogger from '@rosen-bridge/winston-logger';
import Web3Storage from '../storage/web3Storage';
import { UploadFile } from '../types/types';

const logger = WinstonLogger.getInstance().getLogger(import.meta.url);

/**
 * setup upload storage route
 * @param server
 */
const uploadStorageRoute = async (server: FastifySeverInstance) => {
  server.post('/upload', async (request, reply) => {
    try {
      const data = request.files();
      const filesBuffer: UploadFile[] = [];
      for await (const value of data) {
        filesBuffer.push({
          fileName: value.filename,
          buffer: await value.toBuffer(),
        });
      }
      const CIDs = await Web3Storage.getInstance().upload(filesBuffer);
      reply.send(CIDs);
    } catch (e) {
      if (e instanceof Error && e.stack) {
        logger.warn(e.stack);
        reply.status(500).send({
          message: `uploading file failed because of ${e.message}`,
        });
      } else
        reply.status(500).send({
          message: `uploading file failed!`,
        });
    }
  });
};

const storageRoute = async (server: FastifySeverInstance) => {
  uploadStorageRoute(server);
};

export { storageRoute };
