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
    path: 'feasibility-user',
    loadChildren: () => import('./modules/feasibility-analyst/feasibility-analyst.module').then(m => m.FeasibilityModule)
  },
  {
    path: 'feasibility-manager',
    loadChildren: () => import('./modules/feasibility-manager/feasibility-manager.module').then(m => m.FeasibilityManagerModule)
  },
  {
    path: 'project-manager',
    loadChildren: () => import('./modules/Project-Manager/Project-Manager.module').then(m => m.ProjectManagerModule)
  },
  {
    path: 'project-coordinator',
    loadChildren: () => import('./modules/project-co-ordinator/project-co-ordinator.module').then(m => m.ProjectCoOrdinatorModule)
  },
  {
    path: 'uk-writer',
    loadChildren: () => import('./modules/uk-writer/uk-writer.module').then(m => m.UkWriterModule)
  },
  {
    path: 'bid-submission',
    loadChildren: () => import('./modules/bid-submission/bid-submission.module').then(m => m.BidSubmissionModule)
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./modules/super-admin/super-admin.module').then(m => m.SuperAdminModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./modules/user-profile/user-profile.module').then(m => m.UserProfileModule)
  },
  {
    path: 'process-manager',
    loadChildren: () => import('./modules/process-manager-admin/process-manager-admin.module').then(m => m.ProcessManagerAdminModule)
  },
  {
    path: 'sales-manager',
    loadChildren: () => import('./modules/sales-manager/sales-manager.module').then(m => m.SalesManagerModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
