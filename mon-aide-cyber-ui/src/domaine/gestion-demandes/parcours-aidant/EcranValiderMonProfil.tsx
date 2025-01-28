import './ecran-demande-devenir-aidant.scss';
import React, { useCallback, useReducer } from 'react';
import { ChoixTypeAidant } from './choix-type-aidant/ChoixTypeAidant.tsx';
import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import { MoteurDeLiens, ROUTE_MON_ESPACE } from '../../MoteurDeLiens.ts';
import { useMutation } from '@tanstack/react-query';
import {
  CorpsValidationProfilAidant,
  entiteEnFonctionDuTypeAidant,
} from '../devenir-aidant/DevenirAidant.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { ValidationCharteEtCGU } from './validation-charte-et-cgu/ValidationCharteEtCGU.tsx';
import {
  choixTypeAidantFait,
  Etape,
  initialiseReducteur,
  reducteurEtapesValidationProfilAidant,
  retourEtapePrecedente,
  TypeAidantEtSonEntite,
} from '../../parcours-utilisation-service/parcours-validation-profil-aidant/reducteurEtapesValidationProfilAidant.ts';

export const EcranValiderMonProfil = () => {
  const navigationMAC = useNavigationMAC();
  const navigate = useNavigate();
  const macAPI = useMACAPI();

  const [etatEtapeCourante, envoie] = useReducer(
    reducteurEtapesValidationProfilAidant,
    {
      ...initialiseReducteur(),
      etapeCourante: 'choixTypeAidant',
    }
  );

  useRecupereContexteNavigation('valider-profil');

  const { mutate } = useMutation({
    mutationKey: ['valider-profil-aidant'],
    mutationFn: (corpsMutation: CorpsValidationProfilAidant) => {
      const actionSoumettre = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('valider-profil-aidant');

      if (!actionSoumettre)
        throw new Error(
          'Une erreur est survenue lors de la demande devenir aidant'
        );

      return macAPI.execute<void, void, CorpsValidationProfilAidant>(
        constructeurParametresAPI<CorpsValidationProfilAidant>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps(corpsMutation)
          .construis(),
        (corps) => corps
      );
    },
    onSuccess: () => {
      window.location.replace(ROUTE_MON_ESPACE + '/tableau-de-bord');
    },
  });

  const surClickChoixTypeAidant = useCallback(
    ({ typeAidant, entite }: TypeAidantEtSonEntite) => {
      envoie(
        choixTypeAidantFait({
          typeAidant,
          entite,
        })
      );
      window.scrollTo({ top: 0 });
    },
    []
  );

  const retourAuChoixUtilisation = () => {
    navigate(`${ROUTE_MON_ESPACE}/mon-utilisation-du-service`);
  };
  const surClickEtapePrecedente = useCallback(() => {
    envoie(retourEtapePrecedente());
    window.scrollTo({ top: 0 });
  }, []);

  const etapes: Map<Etape, React.ReactElement> = new Map([
    [
      'choixTypeAidant',
      <ChoixTypeAidant
        key="choixTypeAidant"
        typeAidant={etatEtapeCourante.demande?.type}
        surClick={surClickChoixTypeAidant}
        precedent={retourAuChoixUtilisation}
      />,
    ],
    [
      'validationCharteEtCGU',
      <ValidationCharteEtCGU
        key="validationCharteEtCGU"
        surValidation={() => {
          const { typeAidant, entite: entiteDuFormulaire } =
            etatEtapeCourante.demande!.type;

          const entiteCorrespondante =
            entiteEnFonctionDuTypeAidant.get(typeAidant);

          mutate({
            signatureCharte: true,
            cguValidees: true,
            ...(entiteCorrespondante && {
              entite: entiteCorrespondante(
                entiteDuFormulaire?.nom,
                entiteDuFormulaire?.siret
              ),
            }),
          });
        }}
        precedent={surClickEtapePrecedente}
      />,
    ],
  ]);

  return (
    <main role="main" className="ecran-demande-devenir-aidant fond-clair-mac">
      {etapes.get(etatEtapeCourante.etapeCourante)}
    </main>
  );
};
