import { ComposantLancerDiagnostic } from './composants/diagnostic/ComposantLancerDiagnostic.tsx';

function Accueil() {
  return (
    <>
      <div className="bandeau-violet">
        <div id="presentation" className="fr-container">
          <div className="fr-grid-row fr-grid-row--middle fr-py-20v">
            <div id="corps" className="fr-col-6 fr-col-offset-1--right">
              <h1 className="fr-mb-5w">MonAideCyber</h1>
              <p>
                Accompagnez les entreprises et collectivités à gagner en
                maturité sur leurs pratiques cyber en les aidant à identifier
                les faiblesses de leur infrastructure.
              </p>
              <div className="actions">
                <ComposantLancerDiagnostic style="bouton-mac bouton-mac-primaire-jaune" />
              </div>
            </div>
            <div id="illustration" className="fr-col-5">
              <img
                src="/images/scene-un-aidant-et-un-aidant-faisant-un-diagnostic.svg"
                alt="scène d'un aidant et d'un aidé faisant un diagnostic"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fr-container fr-mt-20v">
        <div id="ce-que-cest" className="fr-grid-row">
          <div className="fr-col-8">
            <h2>Qu&apos;est-ce que MonAideCyber?</h2>
            <p>
              MonAideCyber est en construction... Mais est déjà capable de vous
              apporter :
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
              Les <strong>6 recommandations prioritaires</strong> sont mises en
              avant, tandis que les autres sont rassemblées en{' '}
              <strong>annexe</strong> du bilan.
            </p>
          </div>
        </div>
      </div>
      <div id="participer" className="fr-container fr-my-20v">
        <div className="fr-col-12">
          <h2>Participer ?</h2>
        </div>
        <div className="tuile fr-p-7v">
          <div className="illustration">
            <img
              src="/images/devenir-aidant.svg"
              alt="illustration temporaire pour la section"
            />
          </div>
          <div className="corps">
            <h3>Devenir Aidant</h3>
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
        <div className="tuile fr-p-7v bientot-disponible">
          <div className="illustration">
            <img
              src="/images/devenir-aidant.svg"
              alt="illustration temporaire pour la section"
            />
          </div>
          <div className="corps">
            <h3>Devenir Aidé</h3>
            <p>Bientôt disponible.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Accueil;
