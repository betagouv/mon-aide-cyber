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
import { Lien, ReponseHATEOAS } from '../../../../Lien';
import { Departement } from '../../../../gestion-demandes/departement';
import { useNavigationMAC } from '../../../../../fournisseurs/hooks';
import { useMACAPI } from '../../../../../fournisseurs/api/useMACAPI';
import { useContexteNavigation } from '../../../../../hooks/useContexteNavigation';
import { MoteurDeLiens } from '../../../../MoteurDeLiens';
import {
  CorpsDemandeEtreAide,
  ReponseDemandeEtreAide,
} from '../../../../gestion-demandes/etre-aide/EtreAide';
import { constructeurParametresAPI } from '../../../../../fournisseurs/api/ConstructeurParametresAPI';
import { ChampsErreur } from '../../../../../composants/alertes/Erreurs';

export const FormulaireDemandeEtreAide = () => {
  const [etat, envoie] = useReducer(reducteurDemandeEtreAide, {
    etapeCourante: 'saisieInformations',
  });
  const [
    demandeEtreAideEnCoursDeChargement,
    setDemandeEtreAideEnCoursDeChargement,
  ] = useState(true);
  const [demandeEtreAide, setDemandeEtreAide] = useState<
    { lien: Lien; departements: Departement[] } | undefined
  >();
  const [retourEnvoiDemandeEtreAide, setRetourEnvoiDemandeEtreAide] = useState<
    ReactElement | undefined
  >(undefined);
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const navigationUtilisateur = useContexteNavigation();

  useEffect(() => {
    navigationUtilisateur
      .recupereContexteNavigation({ contexte: 'demande-etre-aide' })
      .then((reponse) => {
        navigationMAC.ajouteEtat((reponse as ReponseHATEOAS).liens);
      })
      .catch();
  }, []);

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
              new MoteurDeLiens(reponse.liens).trouve('demander-aide', (lien) =>
                setDemandeEtreAide({ lien, departements: reponse.departements })
              );
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
      macAPI
        .execute<void, void, CorpsDemandeEtreAide>(
          {
            url: demandeEtreAide!.lien.url,
            methode: demandeEtreAide!.lien.methode!,
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
          envoie(confirmation());
        })
        .catch((erreur) => {
          envoie(saisieInformationsEnErreur(erreur));
          setRetourEnvoiDemandeEtreAide(<ChampsErreur erreur={erreur} />);
        });
    },
    [demandeEtreAide]
  );

  const retourAccueil = useCallback(() => {
    navigationMAC.retourAccueil();
  }, [navigationMAC]);

  return (
    <div className="fr-grid-row fr-grid-row--center">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        {etat.etapeCourante === 'saisieInformations' && (
          <SaisieInformations
            departements={demandeEtreAide?.departements || []}
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
