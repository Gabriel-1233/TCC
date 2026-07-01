import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];
  const userType = authService.getUserType();

  if (authService.isLoggedIn() && userType === requiredRole) {
    return true;
  }

  // Não autorizado - redirecionar para página inicial
  router.navigate(['/']);
  return false;
};
