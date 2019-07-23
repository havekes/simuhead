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
  instancePost(instanceData: FormData) {
    return this.httpClient.post(this.instancesUrl, instanceData, httpOptions);
  }
  instancePut(url: string, instanceData: FormData) {
    return this.httpClient.put(url, instanceData, httpOptions);
  }
  instanceDelete(instance: Instance) {
    return this.httpClient.delete(instance.url, httpOptions);
  }

  paksList() {
    return this.httpClient.get<FileInfo[]>(this.paksUrl, httpOptions);
  }
  pakPost(pakData: FormData) {
    return this.httpClient.post(this.paksUrl, pakData, httpOptions);
  }

  savesList() {
    return this.httpClient.get<FileInfo[]>(this.savesUrl, httpOptions);
  }
}

export interface Instance {
  name: string;
  port: number;
  revision: number;
  lang: string;
  statusCode?: number;
  url?: string;
}

export interface FileInfo {
  name: string;
  version: string;
  file?: File;
  url?: string;
}
