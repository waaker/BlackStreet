import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, data: { requiresAdmin: true }, canActivate: [ AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, data: { requiresLogin: true }, canActivate: [ AuthGuardService] },
  { path: 'login', component: LoginComponent, data: { requiresLogout: true }, canActivate: [ AuthGuardService ] },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
