import { SaisieInformations } from './SaisieInformations.tsx';
import {
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  confirmation,
  reducteurDemandeEtreAide,
  saisieInformationsEnErreur,
} from './reducteurDemandeEtreAide.ts';
import { Lien, ReponseHATEOAS } from '../../../domaine/Lien.ts';
import { Departement } from '../../../domaine/gestion-demandes/departement.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { ChampsErreur } from '../../alertes/Erreurs.tsx';
import { Confirmation } from './Confirmation.tsx';
import { macAPI } from '../../../fournisseurs/api/macAPI.ts';
import {
  CorpsDemandeEtreAide,
  ReponseDemandeEtreAide,
} from '../../../domaine/gestion-demandes/etre-aide/EtreAide.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useContexteNavigation } from '../../../hooks/useContexteNavigation.ts';

export const ComposantDemandeEtreAide = () => {
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
    <main role="main" className="demande-aide">
      <div className="mode-fonce">
        <div className="fr-container">
          <div className="fr-grid-row contenu">
            <h2>Vous souhaitez bénéficier de MonAideCyber</h2>
            <p>
              Afin de vous diriger au mieux, merci de répondre à quelques
              questions.
            </p>
          </div>
        </div>
      </div>

      <div className="fond-clair-mac">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-md-8 fr-col-sm-12 section">
              {etat.etapeCourante === 'saisieInformations' && (
                <SaisieInformations
                  departements={demandeEtreAide?.departements || []}
                  surValidation={{
                    erreur: etat.erreur,
                    execute: (saisieInformations) =>
                      terminer(saisieInformations),
                  }}
                />
              )}
              {etat.etapeCourante === 'confirmation' && (
                <Confirmation onClick={() => retourAccueil()} />
              )}
              <div>{retourEnvoiDemandeEtreAide}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
