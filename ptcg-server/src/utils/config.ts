import * as fs from 'fs';
import * as path from 'path';

export interface Config {

  backend: {
    address: string,
    port: number,
    serverPassword: string,
    registrationEnabled: boolean,
    secret: string,
    tokenExpire: number;
  };

  storage: {
    type: 'mysql',
    host: string,
    port: number,
    username: string,
    password: string,
    database: string
  };

}

export let config: Config = {} as any;

export async function readConfig(): Promise<Config> {
  const promise = new Promise<Config>((resolve, reject) => {
    const configPath = path.join(__dirname, '../../config.json');
    fs.readFile(configPath, (err, data) => {
      if (err) {
        reject(err);
      }
      Object.assign(config, JSON.parse(String(data)));
      resolve(config);
    });
  });

  return promise;
}
