import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  constructor(private http: HttpClient) { }

  public getRepositories(filter: string): Observable<any> {
    return this.http.get<any>(`https://api.github.com/search/repositories?q=${filter}`);
  }
}
