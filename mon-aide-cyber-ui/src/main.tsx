import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/styles/index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FournisseurEntrepots } from './fournisseurs/FournisseurEntrepot.ts';
import { ComposantIntercepteur } from './composants/intercepteurs/ComposantIntercepteur.tsx';
import { APIEntrepotDiagnostics } from './infrastructure/entrepots/EntrepotsAPI.ts';
import { ComposantAffichageErreur } from './composants/erreurs/ComposantAffichageErreur.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { EntrepotDiagnostics } from './domaine/diagnostic/Diagnostics.ts';
import { ComposantDiagnostic } from './composants/diagnostic/ComposantDiagnostic.tsx';
import { ComposantDiagnostics } from './composants/ComposantDiagnostics.tsx';
import { APIEntrepotDiagnostic } from './infrastructure/entrepots/APIEntrepotDiagnostic.ts';

import { startReactDsfr } from '@codegouvfr/react-dsfr/spa';
import { CharteAidant } from './vues/CharteAidant.tsx';

startReactDsfr({ defaultColorScheme: 'system' });

const routeur = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
        <App />
      </ErrorBoundary>
    ),
  },
  { path: '/charte-aidant', element: <CharteAidant /> },
  {
    path: 'diagnostics',
    element: (
      <ErrorBoundary FallbackComponent={ComposantAffichageErreur}>
        <ComposantDiagnostics />
      </ErrorBoundary>
    ),
  },
  {
    path: 'diagnostic/:idDiagnostic',
    element: <ComposantIntercepteur composant={ComposantDiagnostic} />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FournisseurEntrepots.Provider
      value={{
        diagnostic: () => new APIEntrepotDiagnostic(),
        diagnostics: (): EntrepotDiagnostics => new APIEntrepotDiagnostics(),
      }}
    >
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container--fluid">
            <div className="fr-col-offset-2 fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo">
                      {' '}
                      République <br />
                      Française
                    </p>
                  </div>
                  <div className="fr-header__operator">
                    <img
                      style={{ maxWidth: '3.5rem' }}
                      className="fr-responsive-img"
                      src="/images/logo_anssi.png"
                      alt="ANSSI"
                    />
                  </div>
                </div>
                <div className="fr-header__service">
                  <a href="/" title="Accueil - MonAideCyber">
                    <img
                      className="fr-responsive-img"
                      src="/images/logo_mac.svg"
                      alt="ANSSI"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main role="main">
        <RouterProvider router={routeur} />
      </main>
      <footer role="contentinfo" id="footer">
        <div className="fr-footer__partners piedpage-mac">
          <div className="piedpage-mac-logos">
            <div className="fr-footer__partners-sub">
              <ul>
                <li>
                  <a
                    href="https://www.ssi.gouv.fr/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    <img src="/images/logo_anssi.png" alt="ANSSI" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    <img src="/images/logo_cnil.webp" alt="CNIL" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cybermalveillance.gouv.fr/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    <img src="/images/logo_acyma.svg" alt="CyberMalveillance" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gendarmerie.interieur.gouv.fr/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    <img
                      src="/images/logo_gendarmerie_nationale.svg"
                      alt="Gendarmerie Nationale"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.police-nationale.interieur.gouv.fr/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {' '}
                    <img
                      src="/images/logo_police_nationale.svg"
                      alt="Police Nationale"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="fr-footer">
          <div className="fr-container--fluid">
            <div className="fr-col-offset-2 fr-footer__body">
              <div className="fr-footer__brand fr-enlarge-link">
                <a href="/" title="Retour à l’accueil du site - MonAideCyber">
                  <p className="fr-logo">
                    {' '}
                    République <br />
                    Française
                  </p>
                </a>
              </div>
              <div className="fr-footer__content fr-col-offset-2--right">
                <p className="fr-footer__content-desc">
                  MonAideCyber aide les collectivités territoriales et les PME
                  sensibilisées à la sécurité informatique à passer à l’action.
                  Le dispositif MonAideCyber est développé par l&apos;Agence
                  nationale de la sécurité des systèmes d&apos;information, en
                  lien avec BetaGouv et la Direction interministérielle du
                  numérique.
                </p>
                <ul className="fr-footer__content-list">
                  <li className="fr-footer__content-item">
                    <a
                      className="fr-footer__content-link"
                      target="_blank"
                      href="https://legifrance.gouv.fr"
                      rel="noreferrer"
                    >
                      legifrance.gouv.fr
                    </a>
                  </li>
                  <li className="fr-footer__content-item">
                    <a
                      className="fr-footer__content-link"
                      target="_blank"
                      href="https://gouvernement.fr"
                      rel="noreferrer"
                    >
                      gouvernement.fr
                    </a>
                  </li>
                  <li className="fr-footer__content-item">
                    <a
                      className="fr-footer__content-link"
                      target="_blank"
                      href="https://service-public.fr"
                      rel="noreferrer"
                    >
                      service-public.fr
                    </a>
                  </li>
                  <li className="fr-footer__content-item">
                    <a
                      className="fr-footer__content-link"
                      target="_blank"
                      href="https://data.gouv.fr"
                      rel="noreferrer"
                    >
                      data.gouv.fr
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="fr-col-offset-2 fr-footer__bottom">
              <ul className="fr-footer__bottom-list">
                <li className="fr-footer__bottom-item">
                  <a className="fr-footer__bottom-link" href="#">
                    Accessibilité : non conforme
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </FournisseurEntrepots.Provider>
  </React.StrictMode>,
);
