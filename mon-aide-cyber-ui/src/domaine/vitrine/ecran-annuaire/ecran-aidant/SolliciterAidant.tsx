import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation';
import { Departement } from '../../../gestion-demandes/departement';
import { AidantAnnuaire } from '../AidantAnnuaire';
import { Confirmation } from '../../../../composants/gestion-demandes/etre-aide/Confirmation.tsx';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { reducteurDemandeEtreAide } from '../../../../composants/gestion-demandes/etre-aide/reducteurDemandeEtreAide.ts';
import { useMutation } from '@tanstack/react-query';
import {
  CorpsDemandeEtreAide,
  ReponseDemandeEtreAide,
} from '../../../gestion-demandes/etre-aide/EtreAide.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { FormulaireSolliciterAidant } from './FormulaireSolliciterAidant.tsx';

export const SolliciterAidant = ({
  aidant,
  nomDepartement,
}: {
  aidant: AidantAnnuaire;
  nomDepartement: string;
}) => {
  useRecupereContexteNavigation('demande-etre-aide');
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  const [etat, envoie] = useReducer(reducteurDemandeEtreAide, {
    etapeCourante: 'saisieInformations',
  });

  const [
    demandeEtreAideEnCoursDeChargement,
    setDemandeEtreAideEnCoursDeChargement,
  ] = useState(true);

  const [referentielDepartements, setReferentielDepartements] = useState<
    Departement[] | undefined
  >();

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'demande-etre-aide',
      (lien) => {
        if (demandeEtreAideEnCoursDeChargement) {
          macAPI
            .execute<ReponseDemandeEtreAide, ReponseDemandeEtreAide>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (corps) => corps
            )
            .then((reponse) => {
              setReferentielDepartements(reponse.departements);
              navigationMAC.ajouteEtat(reponse.liens);
              setDemandeEtreAideEnCoursDeChargement(false);
            })
            .catch(() => {
              setDemandeEtreAideEnCoursDeChargement(false);
            });
        }
      }
    );
  }, [demandeEtreAideEnCoursDeChargement, navigationMAC.etat]);

  const { mutate: soumettreFormulaire, isPending: estEnTrainDeSoumettre } =
    useMutation({
      mutationKey: ['solliciter-aidant'],
      mutationFn: (demandeEtreAide: CorpsDemandeEtreAide) => {
        const actionSoumettre = new MoteurDeLiens(
          navigationMAC.etat
        ).trouveEtRenvoie('demander-aide');

        return macAPI
          .execute<void, void, CorpsDemandeEtreAide>(
            {
              url: actionSoumettre.url,
              methode: actionSoumettre.methode!,
              corps: {
                cguValidees: demandeEtreAide.cguValidees,
                departement: demandeEtreAide.departement,
                email: demandeEtreAide.email,
                relationAidant: demandeEtreAide.relationAidant,
                ...(demandeEtreAide.raisonSociale && {
                  raisonSociale: demandeEtreAide.raisonSociale,
                }),
              },
            },
            (corps) => corps
          )
          .then((reponse) => reponse);
      },
    });

  const retourAccueil = useCallback(() => {
    navigationMAC.retourAccueil();
  }, [navigationMAC]);

  console.log(`<SolliciterAidant />`, { aidant });
  return (
    <div className="fr-grid-row fr-grid-row--center">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        {etat.etapeCourante === 'saisieInformations' && (
          <FormulaireSolliciterAidant
            departement={nomDepartement}
            aidant={aidant}
          />
        )}
        {etat.etapeCourante === 'confirmation' && (
          <Confirmation onClick={() => retourAccueil()} />
        )}
        {/*<div>{retourEnvoiDemandeEtreAide}</div>*/}
      </div>
    </div>
  );
};
