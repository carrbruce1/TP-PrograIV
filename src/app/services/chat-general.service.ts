import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; 
import { Subject, Observable } from 'rxjs';

export interface Mensaje {
  usuario: string;
  texto: string;
  hora: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabaseUrl = 'https://zvyfiagysolagmwbkgww.supabase.co'; 
  private supabaseKey = 'sb_publishable_Nm8RFtHZw2QlSFN-H4obLA_m4tIK2Il';
  private supabase: SupabaseClient;

  private mensajes: Mensaje[] = [];
  private mensajes$ = new Subject<Mensaje[]>();

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
    this.cargarMensajesIniciales();
    this.conectarTiempoReal();
  }

  getMensajesObservable(): Observable<Mensaje[]> {
    return this.mensajes$.asObservable();
  }

  async cargarMensajesIniciales() {
    try {
      const { data, error } = await this.supabase
        .from('mensaje-chat')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error cargando mensajes desde la BD:', error.message);
        return;
      }

      if (data) {
        this.mensajes = data.map((m: any) => ({
          usuario: m.usuario,
          texto: m.texto,
          hora: m.hora
        }));
        this.mensajes$.next([...this.mensajes]);
      }
    } catch (err) {
      console.error('Error inesperado en consulta inicial:', err);
    }
  }

  async agregarMensaje(usuario: string, texto: string) {
    const ahora = new Date();
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      const { error } = await this.supabase
        .from('mensaje-chat')
        .insert([
          { usuario: usuario, texto: texto, hora: horaFormateada }
        ]);

      if (error) {
        console.error('Supabase rechazó el insert:', error.message);
      }
    } catch (err) {
      console.error('Error inesperado al insertar:', err);
    }
  }

  private conectarTiempoReal() {
    this.supabase
      .channel('sala-general')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensaje-chat' },
        (payload: any) => {
          const nuevoMsg = payload.new;
          
          const yaExiste = this.mensajes.some(
            m => m.texto === nuevoMsg.texto && m.usuario === nuevoMsg.usuario && m.hora === nuevoMsg.hora
          );
          
          if (!yaExiste) {
            this.mensajes.push({
              usuario: nuevoMsg.usuario,
              texto: nuevoMsg.texto,
              hora: nuevoMsg.hora
            });
            this.mensajes$.next([...this.mensajes]);
          }
        }
      )
      .subscribe();
  }
}