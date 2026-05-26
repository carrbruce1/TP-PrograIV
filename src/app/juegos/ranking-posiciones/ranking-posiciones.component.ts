import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ranking-posiciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking-posiciones.component.html',
  styleUrl: './ranking-posiciones.component.css'
})
export class RankingPosicionesComponent implements OnInit {
  juegos = [
    { id: 'preguntados', nombre: '🎯 Preguntados' },
    { id: 'ahorcado', nombre: '🪓 Ahorcado' },
    { id: 'mayor_menor', nombre: '🃏 Mayor o Menor' },
    { id: 'joker_trap', nombre: '🤡 Joker Trap' }
  ];

  juegoActivo: string = 'preguntados';
  listaRanking: any[] = [];
  cargando: boolean = false;
  private supabase: any;

  constructor(private authService: AuthService) {
    this.supabase = (this.authService as any).supabase;
  }

  ngOnInit() {
    this.cambiarJuego(this.juegoActivo);
  }

  async cambiarJuego(idJuego: string) {
    this.juegoActivo = idJuego;
    this.listaRanking = [];
    if (!this.supabase) return;

    this.cargando = true;
    try {
      const { data, error } = await this.supabase
        .from(`ranking_${idJuego}`) 
        .select('usuario, puntaje, fecha')
        .order('puntaje', { ascending: false })
        .limit(10);

      if (error) throw error;
      this.listaRanking = data || [];
    } catch (err) {
      console.error(`Error al cargar ranking de ${idJuego}:`, err);
    } finally {
      this.cargando = false;
    }
  }
}