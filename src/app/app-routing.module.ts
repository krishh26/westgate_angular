import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './utility/shared/components/login/login.component';
import { ForgotPasswordComponent } from './utility/shared/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './utility/shared/components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'boss-user',
    loadChildren: () => import('./modules/bos-user/bos-user.module').then(m => m.BOSUserModule)
  },
  {
    path: 'supplier-admin',
    loadChildren: () => import('./modules/supplier-admin/supplier-admin.module').then(m => m.SupplierAdminModule)
  },
  {
    path: 'login',
    component : LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component : ResetPasswordComponent
  },
  {
    path: '**',
    pathMatch : 'full',
    redirectTo : 'login'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
