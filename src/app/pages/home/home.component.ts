// import { Component, OnInit } from '@angular/core'; // Sumamos OnInit
// import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; 
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service'; 

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   // IMPORTANTE: Sumamos CommonModule para usar el *ngIf en el HTML
//   imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], 
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css'
// })
// export class HomeComponent implements OnInit {
//   titulo: string = 'Sala de Juegos'; 
//   usuarioLogueado: any = null; // Variable para guardar al usuario
  
//   juegos = [
//     { nombre: 'Ahorcado', ruta: '/ahorcado', icono: 'bi-abc' },
//     { nombre: 'Mayor o Menor', ruta: '/mayor-menor', icono: 'bi-card-list' },
//     { nombre: 'Preguntados', ruta: '/preguntados', icono: 'bi-question-circle' },
//     { nombre: 'Ruleta', ruta: '/ruleta', icono: 'bi-gear' }
//   ];

//   constructor(private authService: AuthService, private router: Router) {}



//   async ngOnInit() {
//     // Al cargar la home, verificamos si hay alguien
//     this.usuarioLogueado = await this.authService.getUser();
//   }

//   async logout() {
//     await this.authService.signOut();
//     this.usuarioLogueado = null;
//     this.router.navigate(['/login']); // Al cerrar, volvemos al login
//   }



// }

import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  titulo: string = 'Sala de Juegos'; 
  usuarioLogueado: any = null; // La declaramos una sola vez aquí
  
  juegos = [
    { nombre: 'Ahorcado', ruta: '/ahorcado', icono: 'bi-alphabet-uppercase' },
    { nombre: 'Mayor o Menor', ruta: '/mayor-menor', icono: 'bi-controller' },
    { nombre: 'Preguntados', ruta: '/preguntados', icono: 'bi-question-circle' },
    { nombre: 'Ruleta', ruta: '/ruleta', icono: 'bi-pinwheel' }
  ];

  // Inyectamos el AuthService y el Router
  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
      // Intentamos obtener el usuario, pero si falla, igual mostramos los juegos
      this.usuarioLogueado = await this.authService.getUser();
    } catch (e) {
      this.usuarioLogueado = null;
    }
  }

  async logout() {
    await this.authService.signOut();
    this.usuarioLogueado = null;
    this.router.navigate(['/login']);
  }
}