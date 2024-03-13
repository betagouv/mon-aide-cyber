import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useCallback, useEffect, useReducer } from 'react';
import {
  profilCharge,
  profilChargeEnErreur,
  reducteurProfil,
} from './reducteurProfil.ts';
import { Profil } from 'mon-aide-cyber-api/src/api/representateurs/profil/Profil.ts';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Lien, ReponseHATEOAS } from '../../domaine/Lien.ts';
import { useErrorBoundary } from 'react-error-boundary';

export const ComposantProfil = () => {
  const { showBoundary } = useErrorBoundary();
  const macapi = useMACAPI();
  const navigationMAC = useNavigationMAC();
  const [etatProfil, envoie] = useReducer(reducteurProfil, {
    nom: '',
    prenom: '',
    email: '',
    dateCreationCompte: '',
    enCoursDeChargement: true,
  });

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-profil',
      (lien: Lien) => {
        if (etatProfil.enCoursDeChargement) {
          macapi
            .appelle<Profil>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (reponse) => reponse,
            )
            .then((profil) => envoie(profilCharge(profil)))
            .catch((erreur: ReponseHATEOAS) => {
              envoie(profilChargeEnErreur());
              showBoundary(erreur);
            });
        }
      },
    );
  }, [
    navigationMAC.etat,
    etatProfil.enCoursDeChargement,
    macapi,
    showBoundary,
  ]);

  const afficherTableauDeBord = useCallback(() => {
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'lancer-diagnostic',
    );
  }, [navigationMAC]);

  return (
    <>
      <Header />
      <main role="main">
        <div className="mode-fonce ">
          <div className="fr-container">
            <div className="fr-grid-row">
              <h2 className="titre-profil">Mon profil</h2>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-md-8 fr-col-sm-12 section">
                <div className="fr-mb-2w">
                  Compte Crée le {etatProfil.dateCreationCompte}
                </div>
                <div>
                  <button
                    className="bouton-mac bouton-mac-secondaire"
                    onClick={afficherTableauDeBord}
                  >
                    Accéder au tableau de bord
                  </button>
                </div>
                <div className="fr-mt-2w">
                  <p>
                    <b>Prénom</b> {etatProfil.prenom}
                  </p>
                  <p>
                    <b>Nom</b> {etatProfil.nom}
                  </p>
                  <p>
                    <b>Email</b> {etatProfil.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
