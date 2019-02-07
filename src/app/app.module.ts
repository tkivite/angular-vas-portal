import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SalesComponent } from './pages/sales/sales.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { ReleasedComponent } from './pages/released/released.component';
import { MyaccountComponent } from './pages/myaccount/myaccount.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { UsersComponent } from './pages/users/users.component';
import { InvoicingComponent } from './pages/invoicing/invoicing.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SalesComponent,
    NotificationsComponent,
    CollectionsComponent,
    ReleasedComponent,
    MyaccountComponent,
    PaymentsComponent,
    DeliveriesComponent,
    UsersComponent,
    InvoicingComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AngularFontAwesomeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
