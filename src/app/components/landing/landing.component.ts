import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../../services/metamask.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(
    public readonly metamaskService: MetamaskService,
    public readonly modalService: ModalService
  ) {}

  ngOnInit(): void {}

  async connect() {
    const bsModalRef = this.showLoadingModal();
    this.metamaskService
      .connect()
      .then(() => {
        bsModalRef.hide();
        this.modalService.showConnectedModal();
      })
      .catch(async () => {
        bsModalRef.hide();
      });
  }

  showLoadingModal() {
    return this.modalService.showLoadingModal('Connecting...');
  }

  showInstructionsModal() {
    this.modalService.showInstructionsModal();
  }
}
