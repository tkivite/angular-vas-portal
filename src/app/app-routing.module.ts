import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { SalesComponent } from "./pages/sales/sales.component";
import { ShoppersComponent } from "./pages/supermarkets/shoppers.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { NotificationsComponent } from "./pages/notifications/notifications.component";
import { CollectionsComponent } from "./pages/collections/collections.component";
import { ReleasedComponent } from "./pages/released/released.component";
import { PaymentsComponent } from "./pages/payments/payments.component";
import { DeliveriesComponent } from "./pages/deliveries/deliveries.component";
import { MyaccountComponent } from "./pages/myaccount/myaccount.component";
import { InvoicingComponent } from "./pages/invoicing/invoicing.component";
import { CreateInvoiceComponent } from "./pages/invoicing/create/create.component";
import { ViewInvoiceComponent } from "./pages/invoicing/view/view.component";

import { PartnerComponent } from "./pages/partners/partners.component";
import { CreateBeComponent } from "./pages/partners/create/create.component";
import { UpdateBeComponent } from "./pages/partners/update/update.component";
import { ViewBeComponent } from "./pages/partners/view/view.component";

import { StoreComponent } from "./pages/stores/store.component";
import { CreateStoreComponent } from "./pages/stores/create/create.component";
import { UpdateStoreComponent } from "./pages/stores/update/update.component";
import { PendingComponent } from "./pages/pending/pending.component";
import { AuthGuard } from "./guards";
import { LoginComponent } from "./pages/login/login.component";
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
import { OnboardingComponent } from "./pages/onboarding/onboarding.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "onboarding",
    component: OnboardingComponent,
    children: [
      { path: "", component: DashboardComponent },
      { path: "partners", component: PartnerComponent },
      { path: "partners/create", component: CreateBeComponent },
      { path: "partners/update", component: UpdateBeComponent },
      { path: "partners/view", component: ViewBeComponent },
      { path: "stores", component: StoreComponent },
      { path: "stores/create", component: CreateStoreComponent },
      { path: "stores/update", component: UpdateStoreComponent },
      { path: "users", component: UsersComponent },
      { path: "lipalater-users", component: LipalaterUsersComponent }
    ]
  },
  { path: "register", component: CreateUserComponent },
  { path: "changepassword", component: ChangePasswordComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent },

  { path: "sales", component: SalesComponent },
  { path: "shoppers", component: ShoppersComponent },
  { path: "pending", component: PendingComponent },

  { path: "dashboard", component: DashboardComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "collections", component: CollectionsComponent },
  { path: "collections/create", component: PickupComponent },
  { path: "collections/lipalater", component: StaffPickupComponent },
  { path: "released", component: ReleasedComponent },
  { path: "payments", component: PaymentsComponent },
  { path: "users", component: UsersComponent },
  { path: "users/create", component: CreateUserComponent },
  { path: "users/update", component: UpdateUserComponent },

  { path: "lipalater-users", component: LipalaterUsersComponent },
  { path: "lipalater-users/create", component: CreateLipalaterUserComponent },
  { path: "lipalater-users/update", component: UpdateLipalaterUserComponent },

  { path: "deliveries", component: DeliveriesComponent },
  { path: "myaccount", component: MyaccountComponent },
  { path: "invoicing", component: InvoicingComponent },
  { path: "invoices/create", component: CreateInvoiceComponent },
  { path: "invoices/view", component: ViewInvoiceComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ], // Define Preloading Strategies
  exports: [RouterModule]
})
export class AppRoutingModule {}
