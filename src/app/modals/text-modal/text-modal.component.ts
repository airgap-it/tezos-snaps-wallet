import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-text-modal',
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.scss'],
})
export class TextModalComponent implements OnInit {
  title?: string;
  text?: string;
  closeBtnName?: string;

  constructor(public readonly bsModalRef: BsModalRef) {}

  ngOnInit(): void {}
}
