import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  async ping(): Promise<any> {
    return this.httpClient.get('127.0.0.1:8000').toPromise();
  }
}
