import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public supabase: SupabaseClient;

  constructor() {
  
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }


  async signIn(email: string, pass: string) {
    return await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
  }


  async signUp(email: string, pass: string, metadata: any) {
    return await this.supabase.auth.signUp({
      email: email,
      password: pass,
      options: {
        data: metadata 
      }
    });
  }

  
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return error;
  }

 
  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  
async guardarUsuarioEnTabla(userId: string, email: string, metadata: any) {
  return await this.supabase
    .from('user')
    .insert([{
      id: userId,
      email: email,
      nombre: metadata.nombre,
      apellido: metadata.apellido,
      edad: metadata.edad
    }]);
}

}

