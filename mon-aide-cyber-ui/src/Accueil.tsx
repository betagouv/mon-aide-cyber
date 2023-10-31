import sceneUnAidantEtUnAideFaisantUnDiagnostic from '../public/images/scene-un-aidant-et-un-aidant-faisant-un-diagnostic.svg';
import illustrationSectionDevenirAidant from '../public/images/devenir-aidant.svg';
import { ComposantLancerDiagnostic } from './composants/diagnostic/ComposantLancerDiagnostic.tsx';

function Accueil() {
  return (
    <>
      <div className="fr-container--fluid">
        <div className="presentation-generale fr-grid-row">
          <div className="corps fr-col-offset-2 fr-col-5">
            <h1>MonAideCyber</h1>
            <p>
              Accompagnez les entreprises et collectivités à gagner en maturité
              sur leurs pratiques cyber en les aidant à identifier les
              faiblesses de leur infrastructure.
            </p>
            <div className="actions">
              <ComposantLancerDiagnostic />
            </div>
          </div>
          <div className="fr-col-3 fr-col-offset-2--right">
            <img
              src={sceneUnAidantEtUnAideFaisantUnDiagnostic}
              alt="scène d'un aidant et d'un aidé faisant un diagnostic"
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="fr-container--fluid">
        <div className="section presentation-details fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-offset-2 fr-col-10 titre">
            <h2>
              MonAideCyber est en construction... Mais est déjà capable de vous
              apporter :
            </h2>
          </div>
          <div className="fr-col-offset-2 fr-col-4 detail bordure-gauche-violette">
            <h3>Un diagnostic complet</h3>
            <p>
              le diagnostic composé de ses thématiques permet de générer un
              bilan à la destination de l&apos;aidé.
            </p>
          </div>
          <div className="fr-col-4 fr-col-offset-2--right detail bordure-gauche-jaune">
            <h3>La reprise d&apos;un diagnostic en cours</h3>
            <p>
              Vous pouvez commencer, arrêter et retourner au{' '}
              <strong>diagnostic sauvegardé en permanence</strong>. Pour cela,
              utilisez le bouton de copie de lien pour le mettre de côté et y
              revenir ensuite.
            </p>
          </div>
          <div className="fr-col-offset-2 fr-col-4 detail bordure-gauche-jaune">
            <h3>Des bilans disponibles immédiatement</h3>
            <p>
              Pas besoin de finir le diagnostic. Préparé dès le début, le{' '}
              <strong>bilan est recalculé à chaque nouvelle réponse</strong>.
            </p>
          </div>
          <div className="fr-col-4 fr-col-offset-2--right detail bordure-gauche-violette">
            <h3>Des recommandations priorisées</h3>
            <p>
              Les <strong>6 recommandations prioritaires</strong> sont mises en
              avant, tandis que les autres sont rassemblées en{' '}
              <strong>annexe</strong> du bilan.
            </p>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="fr-container--fluid">
        <div className="section devenir-aidant fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle">
          <div className="fr-col-2">
            <img
              src={illustrationSectionDevenirAidant}
              alt="illustration temporaire pour la section"
            />
          </div>
          <div className="fr-container--fluid">
            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
              <div className="fr-col-12 titre">
                <h2>Devenir aidant</h2>
              </div>

              <div className="fr-col-12">
                <p>Les démarches à suivre pour commencer à accompagner.</p>
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
        </div>
      </div>
    </>
  );
}

export default Accueil;
