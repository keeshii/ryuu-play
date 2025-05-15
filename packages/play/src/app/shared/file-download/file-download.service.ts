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
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const cordova = (window as any).cordova;

      cordova.plugins.saveDialog.saveFile(blob, fileName)
        .then(() => resolve())
        .catch(() => reject());
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
