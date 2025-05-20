import { Injectable } from '@angular/core';
import { CardsInfo } from '@ptcg/common';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsCacheService {

  public getCardsInfo(): Observable<CardsInfo | undefined> {
    return this.openDatabase().pipe(switchMap(db => {
    const transaction = db.transaction('cards', 'readonly');
      const cards = transaction.objectStore('cards');
      const request = cards.get('data');

      return new Observable<CardsInfo>(subscriber => {
        request.onsuccess = function() {
          db.close();
          subscriber.next(request.result);
          subscriber.complete();
        };
        request.onerror = function() {
          db.close();
          subscriber.error(request.error);
          subscriber.complete();
        };
      });
    }));
  }

  public saveCardsInfo(cardsInfo: CardsInfo): Observable<void> {
    return this.openDatabase().pipe(switchMap(db => {
      const transaction = db.transaction('cards', 'readwrite');
      const cards = transaction.objectStore('cards');
      const request = cards.put(cardsInfo, 'data');

      return new Observable<void>(subscriber => {
        request.onsuccess = function() {
          db.close();
          subscriber.next();
          subscriber.complete();
        };
        request.onerror = function() {
          db.close();
          subscriber.error(request.error);
          subscriber.complete();
        };
      });
    }));
  }

  private openDatabase(): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>(subscriber => {
      const request = indexedDB.open("cards", 1);
      request.onupgradeneeded = () => {
        const db = request.result;

        db.onversionchange = () => {
          db.close();
          if (!subscriber.closed) {
            subscriber.error();
            subscriber.complete();
          }
        };

        if (!db.objectStoreNames.contains('cards')) {
          db.createObjectStore('cards');
        }
      };

      request.onerror = () => {
        subscriber.error(request.error);
        subscriber.complete();
      };

      request.onsuccess = () => {
        subscriber.next(request.result);
        subscriber.complete();
      };
    });
  }

}
