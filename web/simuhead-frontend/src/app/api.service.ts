import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  instancesList() {
    return this.httpClient.get<Instance[]>('http://127.0.0.1:8000');
  }
}

export interface Instance {
  name: string;
  port: number;
  revision: number;
  lang: string;
}
