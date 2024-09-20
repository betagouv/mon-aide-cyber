import { HeaderAidant } from '../layout/HeaderAidant.tsx';
import { LienMAC } from '../LienMAC.tsx';
import { ROUTE_AIDANT } from '../../domaine/MoteurDeLiens.ts';

export const HeaderEspaceAidant = () => (
  <HeaderAidant
    lienMAC={
      <LienMAC
        titre="Espace Aidant - MonAideCyber"
        route={`${ROUTE_AIDANT}/tableau-de-bord`}
      />
    }
  />
);
