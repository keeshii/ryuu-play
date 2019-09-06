import * as fs from 'fs';
import * as path from 'path';

export interface Config {

  backend: {
    address: string,
    port: number,
    storageAddress: string,
    storagePort: number
  };

  storage: {
    adapter: 'memory'
  };

}

export let config: Config;

export async function readConfig(): Promise<Config> {
  const promise = new Promise<Config>((resolve, reject) => {
    const configPath = path.join(__dirname, '../../config.json');
    fs.readFile(configPath, (err, data) => {
      if (err) {
        reject(err);
      }
      config = JSON.parse(String(data));
      resolve(config);
    });
  });

  return promise;
}
