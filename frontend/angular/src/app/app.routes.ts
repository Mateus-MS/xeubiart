import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Xeubiart | Painel de administrador',
    },
    {
        path: 'tools/stencil-optimizer',
        loadComponent: () => import('./pages/tools/stencil-optimizer/stencil-optimizer').then(m => m.StencilOptimizer),
    },
];
