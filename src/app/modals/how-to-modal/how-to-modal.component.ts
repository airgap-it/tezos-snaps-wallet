import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-how-to-modal',
  templateUrl: './how-to-modal.component.html',
  styleUrls: ['./how-to-modal.component.scss'],
})
export class HowToModalComponent implements OnInit {
  closeBtnName?: string;

  constructor(public readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
}
