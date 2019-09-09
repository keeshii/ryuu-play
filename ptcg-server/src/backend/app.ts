import { StorageServer } from './storage/storage-server';
import { config } from '../utils/config';


export class App {
  private storageServer: StorageServer;

  constructor() {
    this.storageServer = this.createStorageService();
  }

  private createStorageService(): StorageServer {
    const address = config.backend.storageAddress;
    const port = config.backend.storagePort;
    return new StorageServer(address, port);
  }

  public async start(): Promise<void> {
    await this.storageServer.start();
  }
}
