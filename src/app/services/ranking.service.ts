import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

async guardarPuntaje(nombreUsuario: string, puntos: number, nombreJuego: string) {
  const { data, error } = await this.supabase
    .from('ranking')
    .insert([
      { 
        usuario: nombreUsuario, 
        puntaje: puntos, 
        juego: nombreJuego,
      }
    ]);

  if (error) {
    console.error('Error al guardar el puntaje en Supabase:', error);
  } else {
    console.log('¡Puntaje guardado con éxito!', data);
  }
}
  async obtenerRankingPorJuego(nombreJuego: string) {
    const { data, error } = await this.supabase
      .from('ranking')
      .select('usuario, puntaje')
      .eq('juego', nombreJuego)
      .order('puntaje', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error al traer datos de la DB:', error);
      return [];
    }
    return data;
  }
}