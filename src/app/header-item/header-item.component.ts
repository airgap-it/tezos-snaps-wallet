import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-header-item',
  templateUrl: './header-item.component.html',
  styleUrls: ['./header-item.component.scss'],
})
export class HeaderItemComponent implements OnInit {
  status = '';

  constructor(public readonly modalService: BsModalService) {}

  ngOnInit(): void {}

  clearStorage() {
    const bsModalRef = this.modalService.show(ConfirmModalComponent, {});

    bsModalRef.onHide?.pipe(first()).subscribe((result) => {
      if (result === 'confirm') {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
}
