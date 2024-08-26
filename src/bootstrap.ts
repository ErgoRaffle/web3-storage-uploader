import Configs from './configs';
import WinstonLogger from '@rosen-bridge/winston-logger';

await WinstonLogger.init(Configs.logs);
