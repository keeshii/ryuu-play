import { Injectable } from '@angular/core';

declare const document: any;

@Injectable({
  providedIn: 'root'
})
export class ReplayExportService {

  constructor() { }

  public downloadReplay(base64: string, fileName: string): void {
    const doc: Document = document;
    const a = doc.createElement('a');
    doc.body.appendChild(a);
    a.download = fileName + '.rep';
    a.href = 'data:app/text;plain,' + base64;
    a.click();
    doc.body.removeChild(a);
  }
}
