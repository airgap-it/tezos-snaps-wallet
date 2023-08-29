import { EventEmitter, Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoadingModalComponent } from '../modals/loading-modal/loading-modal.component';

export enum StorageEvents {
  PAGE_OPEN_PING = 'evt_page_open_ping',
  PAGE_OPEN_PONG = 'evt_page_open_pong',
  PERMISSION_REQUEST = 'evt_permission_request',
  OPERATION_REQUEST = 'evt_operation_request',
  SIGN_REQUEST = 'evt_sign_request',
  CLEAR = 'evt_clear',
}

@Injectable({
  providedIn: 'root',
})
export class TabSyncService {
  clear$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly modalService: BsModalService) {
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
        // alert('One more page already open');
      }
      if (event.key === StorageEvents.PERMISSION_REQUEST) {
        console.log('PERMISSION REQUEST RECEIVED');
        const bsModalRef = this.modalService.show(LoadingModalComponent, {});
        bsModalRef.hide();
        this.sendEvent(StorageEvents.CLEAR);
      }
      if (event.key === StorageEvents.OPERATION_REQUEST) {
        console.log('OPERATION REQUEST RECEIVED');
        const bsModalRef = this.modalService.show(LoadingModalComponent, {});
        bsModalRef.hide();
        this.sendEvent(StorageEvents.CLEAR);
      }
      if (event.key === StorageEvents.SIGN_REQUEST) {
        console.log('SIGN REQUEST RECEIVED');
        const bsModalRef = this.modalService.show(LoadingModalComponent, {});
        bsModalRef.hide();
        this.sendEvent(StorageEvents.CLEAR);
      }
      if (event.key === StorageEvents.CLEAR) {
        console.log('CLEAR REQUEST RECEIVED');
        this.clear$.next(true);
      }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);
  }
}
