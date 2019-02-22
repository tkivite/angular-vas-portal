import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';

import { SweetAlertService } from 'angular-sweetalert-service';


import { AppRoutingModule } from './app-routing.module';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

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
import { HeaderComponent } from './theme/header/header.component';
import { FooterComponent } from './theme/footer/footer.component';
import { SidebarComponent } from './theme/sidebar/sidebar.component';
import { LoginComponent } from './pages/login/login.component';
import { BusinessentityComponent } from './pages/businessentity/businessentity.component';
import { CreateBeComponent } from './pages/businessentity/create/create.component';
import { UpdateComponent } from './pages/businessentity/update/update.component';
import { StoreComponent } from './pages/stores/store.component';
import { CreateStoreComponent }      from './pages/stores/create/create.component';

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
    InvoicingComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    BusinessentityComponent,
    CreateBeComponent,
    UpdateComponent,
    StoreComponent,
    CreateStoreComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    DataTablesModule,FormsModule, ReactiveFormsModule, 
    BlockUIModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    AppRoutingModule
  ],
  providers: [SweetAlertService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
