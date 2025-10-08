import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CitiesService {
  private readonly baseUrl = '/api/cities';
  private readonly nearestUrl = '/api/cities/nearest';

  constructor(private http: HttpClient) {}

  getCities(params?: any): Observable<any> {
    return this.http.get<any>(this.baseUrl, { params });
  }

  getNearestCities(params?: any): Observable<any> {
    return this.http.get<any>(this.nearestUrl, { params });
  }
}
