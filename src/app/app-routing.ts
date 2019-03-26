import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';

import { LoginComponent }      from './pages/login/login.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'pages', loadChildren:'app/pages/pages.module#PagesModule' },
  { path: 'login', component: LoginComponent } 
];




export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    useHash: true
});
