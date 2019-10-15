import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ApiInterceptor } from './api.interceptor';
import { ApiService } from './api.service';
import { LoginService } from './services/login.service';
import { MainService } from './services/main.service';
import { SharedModule } from '../shared/shared.module';
import { SocketService } from './socket.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true},
    ApiService,
    LoginService,
    MainService,
    SocketService
  ]
})
export class ApiModule {
  constructor(mainService: MainService) {
    mainService.init();
  }
}
