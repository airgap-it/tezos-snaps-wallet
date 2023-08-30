import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private readonly modalService: ModalService) {}

  ngOnInit(): void {}

  showAboutModal() {
    this.modalService.showAboutModal();
  }

  showPrivacyModal() {
    this.modalService.showPrivacyModal();
  }

  showTosModal() {
    this.modalService.showTosModal();
  }
}
