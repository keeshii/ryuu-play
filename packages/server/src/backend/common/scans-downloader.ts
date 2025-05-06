import { Card, CardManager } from '@ptcg/common';
import { access, constants, createWriteStream, mkdir, unlink } from 'node:fs';
import { dirname } from 'node:path';
import { get as httpGet } from 'node:http';
import { get as httpsGet } from 'node:https';

import { config } from '../../config';


export class ScansDownloader {

  public async downloadAllMissingCards(): Promise<void> {
    const cardManager = CardManager.getInstance();
    const cards = cardManager.getAllCards();
    const cardsToDownload: Card[] = [];

    for (const card of cards) {
      const filePath = config.sets.scansDir + this.getCardPath(card);
      const exists = await this.fileExists(filePath);
      if (!exists) {
        cardsToDownload.push(card);
      }
    }

    if (cardsToDownload.length === 0) {
      return;
    }

    console.log(`Cards total: ${cards.length}, cards with missing scans: ${cardsToDownload.length}.`);
    console.log('Downloading missing images, please wait...');

    for (const card of cardsToDownload) {
      const filePath = config.sets.scansDir + this.getCardPath(card);
      const downloadUrl = config.sets.scansDownloadUrl + this.getCardPath(card);
      console.log('File: ' + downloadUrl);

      await this.createDirectoryForFile(filePath);
      await this.downloadFile(downloadUrl, filePath);
    }
  }

  private getCardPath(card: Card): string {
    return config.sets.scansUrl
      .replace('/scans', '')
      .replace(/{name}/g, card.fullName)
      .replace(/{set}/g, card.set);
  }

  private fileExists(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      access(filePath, constants.F_OK, err => {
        resolve(err ? false: true);
      });
    });
  }

  private createDirectoryForFile(filePath: string): Promise<void> {
    const fileDir = dirname(filePath);
    return new Promise((resolve, reject) => {
      mkdir(fileDir, { recursive: true }, err => err ? reject(err) : resolve());
    });
  }

  private downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(filePath);
      const get = url.startsWith('https://') ? httpsGet : httpGet;

      const request = get(url, response => {
        if (response.statusCode !== 200) {
          return reject(new Error('Cannot download file: ' + url));
        }
        response.pipe(file);
      });

      file.on('finish', () => file.close(() => resolve()));

      request.on('error', err => {
        unlink(filePath, () => reject(err)); // delete the (partial) file and then return the error
      });

      file.on('error', err => {
        unlink(filePath, () => reject(err)); // delete the (partial) file and then return the error
      });
    });
  }

}
