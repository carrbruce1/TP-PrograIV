// import { Component, OnInit } from '@angular/core';
// import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
// import { CommonModule } from '@angular/common'; 
// import { AuthService } from './services/auth.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css' // O .scss, según uses
// })
// export class AppComponent implements OnInit {
//   usuarioLogueado: any = null;

//   constructor(private authService: AuthService, private router: Router) {}

//   async ngOnInit() {
//     // Al cargar la app, le pedimos a Supabase el usuario actual
//     this.usuarioLogueado = await this.authService.getUser();
//   }

//   async logout() {
//     await this.authService.signOut();
//     this.usuarioLogueado = null; 
//     window.location.href = '/login'; 
//   }
// }

import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarioLogueado: any = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.usuarioLogueado = await this.authService.getUser();
  }

  async logout() {
    await this.authService.signOut();
    this.usuarioLogueado = null;
    window.location.href = '/home';
  }
}