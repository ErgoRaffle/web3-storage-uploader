import WinstonLogger from '@rosen-bridge/winston-logger';
import * as Client from '@web3-storage/w3up-client';
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory';
import * as Proof from '@web3-storage/w3up-client/proof';
import { Signer } from '@web3-storage/w3up-client/principal/ed25519';
import Configs from '../configs';
import { UploadFile } from '../types/types';

const logger = WinstonLogger.getInstance().getLogger(import.meta.url);

class Web3Storage {
  private static instance: Web3Storage;
  private static client: Client.Client | undefined;

  /**
   * @returns a Web3Storage instance (create if it doesn't exist)
   */
  public static getInstance = () => {
    if (!Web3Storage.instance)
      throw new Error('Storage object is not instantiated yet');
    return Web3Storage.instance;
  };

  /**
   * initializes web3 client and create Web3Storage instance
   */
  public static init = async () => {
    if (!Web3Storage.instance) {
      const principal = Signer.parse(Configs.storageKey);
      const store = new StoreMemory();
      Web3Storage.client = await Client.create({ principal, store });
      // Add proof that this agent has been delegated capabilities on the space
      const proof = await Proof.parse(Configs.storageProof);
      const space = await Web3Storage.client.addSpace(proof);
      await Web3Storage.client.setCurrentSpace(space.did());
      Web3Storage.instance = new Web3Storage();
      logger.info('Web3Storage object instantiated!');
    }
  };

  /**
   * upload files on web3.storage
   * @param files list of UploadFile object
   * @returns list of CIDs belong to each file
   */
  upload = async (files: UploadFile[]): Promise<string[]> => {
    if (Web3Storage.client) {
      return await Promise.all(
        files.map(async (file) => {
          const fileObj = new File([file.buffer], file.fileName);
          const cid = await Web3Storage.client!.uploadFile(fileObj);
          const cidString = cid.toString();
          logger.info(
            `File ${file.fileName}, with CID ${cidString} uploaded in storage!`,
          );
          return cidString;
        }),
      );
    } else throw new Error('Storage object is not instantiated yet');
  };
}

export default Web3Storage;
