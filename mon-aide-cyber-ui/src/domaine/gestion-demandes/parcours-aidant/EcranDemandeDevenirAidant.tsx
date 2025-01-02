import './ecran-demande-devenir-aidant.scss';
import React, { useCallback, useEffect, useReducer } from 'react';
import {
  choixTypeAidantFait,
  choixUtilisationFaite,
  Etape,
  initialiseReducteur,
  reducteurEtapes,
  retourEtapePrecedente,
  TypeAidantEtSonEntreprise,
} from './reducteurEtapes.ts';
import { ChoixUtilisation, Utilisation } from './ChoixUtilisation.tsx';
import { ChoixTypeAidant } from './ChoixTypeAidant.tsx';
import { ReponseHATEOAS } from '../../Lien.ts';
import { useContexteNavigation } from '../../../hooks/useContexteNavigation.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';

export const EcranDemandeDevenirAidant = () => {
  const [etatEtapeCourante, envoie] = useReducer(
    reducteurEtapes,
    initialiseReducteur()
  );
  const navigationMAC = useNavigationMAC();
  const navigationUtilisateur = useContexteNavigation(useMACAPI());

  useEffect(() => {
    navigationUtilisateur
      .recupereContexteNavigation({
        contexte: 'demande-devenir-aidant:demande-devenir-aidant',
      })
      .then((reponse) =>
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens)
      )
      .catch();
  }, []);

  const surClickChoixUtilisation = useCallback((choix: Utilisation) => {
    envoie(choixUtilisationFaite(choix));
  }, []);

  const surClickChoixTypeAidant = useCallback(
    ({ typeAidant, entreprise }: TypeAidantEtSonEntreprise) => {
      envoie(
        choixTypeAidantFait({
          typeAidant,
          entreprise,
        })
      );
    },
    []
  );

  console.log('ETAT', etatEtapeCourante);

  const etapes: Map<Etape, React.ReactElement> = new Map([
    [
      'choixUtilisation',
      <ChoixUtilisation
        key="choixUtilisation"
        surClick={surClickChoixUtilisation}
      />,
    ],
    [
      'choixTypeAidant',
      <ChoixTypeAidant
        key="choixTypeAidant"
        typeAidant={etatEtapeCourante.demande?.type}
        surClick={surClickChoixTypeAidant}
        precedent={() => envoie(retourEtapePrecedente())}
      />,
    ],
  ]);

  return (
    <main role="main" className="ecran-demande-devenir-aidant fond-clair-mac">
      {etapes.get(etatEtapeCourante.etapeCourante)}
    </main>
  );
};
