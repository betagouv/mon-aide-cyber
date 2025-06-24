import { useCallback, useEffect, useReducer } from 'react';
import {
  avancerEtapeSuivante,
  initialiseReducteur,
  reducteurMonEspaceDemandeDevenirAidant,
  retourEtapePrecedente,
} from '../../../gestion-demandes/parcours-aidant/reducteurMonEspaceDemandeDevenirAidant.ts';
import {
  choixTypeAidantFait,
  initialiseReducteurInformationsAidant,
  reducteurInformationsAidant,
  valideLaCharteAidant,
  videLesInformationsDuTypeAidant,
} from './reducteurInformationsAidant.ts';
import { InformationsTypeAidant } from './EcranMonEspaceDemandeDevenirAidant.tsx';

const useEcranMonEspaceDemandeDevenirAidant = () => {
  const [etatEtapeCourante, envoie] = useReducer(
    reducteurMonEspaceDemandeDevenirAidant,
    {
      ...initialiseReducteur(),
      etapeCourante: 'choixTypeAidant',
    }
  );

  const [etatInformationsAidant, envoieInformationsAidant] = useReducer(
    reducteurInformationsAidant,
    {
      ...initialiseReducteurInformationsAidant(),
    }
  );

  const surClickChoixTypeAidant = useCallback(
    ({ typeAidant, entite }: InformationsTypeAidant) => {
      envoieInformationsAidant(choixTypeAidantFait({ typeAidant, entite }));
    },
    [etatInformationsAidant.informations]
  );

  useEffect(() => {
    if (
      !etatInformationsAidant.informations.typeAidant &&
      !etatInformationsAidant.informations.entite
    ) {
      return;
    }

    envoie(avancerEtapeSuivante());
    window.scrollTo({ top: 0 });
  }, [
    etatInformationsAidant.informations.typeAidant,
    etatInformationsAidant.informations.entite,
  ]);

  const surSignatureCharteAidant = useCallback(
    () => envoieInformationsAidant(valideLaCharteAidant()),
    []
  );

  useEffect(() => {
    if (!etatInformationsAidant.informations.charteValidee) return;
    envoie(avancerEtapeSuivante());
    window.scrollTo({ top: 0 });
  }, [etatInformationsAidant.informations.charteValidee]);

  const surClickEtapePrecedente = useCallback(() => {
    if (etatEtapeCourante.etapeCourante === 'signatureCharteAidant') {
      envoieInformationsAidant(videLesInformationsDuTypeAidant());
    }
    envoie(retourEtapePrecedente());
    window.scrollTo({ top: 0 });
  }, [etatEtapeCourante.etapeCourante]);

  return {
    reducteurEtapesPourDevenirAidant: {
      etatEtapeCourante,
      declencheChangement: envoie,
    },
    reducteurInformationsAidant: {
      etatInformationsAidant,
      declencheChangement: envoieInformationsAidant,
    },
    surClickChoixTypeAidant,
    surSignatureCharteAidant,
    surClickEtapePrecedente,
  };
};
export default useEcranMonEspaceDemandeDevenirAidant;
