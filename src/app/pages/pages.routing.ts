import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SalesComponent }      from './sales/sales.component';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { NotificationsComponent }      from './notifications/notifications.component';
import { CollectionsComponent }      from './collections/collections.component';
import { ReleasedComponent }      from './released/released.component';
import { PaymentsComponent }      from './payments/payments.component';
import { UsersComponent }      from './users/users.component';
import { DeliveriesComponent }      from './deliveries/deliveries.component';
import { MyaccountComponent }      from './myaccount/myaccount.component';
import { InvoicingComponent }      from './invoicing/invoicing.component';
import { BusinessentityComponent }      from './businessentity/businessentity.component';
import { CreateBeComponent }      from './businessentity/create/create.component';
import { UpdateBeComponent }      from './businessentity/update/update.component';
import { StoreComponent }      from './stores/store.component';
import { CreateStoreComponent }      from './stores/create/create.component';
import { UpdateStoreComponent }      from './stores/update/update.component';
import { PendingComponent }      from './pending/pending.component';
import { AuthGuard } from '../guards';
import { LoginComponent }      from './login/login.component';
import { CreateUserComponent }      from './users/create/create.component';
import { UpdateUserComponent }      from './users/update/update.component';
import { PagesComponent }      from './pages.component';


export const routes: Routes = [
//{ path: '', component: LoginComponent },
  { path: '', component: PagesComponent, children: [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
  { path: 'invoicing', component: InvoicingComponent } ] }

    ];
    export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true
  });
  