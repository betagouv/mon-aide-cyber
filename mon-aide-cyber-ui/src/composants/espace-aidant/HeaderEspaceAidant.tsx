import { Header } from '../Header.tsx';
import { LienMAC } from '../LienMAC.tsx';

export const HeaderEspaceAidant = () => (
  <Header
    lienMAC={
      <LienMAC titre="Espace Aidant - MonAideCyber" route="/tableau-de-bord" />
    }
  />
);
