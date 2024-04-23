import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './utility/shared/shared.module';
import { BOSUserModule } from './modules/bos-user/bos-user.module';
import { ResetPasswordComponent } from './utility/shared/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './utility/shared/components/forgot-password/forgot-password.component';
import { LoginComponent } from './utility/shared/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { APIInterceptor } from './utility/interceptor/ApiInterceptor';
import { SupplierDashboardComponent } from './modules/supplier-admin/supplier-dashboard/supplier-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SupplierDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BOSUserModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass:APIInterceptor,
    multi: true
}],
  bootstrap: [AppComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
