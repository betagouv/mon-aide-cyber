import { Header } from '../Header.tsx';
import { Footer } from '../Footer.tsx';
import { useEffect, useReducer } from 'react';
import { profilCharge, reducteurProfil } from './reducteurProfil.ts';
import { Profil } from 'mon-aide-cyber-api/src/api/representateurs/profil/Profil.ts';
import { useMACAPI, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';

export const ComposantProfil = () => {
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
    const lien = new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-profil',
    );

    if (etatProfil.enCoursDeChargement && lien) {
      macapi
        .appelle<Profil>(
          constructeurParametresAPI()
            .url(lien.url)
            .methode(lien.methode!)
            .construis(),
          async (reponse) => await reponse,
        )
        .then((profil) => envoie(profilCharge(profil)));
    }
  }, [navigationMAC.etat, etatProfil.enCoursDeChargement, macapi]);

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
                <p>Compte Crée le {etatProfil.dateCreationCompte}</p>
                <p>Prénom {etatProfil.prenom}</p>
                <p>nom {etatProfil.nom}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
