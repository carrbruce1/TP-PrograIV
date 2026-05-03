import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  titulo: string = 'Sala de Juegos - BC Casino'; 
  
  // Una lista de los juegos que vas a tener (útil para generar el menú con un *ngFor)
  juegos = [
    { nombre: 'Ahorcado', ruta: '/ahorcado', icono: 'bi-abc' },
    { nombre: 'Mayor o Menor', ruta: '/mayor-menor', icono: 'bi-card-list' },
    { nombre: 'Preguntados', ruta: '/preguntados', icono: 'bi-question-circle' },
    { nombre: 'Ruleta', ruta: '/ruleta', icono: 'bi-gear' } // Tu juego propio
  ];
}