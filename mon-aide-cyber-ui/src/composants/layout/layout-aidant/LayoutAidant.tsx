import { Outlet } from 'react-router-dom';
import { LienMAC } from '../../LienMAC';
import { FooterEspaceAidant } from '../../espace-aidant/FooterEspaceAidant';
import { HeaderAidant } from '../HeaderAidant';
import { Sidebar } from './sidebar/Sidebar';

export const LayoutAidant = () => {
  return (
    <div>
      <HeaderAidant
        lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />}
      />
      <main role="main" className="tableau-de-bord">
        <Sidebar />
        <Outlet />
      </main>
      <div className="separateur-footer w-100"></div>
      <FooterEspaceAidant />
    </div>
  );
};
