import { ExecModes } from '../src/common/enums';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: ExecModes;
      PORT: string | undefined;
    }
  }
}
