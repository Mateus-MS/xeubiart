import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
    {
        path: 'admin/dashboard',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Xeubiart | Painel de administrador',
    },
    {
        path: 'admin/login',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/login/login').then(m => m.Login),
        title: 'Xeubiart | Login como administrador',
    },
    {
        path: 'tools/stencil-optimizer',
        loadComponent: () => import('./pages/tools/stencil-optimizer/stencil-optimizer').then(m => m.StencilOptimizer),
    },
    {
        path: 'tools/multipage-stencil',
        loadComponent: () => import('./pages/tools/multipage-stencil/multipage-stencil').then(m => m.MultipageStencil),
    },
];
