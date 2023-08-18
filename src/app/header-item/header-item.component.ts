import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { MetamaskService } from '../services/metamask.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-header-item',
  templateUrl: './header-item.component.html',
  styleUrls: ['./header-item.component.scss'],
})
export class HeaderItemComponent implements OnInit {
  constructor(
    public readonly metamaskService: MetamaskService,
    public readonly accountService: AccountService
  ) {}

  ngOnInit(): void {}
}
