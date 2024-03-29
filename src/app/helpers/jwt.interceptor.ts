/*

    The JWT Interceptor intercepts http requests from the application to add a JWT auth token to the Authorization header if the user is logged in.

    It's implemented using the HttpInterceptor class that was introduced in Angular 4.3 as part of the new HttpClientModule. By extending the HttpInterceptor class you can create a custom interceptor to modify http requests before they get sent to the server.

    Http interceptors are added to the request pipeline in the providers section of the app.module.ts file.

*/

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.user_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Authorization ${currentUser.user_token}`
                }
            });
        }

        return next.handle(request);
    }
}