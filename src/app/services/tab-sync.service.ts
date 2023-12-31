import { EventEmitter, Injectable } from '@angular/core';

export enum StorageEvents {
  PAGE_OPEN_PING = 'explorer:evt_page_open_ping',
  PAGE_OPEN_PONG = 'explorer:evt_page_open_pong',
  CLEAR = 'explorer:evt_clear',
}

@Injectable({
  providedIn: 'root',
})
export class TabSyncService {
  clear$: EventEmitter<boolean> = new EventEmitter<boolean>();
  tabWillClose$: EventEmitter<boolean> = new EventEmitter<boolean>();

  private tabClosedEventHandlers: (() => void)[] = [];

  constructor() {
    this.setupListener();
  }

  sendEvent(eventType: StorageEvents) {
    localStorage[eventType] = Date.now();
  }

  setupListener() {
    // Broadcast that a new page is opening
    localStorage[StorageEvents.PAGE_OPEN_PING] = Date.now();
    var onLocalStorageEvent = async (event: any) => {
      // Listen if a new page is opened
      if (event.key === StorageEvents.PAGE_OPEN_PING) {
        // Send response to say page is already open
        localStorage[StorageEvents.PAGE_OPEN_PONG] = Date.now();
      }

      if (event.key === StorageEvents.PAGE_OPEN_PONG) {
        console.log('Another page was opened');
        // alert('One more page already open');
      }

      if (event.key === StorageEvents.CLEAR) {
        console.log('CLEAR REQUEST RECEIVED');
        this.clear$.next(true);
      }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);

    window.addEventListener('beforeunload', (event) => {
      this.tabWillClose$.emit(true);
      this.tabClosedEventHandlers.forEach((handler) => {
        handler();
      });
    });
  }

  addTabClosedEventHandler(handler: () => void) {
    this.tabClosedEventHandlers.push(handler);
  }
}
