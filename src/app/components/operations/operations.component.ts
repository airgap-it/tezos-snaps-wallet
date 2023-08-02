import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  @Input() operations: {
    hash: string;
    amount: number;
    sender: { address: string };
    target: { address: string };
    timestamp: string;
  }[] = [];
  constructor() {}

  ngOnInit(): void {}
}
