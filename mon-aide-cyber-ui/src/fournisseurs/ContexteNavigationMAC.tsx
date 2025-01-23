import { Action, Lien, Liens } from '../domaine/Lien.ts';
import { createContext, PropsWithChildren, useState } from 'react';
import { MoteurDeLiens } from '../domaine/MoteurDeLiens.ts';
import { useNavigate } from 'react-router-dom';
import { UUID } from '../types/Types.ts';
import { useNavigationMAC } from './hooks.ts';

type ContexteNavigationMACType = {
  ajouteEtat(liens: Liens): void;
  etat: Liens;
  setEtat: (liens: Liens) => void;
  navigue: (route: string, liens: Liens, exclusion?: Action[]) => void;
  retourAccueil: () => void;
};
export const ContexteNavigationMAC = createContext<ContexteNavigationMACType>({
  etat: [],
} as unknown as ContexteNavigationMACType);
export const FournisseurNavigationMAC = ({ children }: PropsWithChildren) => {
  const [etat, setEtat] = useState<Liens>({});
  const navigate = useNavigate();

  const navigue = (route: string, liens: Liens, exclusion?: Action[]) => {
    navigate(route);
    setEtat(extrais(liens, exclusion));
  };

  const extrais = (liens: Liens, exclusion?: (Action | string)[]): Liens => {
    return Object.entries(liens)
      .filter(([lien]) => !exclusion?.includes(lien))
      .reduce(
        (accumulateur, [action, lien]) => ({
          ...accumulateur,
          [action]: lien,
        }),
        {}
      );
  };

  const retourAccueil = () => window.location.replace('/');

  const ajouteEtat = (liens: Liens) => {
    setEtat((prev) => ({ ...prev, ...liens }));
  };

  return (
    <ContexteNavigationMAC.Provider
      value={{
        ajouteEtat,
        etat,
        setEtat,
        navigue,
        retourAccueil,
      }}
    >
      {children}
    </ContexteNavigationMAC.Provider>
  );
};

export const useNavigueVersLaRestitution = (
  route: '/mon-espace/diagnostic' | '/diagnostic'
) => {
  const navigate = useNavigate();
  const navigationMAC = useNavigationMAC();
  const navigue = (idDiagnostic: UUID) => {
    const peutAfficherDiagnostic = new MoteurDeLiens(navigationMAC.etat).existe(
      `afficher-diagnostic-${idDiagnostic}`
    );

    if (peutAfficherDiagnostic) {
      const routeVersDiag = `${route}/${idDiagnostic}/restitution`;
      navigate(routeVersDiag);
    }
  };
  return {
    navigue,
  };
};

export const useNavigueVersModifierDiagnostic = (
  route: '/mon-espace/diagnostic' | '/diagnostic'
) => {
  const navigate = useNavigate();
  const navigationMAC = useNavigationMAC();
  const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);

  const navigue = (lien: Lien) => {
    const idDiagnostic = lien.url.split('/').at(-1);

    const existe = moteurDeLiens.existe('modifier-diagnostic');
    if (!existe) {
      navigationMAC.ajouteEtat({
        'modifier-diagnostic': {
          url: lien.url,
          methode: 'GET',
        },
      });
    }

    const routeVersDiag = `${route}/${idDiagnostic}`;
    navigate(routeVersDiag);
  };
  return {
    navigue,
  };
};
