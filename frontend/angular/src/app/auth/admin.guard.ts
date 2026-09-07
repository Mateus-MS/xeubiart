import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
    const http = inject(HttpClient);

    return http.get<{ role: string; email: string }>('/api/auth/me', {withCredentials: true}).pipe(
        map(response => {
            if (response.role === 'ROLE_ADMIN') {
                return true;
            }

            window.location.href = '/';
            return false;
        }),

        catchError(error => {
            if (error.status === 401) {
                window.location.href = '/admin/login';
                return of(false);
            }

            if (error.status === 403) {
                window.location.href = '/';
                return of(false);
            }

            return of(false);
        })
    );
};