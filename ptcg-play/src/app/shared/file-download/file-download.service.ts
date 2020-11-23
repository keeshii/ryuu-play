import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor() { }

  public async downloadFile(data: string, fileName: string): Promise<void> {
    const hasCordova = !!(window as any).cordova;
    return hasCordova
      ? this.downloadCordova(data, fileName)
      : this.downloadBrowser(data, fileName);
  }

  public async downloadCordova(data: string, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([data], { type: 'text/plain' });
      const cordova = (window as any).cordova;
      const platform = (window as any).device.platform;
      const resolveLocalFileSystemURL = (window as any).resolveLocalFileSystemURL;
      let storageLocation = cordova.file.externalDataDirectory;

      if (platform === 'iPhone' || platform === 'iOS') {
        storageLocation = cordova.file.documentsDirectory;
      }

      resolveLocalFileSystemURL(
        storageLocation,
        (dir: any) => {
          dir.getFile(fileName, { create: true }, (file: any) => {
            file.createWriter(
              (fileWriter: any) => {
                fileWriter.write(blob);
                fileWriter.onwriteend = () => resolve();
                fileWriter.onerror = () => reject();
              }, (err: any) => reject()); // failed to create file
          }, (err: any) => reject()); // // failed to open dir
        }
      );
    });
  }

  public async downloadBrowser(data: string, fileName: string): Promise<void> {
    const doc: Document = document;
    const blob = new Blob([data], { type: 'text/plain' });
    const a = doc.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', window.URL.createObjectURL(blob));
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
  }
}
