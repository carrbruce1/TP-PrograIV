import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { AboutComponent } from './components/pages/about/about.component';
import { JokersTrapComponent } from './juegos/jokers-trap/jokers-trap.component';
import { AhorcadoComponent } from './juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './juegos/preguntados/preguntados.component';


export const routes: Routes = [
    {
        path: " ",
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    //Inicio juegos >-<
    {
        path: 'ahorcado',
        component: AhorcadoComponent,
    },
    {
        path: 'mayor-menor',
        component: MayorMenorComponent,
    },
    {
        path: 'preguntados',
        component: PreguntadosComponent,
    },
    {
        path: 'jokers-trap',
        component: JokersTrapComponent,
    },
    // Fin juegos
    { 
        path: '**',
        
        redirectTo: 'home' 
    },
];
