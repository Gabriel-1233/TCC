
import { Routes } from '@angular/router';

// Páginas
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { QuemSomos } from './pages/quem-somos/quem-somos';
import { Cadastro } from './pages/cadastro/cadastro';
import { FormDoador } from './components/form-doador/form-doador';
import { FormOng } from './components/form-ong/form-ong';
import { Explorar } from './pages/explorar/explorar';
import { Termos } from './pages/termos-de-uso/termos-de-uso';
import { DashboardOng } from './pages/dashboard-ong/dashboard-ong';
import { DashboardDoador } from './pages/dashboard-doador/dashboard-doador';
import { Campanhas } from './pages/campanhas/campanhas';
import { PrivacyPoliticy } from './pages/privacy-politicy/privacy-politicy';
import { Perfil } from './pages/perfil/perfil';
import { CampanhasCards } from './components/cards/cards';
import { Doacao } from './pages/doacao/doacao';
import { NewCampaignDialog} from './components/new-campaign-dialog/new-campaign-dialog';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { EditProfile } from './components/editperfil/editperfil';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'quem-somos', component: QuemSomos },
  { path: 'cadastrar', component: Cadastro },
  { path: 'cadastrar-doador', component: FormDoador },
  { path: 'cadastrar-ong', component: FormOng },
  { path: 'explorar', component: Explorar },
  { path: 'termos-de-uso', component: Termos },
  { path: 'campanhas', component: Campanhas },
  { path: 'perfil', component: Perfil},
  { path: 'dashboard-doador', component: DashboardDoador},
  { path: 'dashboard-ong', component: DashboardOng},
  { path: 'policy-privacy', component: PrivacyPoliticy},
  { path: 'cards', component: CampanhasCards},
  { path:'doacao', component: Doacao},
  { path: 'new-campaign-dialog', component: NewCampaignDialog},
  { path: 'edit-perfil', component: EditProfile},
  { path: 'confirm-dialog', component: ConfirmDialog},  // Rota coringa
  { path: '**', redirectTo: 'home' }
];
