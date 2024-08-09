import { Footer } from '../Footer';
import { Header } from '../Header';
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
  reducteurDemandeAide,
  saisieInformationsEnErreur,
} from './reducteurDemandeAide.ts';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { Lien } from '../../domaine/Lien.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Confirmation } from './Confirmation.tsx';
import { ChampsErreur } from '../alertes/Erreurs.tsx';
import { LienMAC } from '../LienMAC.tsx';
import {
  CorpsDemandeAide,
  ReponseDemandeAide,
} from '../../domaine/gestion-demandes/aide/Aide.ts';
import { Departement } from '../../domaine/gestion-demandes/departement.ts';

export const ComposantDemandeAide = () => {
  const [etat, envoie] = useReducer(reducteurDemandeAide, {
    etapeCourante: 'saisieInformations',
  });
  const [demandeAideEnCoursDeChargement, setDemandeAideEnCoursDeChargement] =
    useState(true);
  const [demandeAide, setDemandeAide] = useState<
    { lien: Lien; departements: Departement[] } | undefined
  >();
  const [retourEnvoiDemandeAide, setRetourEnvoiDemandeAide] = useState<
    ReactElement | undefined
  >(undefined);
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();

  useEffect(() => {
    if (demandeAideEnCoursDeChargement) {
      macAPI
        .appelle<ReponseDemandeAide>(
          {
            url: '/api/aide/demande',
            methode: 'GET',
          },
          (corps) => corps
        )
        .then((reponse) => {
          new MoteurDeLiens(reponse.liens).trouve('demander-aide', (lien) =>
            setDemandeAide({ lien, departements: reponse.departements })
          );
          setDemandeAideEnCoursDeChargement(false);
        })
        .catch(() => {
          setDemandeAideEnCoursDeChargement(false);
        });
    }
  }, [demandeAideEnCoursDeChargement, macAPI]);

  const terminer = useCallback(
    (saisieInformations: CorpsDemandeAide) => {
      macAPI
        .appelle<void, CorpsDemandeAide>(
          {
            url: demandeAide!.lien.url,
            methode: demandeAide!.lien.methode!,
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
          setRetourEnvoiDemandeAide(<ChampsErreur erreur={erreur} />);
        });
    },
    [demandeAide, macAPI]
  );

  const retourAccueil = useCallback(() => {
    navigationMAC.retourAccueil();
  }, [navigationMAC]);

  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
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
                    departements={demandeAide?.departements || []}
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
                <div>{retourEnvoiDemandeAide}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
