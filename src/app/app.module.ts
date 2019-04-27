import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BsDropdownModule } from "ngx-bootstrap";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { HttpClientModule } from "@angular/common/http";

import { ConfirmationDialogComponent } from "./services/confirmation-dialog/confirmation-dialog.component";
import { ConfirmationDialogService } from "./services/confirmation-dialog/confirmation-dialog.service";

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { PasswordStrengthMeterModule } from "angular-password-strength-meter";

import { AppRoutingModule } from "./app-routing.module";
import { BlockUIModule } from "ng-block-ui";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { DatePipe } from "@angular/common";

import { AlertComponent } from "./components";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SalesComponent } from "./pages/sales/sales.component";
import { NotificationsComponent } from "./pages/notifications/notifications.component";
import { CollectionsComponent } from "./pages/collections/collections.component";
import { ReleasedComponent } from "./pages/released/released.component";
import { MyaccountComponent } from "./pages/myaccount/myaccount.component";
import { PaymentsComponent } from "./pages/payments/payments.component";
import { DeliveriesComponent } from "./pages/deliveries/deliveries.component";
import { InvoicingComponent } from "./pages/invoicing/invoicing.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { LoginComponent } from "./pages/login/login.component";
import { PartnerComponent } from "./pages/partners/partners.component";
import { CreateBeComponent } from "./pages/partners/create/create.component";
import { UpdateBeComponent } from "./pages/partners/update/update.component";
import { StoreComponent } from "./pages/stores/store.component";
import { CreateStoreComponent } from "./pages/stores/create/create.component";
import { UpdateStoreComponent } from "./pages/stores/update/update.component";
import { PendingComponent } from "./pages/pending/pending.component";
import { ApiService } from "./services/api.service";
import { HomeComponent } from "./pages/home/home.component";
import { UsersComponent } from "./pages/users/users.component";
import { CreateUserComponent } from "./pages/users/create/create.component";
import { UpdateUserComponent } from "./pages/users/update/update.component";

import { LipalaterUsersComponent } from "./pages/internal-users/lipalater-users.component";
import { CreateLipalaterUserComponent } from "./pages/internal-users/create/create.component";
import { UpdateLipalaterUserComponent } from "./pages/internal-users/update/update.component";

import { ChangePasswordComponent } from "./pages/change-password/change-password.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { PickupComponent } from "./pages/collections/create/pickup.component";
import { StaffPickupComponent } from "./pages/collections/lipalater/pickup.component";

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
    LipalaterUsersComponent,
    InvoicingComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    PartnerComponent,
    CreateBeComponent,
    UpdateBeComponent,
    StoreComponent,
    CreateStoreComponent,
    UpdateStoreComponent,
    PendingComponent,
    CreateUserComponent,
    AlertComponent,
    HomeComponent,
    UpdateLipalaterUserComponent,
    UpdateUserComponent,
    CreateLipalaterUserComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    PickupComponent,
    StaffPickupComponent,

    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    PasswordStrengthMeterModule,
    AngularFontAwesomeModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    AppRoutingModule
  ],
  providers: [
    DatePipe,
    ApiService,
    ConfirmationDialogService
    //  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class AppModule {}
