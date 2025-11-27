import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../../services/metamask.service';
import { ModalService } from 'src/app/services/modal.service';
import { isMetaMaskInstalled } from 'src/app/utils/metamask';
import { isMobile } from 'src/app/utils/is-mobile';
console.log('isMobile', isMobile());
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  isMetaMaskInstalled: boolean | null = null; // null = loading
  isMobile: boolean = isMobile();
  isLoading: boolean = false;
  errorCode: number = 0;

  constructor(
    public readonly metamaskService: MetamaskService,
    public readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    isMetaMaskInstalled().then((installed) => {
      this.isMetaMaskInstalled = installed;
    });
  }

  async connect() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.metamaskService
      .connect()
      .then(() => {
        this.errorCode = 0;
        this.modalService.showConnectedModal();
      })
      .catch((error: Error & { code: number }) => {
        this.errorCode = error.code;
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
