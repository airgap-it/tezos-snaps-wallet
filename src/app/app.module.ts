import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CollapsableJsonComponent } from './collapsable-json/collapsable-json.component';

import { DirectivesModule } from './directives/directives.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountsOverviewComponent } from './components/accounts-overview/accounts-overview.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HeaderItemComponent } from './header-item/header-item.component';
import { NodeSelectorModalComponent } from './components/node-selector-modal/node-selector-modal.component';
import { HowToModalComponent } from './components/how-to-modal/how-to-modal.component';
import { AccountsSelectionComponent } from './components/accounts-selection/accounts-selection.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CollapsableJsonComponent,
    AccountsOverviewComponent,
    HeaderItemComponent,
    NodeSelectorModalComponent,
    HowToModalComponent,
    AccountsSelectionComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
