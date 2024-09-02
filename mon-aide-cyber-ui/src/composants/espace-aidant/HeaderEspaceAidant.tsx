import { HeaderAidant } from '../layout/HeaderAidant.tsx';
import { LienMAC } from '../LienMAC.tsx';

export const HeaderEspaceAidant = () => (
  <HeaderAidant
    lienMAC={
      <LienMAC titre="Espace Aidant - MonAideCyber" route="/tableau-de-bord" />
    }
  />
);
