import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../../services/metamask.service';
import { ModalService } from 'src/app/services/modal.service';
import { isMetaMaskInstalled } from 'src/app/utils/metamask';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  isMetaMaskInstalled: boolean = isMetaMaskInstalled();
  isLoading: boolean = false;

  constructor(
    public readonly metamaskService: MetamaskService,
    public readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {}

  async connect() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.metamaskService
      .connect()
      .then(() => {
        this.modalService.showConnectedModal();
      })
      .finally(async () => {
        this.isLoading = false;
      });
  }

  showInstructionsModal() {
    this.modalService.showInstructionsModal();
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
