import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  title = 'aad-auth';
   loggedIn = false;
   isIframe = false;
   loginDisplay = false;
   profileData?: MicrosoftGraph.User
   orderData?: string[];

   constructor(
    private authService: MsalService, 
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private client: HttpClient) {}
    private readonly _destroying$ = new Subject<void>();

//   ngOnInit(): void {
//     this.checkAccount();
// // debugger;
//     // this.msalBroadcastService.inProgress$
//     // .pipe(
//     //   filter((status: InteractionStatus) => status === InteractionStatus.None),
//     //   //takeUntil(this._destroying$)
//     // ).subscribe(() => {
//     //   this.authService.loginRedirect();
//     //   // this.checkAccount();
//     // })
//   }

ngOnInit(): void {
  debugger;
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        // this.authService.loginPopup();
        this.setLoginDisplay();
        // this.checkAccount();
      })
  }

  

  // checkAccount() {
  //   this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  // }

  // login() {
  //   this.authService
  //     .loginPopup()
  //     .subscribe((response: AuthenticationResult) => {
  //       this.authService.instance.setActiveAccount(response.account);
  //       // this.checkAccount();
  //       this.setLoginDisplay();
  //     });
  // }
  login() {
    debugger;
    console.log('login...');
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          console.log(result);
          this.setLoginDisplay();
        },
        error: (error) => console.log(error)
      });
  }

  logout() {
    this.authService.logout();
    
    // this.authService.logoutRedirect({
    //   postLogoutRedirectUri: 'http://localhost:4200'
    // })  
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getProfile() {
    this.client.get('https://graph.microsoft.com/v1.0/me')
        .subscribe(data => {
          console.log(data);
          this.profileData = data;
        })
  }

  getOrders() {
    this.client.get<string[]>('https://localhost:7235/Orders')
        .subscribe(data => {
          console.log(data);
          this.orderData = data;
        })
  }
}
