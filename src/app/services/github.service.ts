import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

 private apiUrl = 'https://api.github.com/users/carrbruce1';

  constructor(private http: HttpClient) {}

  getGithubProfile() {
    return this.http.get(this.apiUrl);
  }
}