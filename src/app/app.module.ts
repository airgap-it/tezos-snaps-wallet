import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';

import { HttpClientModule } from '@angular/common/http';
import { CollapsableJsonComponent } from './components/collapsable-json/collapsable-json.component';

import { DirectivesModule } from './directives/directives.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountsOverviewComponent } from './components/accounts-overview/accounts-overview.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HeaderItemComponent } from './components/header-item/header-item.component';
import { NodeSelectorModalComponent } from './modals/node-selector-modal/node-selector-modal.component';
import { HowToModalComponent } from './modals/how-to-modal/how-to-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LoadingModalComponent } from './modals/loading-modal/loading-modal.component';
import { AccountComponent } from './components/account/account.component';
import { OperationsComponent } from './components/operations/operations.component';
import { PermissionModalComponent } from './modals/permission-modal/permission-modal.component';
import { OperationModalComponent } from './modals/operation-modal/operation-modal.component';
import { SignPayloadModalComponent } from './modals/sign-payload-modal/sign-payload-modal.component';
import { NotConnectedModalComponent } from './modals/not-connected-modal/not-connected-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { TextModalComponent } from './modals/text-modal/text-modal.component';
import { NftListComponent } from './components/nft-list/nft-list.component';
import { LandingComponent } from './components/landing/landing.component';
import { QrModalComponent } from './modals/qr-modal/qr-modal.component';
import { SendTezModalComponent } from './modals/send-tez-modal/send-tez-modal.component';
import { ConnectedModalComponent } from './modals/connected-modal/connected-modal.component';
import { SendNftModalComponent } from './modals/send-nft-modal/send-nft-modal.component';
import { ConfirmTxModalComponent } from './modals/confirm-tx-modal/confirm-tx-modal.component';
import { TxConfirmedModalComponent } from './modals/tx-confirmed-modal/tx-confirmed-modal.component';
import { ShortenStringPipe } from './pipes/shorten-string.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CollapsableJsonComponent,
    AccountsOverviewComponent,
    HeaderItemComponent,
    NodeSelectorModalComponent,
    HowToModalComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    AccountComponent,
    OperationsComponent,
    PermissionModalComponent,
    OperationModalComponent,
    SignPayloadModalComponent,
    NotConnectedModalComponent,
    FooterComponent,
    TextModalComponent,
    NftListComponent,
    LandingComponent,
    QrModalComponent,
    SendTezModalComponent,
    ConnectedModalComponent,
    SendNftModalComponent,
    ConfirmTxModalComponent,
    TxConfirmedModalComponent,
    ShortenStringPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DirectivesModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
