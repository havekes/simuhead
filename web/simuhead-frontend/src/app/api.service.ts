import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpDefaultOptions = {
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
    return this.httpClient.get<Instance[]>(this.instancesUrl, httpDefaultOptions);
  }
  instancePost(instanceData: FormData) {
    return this.httpClient.post(this.instancesUrl, instanceData, httpDefaultOptions);
  }
  instancePut(url: string, instanceData: FormData) {
    return this.httpClient.put(url, instanceData, httpDefaultOptions);
  }
  instanceDelete(instance: Instance) {
    return this.httpClient.delete(instance.url, httpDefaultOptions);
  }

  paksList() {
    return this.httpClient.get<FileInfo[]>(this.paksUrl, httpDefaultOptions);
  }
  pakPost(pakData: FormData) {
    // Not a JSON request
    return this.httpClient.post(this.paksUrl, pakData);
  }
  pakDelete(pak: FileInfo) {
    return this.httpClient.delete(pak.url, httpDefaultOptions);
  }

  savesList() {
    return this.httpClient.get<FileInfo[]>(this.savesUrl, httpDefaultOptions);
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
