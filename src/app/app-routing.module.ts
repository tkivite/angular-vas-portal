import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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



const routes: Routes = [
{ path: 'sales', component: SalesComponent },
{ path: 'dashboard', component: DashboardComponent },
{ path: 'notifications', component: NotificationsComponent },
{ path: 'collections', component: CollectionsComponent },
{ path: 'released', component: ReleasedComponent },
{ path: 'payments', component: PaymentsComponent },
{ path: 'users', component: UsersComponent },
{ path: 'deliveries', component: DeliveriesComponent },
{ path: 'myaccount', component: MyaccountComponent },
{ path: 'invoicing', component: InvoicingComponent }

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
