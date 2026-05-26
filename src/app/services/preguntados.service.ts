import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';

  constructor(private http: HttpClient) {}

  async obtenerPregunta(): Promise<any> {
    try {
      const respuesta: any = await firstValueFrom(this.http.get(this.apiUrl));
      
      if (respuesta && respuesta.results && respuesta.results.length > 0) {
        const item = respuesta.results[0];
        
        const opciones = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5);

        return {
          categoria: item.category,
          pregunta: item.question,
          opciones: opciones,
          correcta: item.correct_answer
        };
      }
    } catch (error) {
      console.error('Error al conectar con OpenTriviaDB:', error);
    }
    return null;
  }
}