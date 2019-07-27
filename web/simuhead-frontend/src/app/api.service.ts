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

  private instancesUrl = 'http://127.0.0.1:8000/instances/';
  private paksUrl = 'http://127.0.0.1:8000/paks/';
  private savesUrl = 'http://127.0.0.1:8000/saves/';

  constructor(private httpClient: HttpClient) {
  }

  instancesList() {
    return this.httpClient.get<Instance[]>(this.instancesUrl, httpDefaultOptions);
  }

  instancePost(instance: Instance) {
    return this.httpClient.post(this.instancesUrl, instance, httpDefaultOptions);
  }

  instancePut(instance: Instance) {
    return this.httpClient.put(instance.url, instance, httpDefaultOptions);
  }

  instanceDelete(instance: Instance) {
    return this.httpClient.delete(instance.url, httpDefaultOptions);
  }

  instanceGet(instance: Instance) {
    return this.httpClient.get<Instance>(instance.url, httpDefaultOptions);
  }

  instanceStart(instance: Instance) {
    return this.httpClient.get<Instance>(instance.url + 'start/', httpDefaultOptions);
  }

  instanceInstall(instance: Instance) {
    return this.httpClient.get<Instance>(instance.url + 'install/', httpDefaultOptions);
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

  savePost(saveData: FormData) {
    // Not a JSON request
    return this.httpClient.post(this.savesUrl, saveData);
  }

  saveDelete(save: FileInfo) {
    return this.httpClient.delete(save.url, httpDefaultOptions);
  }

  fileInfoGet(url: string) {
    return this.httpClient.get<FileInfo>(url, httpDefaultOptions);
  }

  addPakInfo(instance) {
    this.fileInfoGet(<string>instance.pak).subscribe(pak => {
      instance.pak = pak;
    });
  }

  addSaveInfo(instance) {
    this.fileInfoGet(<string>instance.savegame).subscribe(savegame => {
      instance.savegame = savegame;
    });
  }
}

export interface Instance {
  url: string;
  name: string;
  port: number;
  revision: number;
  lang: string;
  debug: number;
  pak: string | FileInfo;
  savegame: string | FileInfo;
  status: number;
}

export enum InstanceStatusCode {
  WORKING = -1,
  RUNNING = 0,
  INSTALLED = 1,
  CONFIGURED = 2
}

export interface FileInfo {
  id: string;
  url: string;
  name: string;
  version: string;
  protected: boolean;
  file?: File;
}

export function sortFileInfo(a: FileInfo, b: FileInfo) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    if (a.version < b.version) {
      return 1;
    } else if (a.version > b.version) {
      return -1;
    } else {
      return 0;
    }
  }
}

export function errorMessage(err) {
  return 'HTTP ' + err.status + ' ' + err.statusText + ' : ' + err.error;
}
