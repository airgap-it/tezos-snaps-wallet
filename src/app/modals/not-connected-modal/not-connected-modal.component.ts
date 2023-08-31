import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-not-connected-modal',
  templateUrl: './not-connected-modal.component.html',
  styleUrls: ['./not-connected-modal.component.scss'],
})
export class NotConnectedModalComponent implements OnInit {
  constructor(public readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  cancel() {}

  connect() {}
}
