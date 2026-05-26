import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RankingPosicionComponent } from '../../../juegos/ranking-posiciones/ranking-posiciones.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, RankingPosicionComponent], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  titulo: string = 'Sala de Juegos'; 
  usuarioLogueado: any = null; 
  
  juegos = [
    { nombre: 'Ahorcado', ruta: '/ahorcado', icono: 'bi-alphabet-uppercase' },
    { nombre: 'Mayor o Menor', ruta: '/mayor-menor', icono: 'bi-controller' },
    { nombre: 'Preguntados', ruta: '/preguntados', icono: 'bi-question-circle' },
    { nombre: 'Joker Trap', ruta: '/jokers-trap', icono: 'bi-pinwheel' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
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