import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; 
import { ChatGeneralComponent } from './chat-general/chat-general.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatGeneralComponent],
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