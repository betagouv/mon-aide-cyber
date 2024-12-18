import { useState } from 'react';
import illustrationSecuritePostesSvg from '../../../public/images/illustration-securite-des-postes.svg';
import './ecran-connexion.scss';
import { FormulaireConnexion } from './composants/FormulaireConnexion.tsx';

export const EcranConnexion = () => {
  const [informationAEteAfficheeUneFois, setInformationAEteAfficheeUneFois] =
    useState(false);

  const information = (
    <>
      <div id="texte-centre">
        <p>Chers Aidantes, Aidants,</p>
        <p>
          Nous tenons à vous informer que notre plateforme publique MonAideCyber
          est officiellement en ligne.
        </p>
        <p>
          Elle sera amenée à évoluer prochainement dans l’optique d’améliorer et
          de simplifier votre expérience sur le site.
        </p>
        <p>
          Nous vous invitons dès à présent à vous rendre sur le site :{' '}
          <a href="https://monaidecyber.ssi.gouv.fr">
            monaidecyber.ssi.gouv.fr
          </a>
        </p>
        <p>
          Si vous ne retrouvez pas sur votre tableau de bord les IDs des
          diagnostics effectués, contactez-nous à l’adresse monaidecyber [at]
          ssi.gouv.fr
        </p>
        <p>
          Toutefois, si vous souhaitez continuer à effectuer des diagnostics sur
          la plateforme de tests, il sera toujours possible de le faire jusqu’à
          ce que nous vous informions de la fin de sa disponibilité.
        </p>
        <p>A bientôt L’équipe MonAideCyber</p>
      </div>

      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-md-6">
            <button
              type="submit"
              className="fr-btn bouton-mac bouton-mac-secondaire"
              onClick={() => setInformationAEteAfficheeUneFois(true)}
            >
              Continuer sur l&apos;environnement de tests
            </button>
          </div>
          <div className="fr-col-5 fr-col-offset-1">
            <a href={import.meta.env['VITE_MAC_URL_OFFICIELLE']}>
              <button
                type="submit"
                className="fr-btn bouton-mac bouton-mac-primaire"
              >
                Me rendre sur le site officiel
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <main role="main" className="ecran-connexion">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container">
          {import.meta.env['VITE_INFORMATION_A_AFFICHER'] === 'true' &&
          !informationAEteAfficheeUneFois ? (
            information
          ) : (
            <FormulaireConnexion />
          )}
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img
          src={illustrationSecuritePostesSvg}
          alt="illustration de deux écrans de connexion"
        />
      </div>
    </main>
  );
};
