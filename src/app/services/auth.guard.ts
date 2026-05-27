import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await authService.getUser();

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};