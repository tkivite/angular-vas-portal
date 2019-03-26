import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
export const routes = [
  { path: '', component: ChangePasswordComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
