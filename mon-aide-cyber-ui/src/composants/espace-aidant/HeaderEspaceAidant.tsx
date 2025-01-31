import { HeaderAidant } from '../layout/HeaderAidant.tsx';
import { LienMAC } from '../LienMAC.tsx';
import { ROUTE_MON_ESPACE } from '../../domaine/MoteurDeLiens.ts';

export const HeaderEspaceAidant = () => (
  <HeaderAidant
    lienMAC={
      <LienMAC
        titre="Mon espace - MonAideCyber"
        route={`${ROUTE_MON_ESPACE}/tableau-de-bord`}
      />
    }
  />
);
