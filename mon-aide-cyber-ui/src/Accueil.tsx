import { Header } from './composants/Header.tsx';
import { Footer } from './composants/Footer.tsx';

function Accueil() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="bandeau-violet accueil">
          <div id="presentation" className="fr-container">
            <div className="fr-grid-row fr-grid-row--middle fr-py-20v">
              <div id="corps" className="fr-col-6">
                <h1 className="fr-mb-5w">MonAideCyber</h1>
                <p>
                  Passez à l’action pour votre cyber sécurité grâce à notre
                  communauté d’Aidants sur tout le territoire !
                </p>
              </div>
              <div id="illustration" className="fr-col-6">
                <img
                  src="/images/illustration-accueil.svg"
                  alt="scène d'un aidant et d'un aidé faisant un diagnostic"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="fr-container tuiles">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-4">
              <div className="tuile tuile-centree tuile-petite">
                <div className="illustration">
                  <img
                    src="/images/icones/diagnostic-cyber.svg"
                    alt="Un diagnostic cyber"
                  />
                </div>
                <div className="corps">
                  <div>
                    <h4>
                      <span>
                        1 Diagnostic <br />
                        cyber
                      </span>
                    </h4>
                  </div>
                  <div>
                    <p>
                      MonAideCyber propose un diagnostic de sécurité cyber
                      gratuit
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-4">
              <div className="tuile tuile-centree tuile-petite">
                <div className="illustration">
                  <img
                    src="/images/icones/communaute-aidants.svg"
                    alt="Un diagnostic cyber"
                  />
                </div>
                <div className="corps">
                  <div>
                    <h4>1 Communauté d&apos;Aidants</h4>
                  </div>
                  <div>
                    <p>
                      MonAideCyber s’appuie sur une communauté d’Aidants de
                      confiance
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-4">
              <div className="tuile tuile-centree tuile-petite">
                <div className="illustration">
                  <img
                    src="/images/icones/accompagnement-personnalise.svg"
                    alt="Un diagnostic cyber"
                  />
                </div>
                <div className="corps">
                  <div>
                    <h4>1 Accompagnement personnalisé</h4>
                  </div>
                  <div>
                    <p>
                      MonAideCyber aiguille les entités vers des dispositifs et
                      des tiers de confiance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-container fr-mt-20v">
          <div id="ce-que-cest" className="fr-grid-row">
            <div className="fr-col-8">
              <h2>Qu&apos;est-ce que MonAideCyber?</h2>
              <p>
                MonAideCyber est en construction... Mais est déjà capable de
                vous apporter :
              </p>
            </div>
            <div className="fr-col-6 detail bordure-gauche-violette">
              <h3>Un diagnostic complet</h3>
              <p>
                le diagnostic composé de ses thématiques permet de générer un
                bilan à la destination de l&apos;aidé.
              </p>
            </div>
            <div className="fr-col-6 detail bordure-gauche-jaune">
              <h3>La reprise d&apos;un diagnostic en cours</h3>
              <p>
                Vous pouvez commencer, arrêter et retourner au{' '}
                <strong>diagnostic sauvegardé en permanence</strong>. Pour cela,
                utilisez le bouton de copie de lien pour le mettre de côté et y
                revenir ensuite.
              </p>
            </div>
            <div className="fr-col-6 detail bordure-gauche-jaune">
              <h3>Des bilans disponibles immédiatement</h3>
              <p>
                Pas besoin de finir le diagnostic. Préparé dès le début, le{' '}
                <strong>bilan est recalculé à chaque nouvelle réponse</strong>.
              </p>
            </div>
            <div className="fr-col-6 detail bordure-gauche-violette">
              <h3>Des recommandations priorisées</h3>
              <p>
                Les <strong>6 recommandations prioritaires</strong> sont mises
                en avant, tandis que les autres sont rassemblées en{' '}
                <strong>annexe</strong> du bilan.
              </p>
            </div>
          </div>
        </div>
        <div id="participer" className="fr-container fr-my-20v">
          <div className="fr-col-12">
            <div className="fr-col-12">
              <h2>Participer ?</h2>
            </div>
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-6">
                <div className="tuile tuile-grande fr-p-7v">
                  <div className="illustration">
                    <img
                      src="/images/devenir-aidant.svg"
                      alt="illustration temporaire pour la section"
                    />
                  </div>
                  <div className="corps">
                    <h4>Devenir Aidant</h4>
                    <ul>
                      <li>Être bénévole et dans une posture bienveillante</li>
                      <li>Assister à une formation</li>
                      <li>Prendre en main l&apos;outil diagnostic</li>
                      <li>
                        Signer la{' '}
                        <a href="/charte-aidant">
                          charte aidant{' '}
                          <span
                            className="fr-icon-pen-nib-line"
                            aria-hidden="true"
                          ></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="fr-col-6">
                <div className="tuile tuile-grande fr-p-7v bientot-disponible">
                  <div className="illustration">
                    <img
                      src="/images/devenir-aidant.svg"
                      alt="illustration temporaire pour la section"
                    />
                  </div>
                  <div className="corps">
                    <h4>Devenir Aidé</h4>
                    <p>Bientôt disponible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Accueil;
