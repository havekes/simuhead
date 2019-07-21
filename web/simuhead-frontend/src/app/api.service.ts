import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  instancesUrl = 'http://127.0.0.1:8000/instances/';
  paksUrl = 'http://127.0.0.1:8000/paks/';
  savesUrl = 'http://127.0.0.1:8000/saves/';

  constructor(private httpClient: HttpClient) {
  }

  instancesList() {
    return this.httpClient.get<Instance[]>(this.instancesUrl, httpOptions);
  }

  instanceSave(instance: Instance) {
    return this.httpClient.put<Instance>(this.instancesUrl + instance, instance, httpOptions);
  }

  paksList() {
    return this.httpClient.get<Pak[]>(this.paksUrl, httpOptions);
  }

  savesList() {
    return this.httpClient.get<Save[]>(this.savesUrl, httpOptions);
  }
}

export interface Instance {
  name: string;
  port: number;
  revision: number;
  lang: string;
  statusCode?: number;
}

interface File {
  name: string;
  version: string;
  url: string;
}

export interface Pak extends File {}
export interface Save extends File {}
