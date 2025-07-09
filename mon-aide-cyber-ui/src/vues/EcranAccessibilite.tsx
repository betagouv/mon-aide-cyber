import { useTitreDePage } from '../hooks/useTitreDePage.ts';
import { LienMailtoMAC } from '../composants/atomes/LienMailtoMAC.tsx';

export const EcranAccessibilite = () => {
  useTitreDePage('Accessibilité');

  return (
    <main role="main">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-8 fr-pt-6w">
            <h1>Déclaration d’accessibilité</h1>
            <p>Établie le 30 septembre 2024.</p>
            <p>
              Notre organisation s’engage à rendre son service accessible,
              conformément à l’article 47 de la loi n° 2005-102 du 11 février
              2005.
            </p>
            <p>
              Cette déclaration d’accessibilité s’applique à{' '}
              <strong>Mon Aide Cyber</strong> ( https://monaide.cyber.gouv.fr/)
              .
            </p>
            <h2>État de conformité</h2>
            <p>
              <strong>Mon Aide Cyber</strong> est <strong>non conforme</strong>{' '}
              avec le{' '}
              <abbr title="Référentiel général d’amélioration de l’accessibilité">
                RGAA
              </abbr>
              .{' '}
              <span>
                Le site n’a encore pas été audité.
                <br />
              </span>
            </p>
            <h2>Voie de recours</h2>
            <p>
              Cette procédure est à utiliser dans le cas suivant&nbsp;: vous
              avez signalé au responsable du site internet un défaut
              d’accessibilité qui vous empêche d’accéder à un contenu ou à un
              des services du portail et vous n’avez pas obtenu de réponse
              satisfaisante.
            </p>
            <p>Vous pouvez&nbsp;:</p>
            <ul>
              <li>
                Écrire un message au{' '}
                <a href="https://formulaire.defenseurdesdroits.fr/">
                  Défenseur des droits
                </a>
              </li>
              <li>
                Contacter{' '}
                <a href="https://www.defenseurdesdroits.fr/saisir/delegues">
                  le délégué du Défenseur des droits dans votre région
                </a>
              </li>
              <li>
                Envoyer un courrier par la poste (gratuit, ne pas mettre de
                timbre)&nbsp;:
                <br />
                Défenseur des droits
                <br />
                Libre réponse 71120 75342 Paris CEDEX 07
              </li>
            </ul>

            <h2>Contact</h2>
            <ul>
              <li>
                Mail : <LienMailtoMAC />
              </li>
              <li>
                <a
                  href="https://aide.monaide.cyber.gouv.fr/fr/?chat=ouvert"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat en ligne
                </a>
              </li>
            </ul>
            <hr />
            <p>
              Cette déclaration d’accessibilité a été créé le
              <span>30 septembre 2024</span>
              grâce au
              <a href="https://betagouv.github.io/a11y-generateur-declaration/#create">
                Générateur de Déclaration d’Accessibilité de BetaGouv
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
