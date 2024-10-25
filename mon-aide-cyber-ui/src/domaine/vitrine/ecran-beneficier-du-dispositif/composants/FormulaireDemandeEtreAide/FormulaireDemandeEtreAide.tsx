import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Confirmation } from '../../../../../composants/gestion-demandes/etre-aide/Confirmation';
import { SaisieInformations } from '../../../../../composants/gestion-demandes/etre-aide/SaisieInformations';
import {
  confirmation,
  reducteurDemandeEtreAide,
  saisieInformationsEnErreur,
} from '../../../../../composants/gestion-demandes/etre-aide/reducteurDemandeEtreAide';
import { Lien } from '../../../../Lien';
import { Departement } from '../../../../gestion-demandes/departement';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks';
import { useMACAPI } from '../../../../../fournisseurs/api/useMACAPI';
import { MoteurDeLiens } from '../../../../MoteurDeLiens';
import {
  CorpsDemandeEtreAide,
  ReponseDemandeEtreAide,
} from '../../../../gestion-demandes/etre-aide/EtreAide';
import { constructeurParametresAPI } from '../../../../../fournisseurs/api/ConstructeurParametresAPI';
import { ChampsErreur } from '../../../../../composants/alertes/Erreurs';
import { useRecupereContexteNavigation } from '../../../../../hooks/useRecupereContexteNavigation.ts';

export const FormulaireDemandeEtreAide = () => {
  useRecupereContexteNavigation('demande-etre-aide');

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

  const [retourEnvoiDemandeEtreAide, setRetourEnvoiDemandeEtreAide] = useState<
    ReactElement | undefined
  >(undefined);
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

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

  const terminer = useCallback(
    (saisieInformations: CorpsDemandeEtreAide) => {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'demander-aide',
        (lien: Lien) => {
          macAPI
            .execute<void, void, CorpsDemandeEtreAide>(
              {
                url: lien.url,
                methode: lien.methode!,
                corps: {
                  cguValidees: saisieInformations.cguValidees,
                  departement: saisieInformations.departement,
                  email: saisieInformations.email,
                  relationAidant: saisieInformations.relationAidant,
                  ...(saisieInformations.raisonSociale && {
                    raisonSociale: saisieInformations.raisonSociale,
                  }),
                },
              },
              (corps) => corps
            )
            .then(() => {
              document
                .getElementById('formulaire-demande-aide')
                ?.scrollIntoView();
              envoie(confirmation());
            })
            .catch((erreur) => {
              envoie(saisieInformationsEnErreur(erreur));
              setRetourEnvoiDemandeEtreAide(<ChampsErreur erreur={erreur} />);
            });
        }
      );
    },
    [referentielDepartements]
  );

  const retourAccueil = useCallback(() => {
    navigationMAC.retourAccueil();
  }, [navigationMAC]);

  return (
    <div className="fr-grid-row fr-grid-row--center">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        {etat.etapeCourante === 'saisieInformations' && (
          <SaisieInformations
            departements={referentielDepartements || []}
            surValidation={{
              erreur: etat.erreur,
              execute: (saisieInformations) => terminer(saisieInformations),
            }}
          />
        )}
        {etat.etapeCourante === 'confirmation' && (
          <Confirmation onClick={() => retourAccueil()} />
        )}
        <div>{retourEnvoiDemandeEtreAide}</div>
      </div>
    </div>
  );
};
