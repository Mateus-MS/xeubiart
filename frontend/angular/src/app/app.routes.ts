import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
    },
];
