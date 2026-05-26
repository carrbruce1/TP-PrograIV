import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingService } from '../../services/ranking.service'; 

@Component({
  selector: 'app-ranking-posiciones',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './ranking-posiciones.component.html',
  styleUrls: ['./ranking-posiciones.component.css']
})
export class RankingPosicionComponent implements OnInit {
  juegoActivo: string = 'ahorcado'; 
  listaRanking: any[] = [];
  cargando: boolean = false;

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    // Corregido a 'cambiarPestana' sin eñe
    this.cambiarPestana('ahorcado');
  }

  // Corregido el nombre a 'cambiarPestana' para que machee con el HTML
  async cambiarPestana(idJuego: string) {
    this.juegoActivo = idJuego;
    this.cargando = true;

    this.listaRanking = await this.rankingService.obtenerRankingPorJuego(idJuego);
    
    this.cargando = false;
  }
}