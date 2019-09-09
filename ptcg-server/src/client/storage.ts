import { StorageClient } from '../backend';
import { config } from '../utils/config';

const help = `
This is storage object. It allows to perform basic tasks on the database.

db - object for db manipulation. For more info type help(storage.db).
resetAllData() - removes all data from the database.
`;


const client = new StorageClient();

export class Storage {

  public static readonly shortHelp: string = 'Storage help describtion';
  
  public static readonly help: string = help;

  constructor() {
    client.connect(config.backend.storageAddress, config.backend.storagePort);
  }

  public async sendHello(): Promise<void> {
    const message = await client.sendHello();
    console.log('received response: ', message);
  }

}
