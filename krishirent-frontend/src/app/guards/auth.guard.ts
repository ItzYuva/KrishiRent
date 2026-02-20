import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/equipment.model';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = auth.userRole();
    if (!userRole || !requiredRoles.includes(userRole)) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
