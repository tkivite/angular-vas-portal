import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';
import { SalesComponent }      from './pages/sales/sales.component';
import { DashboardComponent }      from './pages/dashboard/dashboard.component';
import { NotificationsComponent }      from './pages/notifications/notifications.component';
import { CollectionsComponent }      from './pages/collections/collections.component';
import { ReleasedComponent }      from './pages/released/released.component';
import { PaymentsComponent }      from './pages/payments/payments.component';
import { UsersComponent }      from './pages/users/users.component';
import { DeliveriesComponent }      from './pages/deliveries/deliveries.component';
import { MyaccountComponent }      from './pages/myaccount/myaccount.component';
import { InvoicingComponent }      from './pages/invoicing/invoicing.component';
import { BusinessentityComponent }      from './pages/businessentity/businessentity.component';
import { CreateBeComponent }      from './pages/businessentity/create/create.component';
import { UpdateBeComponent }      from './pages/businessentity/update/update.component';
import { StoreComponent }      from './pages/stores/store.component';
import { CreateStoreComponent }      from './pages/stores/create/create.component';
import { UpdateStoreComponent }      from './pages/stores/update/update.component';
import { PendingComponent }      from './pages/pending/pending.component';
import { AuthGuard } from './guards';
import { LoginComponent }      from './pages/login/login.component';
import { CreateUserComponent }      from './pages/users/create/create.component';
import { UpdateUserComponent }      from './pages/users/update/update.component';


const routes: Routes = [
//{ path: '', component: LoginComponent },
//{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: CreateUserComponent },

{ path: 'sales', component: SalesComponent },
{ path: 'pending', component: PendingComponent },
{ path: 'onboarding', component: BusinessentityComponent },
{ path: 'onboarding/create', component: CreateBeComponent },
{ path: 'onboarding/update', component: UpdateBeComponent },
{ path: 'stores', component: StoreComponent },
{ path: 'stores/create', component: CreateStoreComponent },
{ path: 'stores/update', component: UpdateStoreComponent },
{ path: 'dashboard', component: DashboardComponent },
{ path: 'notifications', component: NotificationsComponent },
{ path: 'collections', component: CollectionsComponent },
{ path: 'released', component: ReleasedComponent },
{ path: 'payments', component: PaymentsComponent },
{ path: 'users', component: UsersComponent },
{ path: 'users/create', component: CreateUserComponent },
{ path: 'users/update', component: UpdateUserComponent },
{ path: 'deliveries', component: DeliveriesComponent },
{ path: 'myaccount', component: MyaccountComponent },
{ path: 'invoicing', component: InvoicingComponent }

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })], // Define Preloading Strategies 
  exports: [RouterModule]
})
export class AppRoutingModule { }
