import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './utility/shared/shared.module';
import { BOSUserModule } from './modules/bos-user/bos-user.module';
import { ResetPasswordComponent } from './utility/shared/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './utility/shared/components/forgot-password/forgot-password.component';
import { LoginComponent } from './utility/shared/components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BOSUserModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
