import { Footer } from '../Footer';
import { Header } from '../Header';
import {
  DonneesSaisieInformations,
  SaisieInformations,
} from './SaisieInformations.tsx';
import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  confirmation,
  reducteurParcoursCGUAide,
  saisieInformationsEnErreur,
} from './reducteurParcoursCGUAide.ts';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { Lien, ReponseHATEOAS } from '../../domaine/Lien.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Confirmation } from './Confirmation.tsx';

export const ComposantParcoursCGUAide = () => {
  const [etat, envoie] = useReducer(reducteurParcoursCGUAide, {
    etapeCourante: 'saisieInformations',
  });
  const [demandeAideEnCoursDeChargement, setDemandeAideEnCoursDeChargement] =
    useState(true);
  const [lienDemandeAide, setLienDemandeAide] = useState<Lien | undefined>();
  const macAPI = useMACAPI();
  const navigationMAC = useNavigationMAC();

  useEffect(() => {
    if (demandeAideEnCoursDeChargement) {
      macAPI
        .appelle<ReponseHATEOAS>(
          {
            url: '/api/aide/cgu',
            methode: 'GET',
          },
          (corps) => corps,
        )
        .then((reponse) => {
          new MoteurDeLiens(reponse.liens).trouve(
            'demander-validation-cgu-aide',
            (lien) => setLienDemandeAide(lien),
          );
          setDemandeAideEnCoursDeChargement(false);
        })
        .catch(() => {
          setDemandeAideEnCoursDeChargement(false);
        });
    }
  }, [demandeAideEnCoursDeChargement, macAPI]);

  const terminer = useCallback(
    (saisieInformations: DonneesSaisieInformations) => {
      macAPI
        .appelle<void, DonneesSaisieInformations>(
          {
            url: lienDemandeAide!.url,
            methode: lienDemandeAide!.methode!,
            corps: {
              cguValidees: saisieInformations.cguValidees,
              departement: saisieInformations.departement,
              email: saisieInformations.email,
              ...(saisieInformations.raisonSociale && {
                raisonSociale: saisieInformations.raisonSociale,
              }),
            },
          },
          (corps) => corps,
        )
        .then(() => {
          envoie(confirmation());
        })
        .catch((erreur) => {
          envoie(saisieInformationsEnErreur(erreur));
        });
    },
    [lienDemandeAide, macAPI],
  );

  const retourAccueil = useCallback(() => {
    navigationMAC.retourAccueil();
  }, [navigationMAC]);

  return (
    <>
      <Header />
      <main role="main" className="profil">
        <div className="mode-fonce">
          <div className="fr-container">
            <div className="fr-grid-row">
              <h2 className="titre-profil">
                Vous souhaitez bénéficier de MonAideCyber
              </h2>
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
                    onClick={(saisieInformations) =>
                      terminer(saisieInformations)
                    }
                  />
                )}
                {etat.etapeCourante === 'confirmation' && (
                  <Confirmation onClick={() => retourAccueil()} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
