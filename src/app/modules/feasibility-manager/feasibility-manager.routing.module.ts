import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeasibilityManagerComponent } from './feasibility-manager.component';

const routes: Routes = [
    {
        path: '',
        component: FeasibilityManagerComponent,
        children: []
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FeasibilityManagerRoutingModule { }
