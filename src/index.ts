import './bootstrap';
import { initApiServer } from './jobs/apiServer';
import Web3Storage from './storage/web3Storage';

/**
 * initialize services
 */
const initService = async () => {
  await Web3Storage.init();
  await initApiServer();
};

initService().then(() => null);
