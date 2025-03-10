import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useRecupereContexteNavigation } from '../../../../hooks/useRecupereContexteNavigation.ts';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import { MoteurDeLiens } from '../../../MoteurDeLiens.ts';
import {
  CorpsDemandeEtreAide,
  ReponseDemandeEtreAide,
} from '../../../gestion-demandes/etre-aide/EtreAide.ts';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Lien } from '../../../Lien.ts';
import {
  confirmation,
  reducteurDemandeEtreAide,
  saisieInformationsEnErreur,
} from '../../../../composants/gestion-demandes/etre-aide/reducteurDemandeEtreAide.ts';
import { ChampsErreur } from '../../../../composants/alertes/Erreurs.tsx';
import { FormulaireDemandeEtreAide } from '../../../../composants/gestion-demandes/etre-aide/FormulaireDemandeEtreAide.tsx';
import { Confirmation } from '../../../../composants/gestion-demandes/etre-aide/Confirmation.tsx';
import { Departement } from '../../../gestion-demandes/departement.ts';

export const CapteurFormulaireDemandeEtreAide = () => {
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
    (saisieFormulaireDemandeEtreAide: CorpsDemandeEtreAide) => {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'demander-aide',
        (lien: Lien) => {
          macAPI
            .execute<void, void, CorpsDemandeEtreAide>(
              {
                url: lien.url,
                methode: lien.methode!,
                corps: {
                  cguValidees: saisieFormulaireDemandeEtreAide.cguValidees,
                  departement: saisieFormulaireDemandeEtreAide.departement,
                  email: saisieFormulaireDemandeEtreAide.email,
                  relationUtilisateur:
                    saisieFormulaireDemandeEtreAide.relationUtilisateur,
                  ...(saisieFormulaireDemandeEtreAide.raisonSociale && {
                    raisonSociale:
                      saisieFormulaireDemandeEtreAide.raisonSociale,
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
          <FormulaireDemandeEtreAide
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
