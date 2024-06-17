import { Header } from '../composants/Header.tsx';
import { Footer } from '../composants/Footer.tsx';
import { LienMAC } from '../composants/LienMAC.tsx';

export const CharteAidant = () => {
  const telechargementCharte = (
    <a
      className="fr-link fr-link--download lien-mac"
      download
      href="/fichiers/Charte_MonAideCyber.pdf"
    >
      Télécharger la charte de l&apos;aidant
      <span className="fr-link__detail">PDF – 88.07 ko</span>
    </a>
  );
  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <main role="main">
        <div className="fr-container mac-contenu-charte">
          <div className="fr-grid-row fr-grid-row--gutters">
            <div
              className="fr-col-offset-4 fr-col-offset-md-3 fr-col-8 fr-col-lg-9"
              id="top"
            >
              <h3>La Charte de l’Aidant</h3>
              <hr />
              {telechargementCharte}
              <h5>Démarche gratuite</h5>
              <p>
                Je réalise bénévolement ou gratuitement, ou sans reste à charge,
                le diagnostic et un point d’étape à 6 mois (si l’entité aidée le
                souhaite) après le diagnostic auprès de l’entité aidée via
                MonAideCyber.
              </p>
              <h5>Respect de la méthodologie</h5>
              <p>
                Je m’engage à suivre rigoureusement les principes
                méthodologiques proposés par MonAideCyber, à savoir :
              </p>
              <ul>
                <li>
                  Adopter une posture bienveillante, constructive et faire
                  preuve d’empathie et en étant en aucun cas dans une posture de
                  contrôle,
                </li>
                <li>
                  Mener dans la mesure du possible le diagnostic MonAideCyber en
                  présence d’un représentant de la direction et du prestataire
                  informatique principal (si existant) de l’entité aidée,
                </li>
                <li>
                  Réaliser le diagnostic en s’appuyant essentiellement sur la
                  liste des questions énumérées au travers des différentes
                  thématiques abordées par MonAideCyber (contexte, gouvernance,
                  sécurité des accès, sécurité des postes, sécurité des
                  infrastructures, sensibilisation, réaction à une
                  cyberattaque),
                </li>
                <li>
                  Restituer à l’entité aidée les résultats du diagnostic et les
                  6 mesures de sécurité prioritaires recensées et conseillées à
                  être menées sur les 6 prochains mois,
                </li>
                <li>
                  Mettre à disposition de l’entité les ressources et les
                  contacts utiles recensés par MonAideCyber,
                </li>
                <li>
                  Proposer à l’entité aidée d’effectuer avec elle un point de
                  suivi 6 mois après le diagnostic.
                </li>
                <li>
                  Ne pas créer de fichier permettant la corrélation entre un
                  identifiant d’une entité aidée et le nom de l’entité aidée,
                  sauf accord exprès de l’entité aidée. Dans ce dernier cas,
                  sécuriser un tel fichier de données de façon à éviter qu’il ne
                  soit consulté, reproduit, altéré ou modifié par des personnes
                  non autorisées.
                </li>
              </ul>
              <h5>Rappel des droits de l’Entité aidée</h5>
              <p>
                En amont de chaque accompagnement via MonAideCyber, je m’engage
                à rappeler auprès de l’entité aidée ses droits suivants :
              </p>
              <ul>
                <li>
                  L’accompagnement et le diagnostic réalisé via MonAideCyber
                  sont entièrement gratuits,
                </li>
                <li>
                  La possibilité d’accéder et de prendre connaissance de la
                  charte de l’aidant MonAideCyber disponible librement sur le
                  site internet de MonAideCyber (cf. engagement suivant),
                </li>
                <li>
                  La possibilité de demander l’accompagnement d’un autre aidant
                  selon des critères objectifs (localisation, disponibilité,
                  spécificités sectorielles) pour poursuivre l’accompagnement
                  via le service MonAideCyber ou pour mener un nouveau
                  diagnostic,
                </li>
                <li>
                  La possibilité d’être mis en relation auprès d’une entreprise
                  labellisée Expert Cyber (référencée par l’association ACYMA)
                  en s’appuyant sur le dispositif d’accompagnement de
                  cybermalveillance.gouv.fr, ou tout autre prestataire de
                  services qualifié par l’ANSSI, ou d’un prestataire de
                  proximité identifié par un Campus Cyber ou un CSIRT régional
                  pour être accompagné dans la mise en œuvre de mes
                  recommandations via le service MonAideCyber,
                </li>
                <li>
                  Aucune proposition commerciale ne sera établie à l’initiative
                  de l’aidant ayant réalisé le diagnostic sauf s’il s’agit d’une
                  demande de l’entité aidée, de sa propre initiative et en
                  dehors du cadre de la démarche MonAideCyber,
                </li>
                <li>
                  La possibilité de prendre contact auprès d’un agent de l’ANSSI
                  pour remonter toute problématique et/ou écart de conduite de
                  l’aidant constaté via le mail suivant :{' '}
                  <b>monaidecyber [at] ssi [point] gouv [point] fr</b>
                </li>
                <li>
                  La communication en fin de diagnostic MonAideCyber d’une
                  attestation intégrant une première analyse détaillant les
                  chantiers prioritaires à mener, une liste de contacts, les
                  ressources complémentaires qui lui sont disponibles, un rappel
                  de ses droits et la procédure de remontée d’un écart de
                  conduite d’un aidant.
                </li>
                <li>
                  Le droit de retirer le consentement mentionné au dernier
                  alinéa du paragraphe précédent.
                </li>
              </ul>
              <h5>
                Communication de la charte de l’Aidant auprès des Entités aidées
              </h5>
              <p>
                Je m’engage à transmettre à chaque entité aidée la présente
                charte.
              </p>
              <h5>
                Mise à disposition des ressources gratuites et aides
                complémentaires
              </h5>
              <p>
                J’engage à mettre à disposition de l’entité aidée les ressources
                gratuites, les aides complémentaires et les dispositifs
                d’accompagnement recensés par MonAideCyber.
              </p>
              <h5>Obligation de neutralité</h5>
              <p>
                Je m’engage à exercer mon rôle d’aidant MonAideCyber avec
                dignité, impartialité, intégrité et probité. Je veille à rester
                neutre et bienveillant auprès des entités aidées via
                MonAideCyber.
              </p>
              <h5>Aucune démarche commerciale directe</h5>
              <p>
                Je ne fais pas de proposition commerciale de services
                additionnels directement reliés à mon activité professionnelle.
                Je n’accepte aucun avantage, ni aucun présent directement ou
                indirectement lié à ma fonction ou proposé au motif, réel ou
                supposé, d’une décision prise ou dans l’espoir d’une décision à
                prendre. Je n’accorde aucun avantage pour des raisons d’ordre
                privé.
              </p>
              <h5>Condition pour une démarche commerciale indirecte</h5>
              <p>
                Je ne propose pas mes services commerciaux de conseil, de
                réalisation et de mise en œuvre des mesures <b>sauf</b> si cela
                est demandé par l’entité aidée de sa propre initiative et en
                dehors du cadre de la démarche MonAideCyber.
              </p>
              <h5>Aucun conflit d’intérêts</h5>
              <p>
                Je veille à faire cesser immédiatement ou à prévenir les
                situations de conflit d’intérêts* dans lesquelles je me trouve
                ou pourrais me trouver. Pour chaque entité aidée via
                MonAideCyber, je dois vérifier la compatibilité avec les
                obligations professionnelles liées à mon activité principale.
                Cette compatibilité est appréciée au cas par cas. À cette fin,
                si j’estime me trouver dans une situation de conflit d’intérêts,
                je saisis immédiatement mon référent MonAideCyber ; ce dernier,
                à la suite de la saisine ou de sa propre initiative, confie, le
                cas échéant, la mission à un autre aidant MonAideCyber.
              </p>
              <p>
                <i>
                  *Constitue un conflit d’intérêts toute situation
                  d’interférence entre un intérêt public et des intérêts publics
                  ou privés qui est de nature à influencer ou paraître
                  influencer l’exercice indépendant, impartial et objectif de
                  mon rôle d’aidant MonAideCyber.
                </i>
              </p>
              <h5>Devoirs de confidentialité</h5>
              <p>
                J’observe un devoir de confidentialité des échanges avec les
                entités aidées que j’accompagne via MonAideCyber. Je dois faire
                preuve de discrétion professionnelle pour tous les faits et
                informations dont elles ont connaissance dans l’exercice ou à
                l’occasion de l’exercice de mon rôle d’aidant MonAideCyber. Je
                m’abstiens de divulguer à quiconque n’ayant ni le droit, ni le
                besoin d’en connaître, sous quelque forme que ce soit, les
                informations dont j’ai connaissance dans mon rôle d’aidant
                MonAideCyber. Je m’engage à ne pas communiquer à des tiers
                toutes informations confiées par une entité aidée via
                MonAideCyber, sauf accord formelle de celle-ci.
              </p>
              <h5>Remontées auprès du référent MonAideCyber</h5>
              <p>
                Je rends compte auprès de{' '}
                <b>monaidecyber [at] ssi [point] gouv [point] fr</b>, par oral
                ou par écrit, de toutes difficultés rencontrées que ce soit
                durant l’accompagnement d’une entité aidée (ex : écart de
                conduite de l’entité aidée durant le diagnostic), lors
                d’interactions avec la communauté MonAideCyber ou dans la simple
                utilisation du service numérique.
              </p>
              <h5>Disponibilité</h5>
              <p>
                Je m’engage à me rendre disponible pour réaliser à minima 2
                diagnostics sur une durée de 12 mois.
              </p>
              <h5>Engagement</h5>
              <p>
                Tous les ans et lorsque le service MonAideCyber me le demande, 1
                mois avant anniversaire, je renouvelle tacitement mon engagement
                dans cette démarche pour les 12 mois suivants. Si je ne
                renouvelle pas mon engagement 30 jours après que le service
                MonAideCyber me le demande, mon accès au service sera suspendu
                automatiquement.
                <br />
                Si je le souhaite, j’ai la possibilité de retirer mon engagement
                à tout moment.
              </p>
              <h5>Évolution de la démarche et de la présente charte</h5>
              <p>
                Je prendrai en compte les évolutions de la démarche MonAideCyber
                et de la présente charte lorsque ces évolutions me seront
                communiquées par l’équipe ANSSI MonAideCyber. Si les évolutions
                proposées ne conviennent pas, j’ai la possibilité de retirer mon
                engagement.
              </p>
              <h5>Conditions de bannissement</h5>
              <p>
                J’atteste être conscient que tout comportement ou manquement de
                ma part qui serait contraire à la présente charte pourra
                entraîner mon déréférencement de la communauté d’aidants
                MonAideCyber, la désactivation voire suppression de mes accès au
                service MonAideCyber.
              </p>
              <div className="carte fr-col-md-6">
                <p>Télécharger la charte de l’Aidant au format pdf</p>
                {telechargementCharte}
              </div>
              <div className="fr-mt-8w">
                <a
                  className="fr-link fr-icon-arrow-up-fill fr-link--icon-left lien-mac"
                  href="#top"
                >
                  {' '}
                  Haut de page
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
