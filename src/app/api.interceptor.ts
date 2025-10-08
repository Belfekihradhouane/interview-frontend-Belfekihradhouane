import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiUrls = [
      'http://localhost:8080/api/cities',
      'http://localhost:8080/api/cities/nearest'
    ];
    if (apiUrls.some(url => req.url.startsWith(url))) {
      // Exemple : log de la requête
      console.log('API Intercepted:', req.url);
      // Ici tu peux ajouter des headers ou autre traitement
      // const cloned = req.clone({ setHeaders: { 'Authorization': 'Bearer ...' } });
      // return next.handle(cloned);
    }
    return next.handle(req);
  }
}

