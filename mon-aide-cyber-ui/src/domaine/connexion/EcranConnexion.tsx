import { useEffect, useState } from 'react';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens, ROUTE_AIDANT } from '../MoteurDeLiens.ts';
import { FormulaireAuthentification } from '../authentification/FormulaireAuthentification.tsx';
import illustrationSecuritePostesSvg from '../../../public/images/illustration-securite-des-postes.svg';
import './ecran-connexion.scss';
import { TypographieH2 } from '../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import Button from '../../composants/atomes/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

export const EcranConnexion = () => {
  const navigate = useNavigate();

  const [informationAEteAfficheeUneFois, setInformationAEteAfficheeUneFois] =
    useState(false);

  const navigationMAC = useNavigationMAC();

  useEffect(() => {
    const moteurDeLiens = new MoteurDeLiens(navigationMAC.etat);
    moteurDeLiens.trouve('creer-espace-aidant', () =>
      navigationMAC.navigue(
        `${ROUTE_AIDANT}/finalise-creation-espace-aidant`,
        navigationMAC.etat
      )
    );
  }, [navigationMAC.etat]);

  const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
    'se-connecter-avec-pro-connect'
  );

  const formulaireConnexion = (
    <>
      {lien ? (
        <div className="fr-connect-group">
          <a className="fr-connect" href={lien.url}>
            <span className="fr-connect__login">S’identifier avec</span>{' '}
            <span className="fr-connect__brand">ProConnect</span>
          </a>
          <p>
            <a
              href="https://proconnect.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
            >
              Qu’est-ce que ProConnect ?
            </a>
          </p>
        </div>
      ) : null}

      <div className="texte-centre">
        <TypographieH2>Connectez-vous</TypographieH2>
        <p>à votre espace Aidant</p>
      </div>
      <FormulaireAuthentification />
      <br />
      <div className="texte-centre">
        <p>Vous n’êtes pas encore Aidant MonAideCyber ?</p>
        <Button
          type="button"
          variant="link"
          onClick={() => navigate('/devenir-aidant')}
        >
          S&apos;inscrire
        </Button>
      </div>
    </>
  );

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
          !informationAEteAfficheeUneFois
            ? information
            : formulaireConnexion}
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
