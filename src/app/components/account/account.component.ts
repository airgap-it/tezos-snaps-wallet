import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() address: string = '';
  @Input() balance: string = '';

  constructor() {}

  ngOnInit(): void {}
}
