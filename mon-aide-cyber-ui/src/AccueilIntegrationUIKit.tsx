import { ActionsPiedDePage } from './composants/communs/ActionsPiedDePage.tsx';
import { useCallback, useState } from 'react';
import { useTitreDePage } from './hooks/useTitreDePage.ts';
import { liensMesServicesCyber } from './infrastructure/mes-services-cyber/liens.ts';

export const AccueilIntegrationUIKit = () => {
  const [motDGClique, setMotDGClique] = useState<boolean>(true);
  const [motGeneralClique, setMotGeneralClique] = useState<boolean>(false);
  const couleurSlide: 'mode-fonce' | 'mode-clair' = motGeneralClique
    ? 'mode-clair'
    : 'mode-fonce';

  useTitreDePage('Accueil');

  const surCliqueMotDG = useCallback(() => {
    setMotGeneralClique(false);
    setMotDGClique(true);
  }, []);

  const surCliqueMotGeneral = useCallback(() => {
    setMotDGClique(false);
    setMotGeneralClique(true);
  }, []);

  const tuiles = [
    {
      titre: 'Un dispositif étatique',
      contenu:
        'MonAideCyber est proposé par l’Agence nationale de la sécurité des systèmes d’information.',
      illustration: {
        lien: '/images/icones/accompagnement-personnalise.svg',
        alt: 'Un diagnostic cyber',
      },
    },
    {
      titre: 'Une communauté de confiance',
      contenu:
        'Les Aidants cyber sont issus de la sphère publique ou sont membres d’associations œuvrant pour un numérique de confiance.',
      illustration: {
        lien: '/images/icones/diagnostic-cyber.svg',
        alt: 'Un accompagnement personnalisé',
      },
    },
    {
      titre: 'Au service de l’intérêt général',
      contenu:
        'Le diagnostic cyber aide les entités qui souhaitent se protéger contre les cyberattaques et passer à l’action.',
      illustration: {
        lien: '/images/icones/communaute-aidants.svg',
        alt: 'Communauté d‘Aidants cyber',
      },
    },
  ];

  const etapesMarelle = [
    {
      titre: 'Vérifier votre éligibilité',
      description:
        'Vous êtes éligible si vous travaillez au sein d’une entité publique ou êtes membre d’une association oeuvrant pour la confiance numérique et si votre démarche est non lucrative.',
      illustration: {
        lien: '/images/illustration-marelle-etape-1.svg',
        alt: 'Un Aidé faisant un diagnostic avec un Aidant cyber',
      },
    },
    {
      titre: 'Devenir Aidant cyber',
      description:
        'Participer à la formation gratuite "Devenir Aidant cyber" d’une demi-journée et accepter la Charte de l’Aidant.',
      lien: {
        href: '/charte-aidant',
        texte: "Consulter la Charte de l'Aidant cyber",
        target: '_blank',
      },
      illustration: {
        lien: '/images/illustration-marelle-etape-2.svg',
        alt: '',
      },
    },
    {
      titre: 'Rejoindre la communauté des Aidants cyber',
      description: 'Echangez avec tous les les Aidants cyber sur Tchap !',
      lien: {
        href: 'https://tally.so/r/3EYlq2',
        texte: 'Rejoindre la communauté',
        target: '_blank',
      },
      illustration: {
        lien: '/images/illustration-marelle-etape-3.svg',
        alt: '',
      },
    },
    {
      titre: 'Réaliser des diagnostics cyber !',
      description:
        'Répondez aux sollicitations de demandes de diagnostics cyber et faîtes la promotion du dispositif autour de vous !',
      lien: {
        href: '/promouvoir-diagnostic-cyber',
        texte: 'Accéder au kit de communication',
        target: '_blank',
      },
      illustration: {
        lien: '/images/illustration-marelle-etape-4.svg',
        alt: '',
      },
    },
  ];

  return (
    <main role="main">
      <lab-anssi-brique-hero
        titre="MonAideCyber"
        soustitre="Passez à l’action et menons ensemble votre première démarche de
                cybersécurité grâce à notre communauté d’Aidants présente sur
                tout le territoire !"
        illustration={JSON.stringify({
          lien: '/images/illustration-dialogue-mac.svg',
          alt: "scène d'un aidant cyber et d'un aidé faisant un diagnostic",
        })}
        actiongauche={JSON.stringify({
          titre: 'Devenir Aidant cyber',
          lien: '/realiser-des-diagnostics-anssi',
        })}
        actiondroite={JSON.stringify({
          titre: 'Bénéficier d‘un diagnostic cyber',
          lien: liensMesServicesCyber().cyberDepartBrut,
        })}
      ></lab-anssi-brique-hero>

      <lab-anssi-carrousel-tuiles
        tuiles={JSON.stringify(tuiles)}
      ></lab-anssi-carrousel-tuiles>

      <lab-anssi-titre-multimedia
        titre="Découvrez MonAideCyber en vidéo"
        multimedia={JSON.stringify({
          source:
            'https://ressources-mac.cellar-c2.services.clever-cloud.com/Video_MAC.mp4',
        })}
      ></lab-anssi-titre-multimedia>

      <lab-anssi-marelle
        titre="Comment réaliser des diagnostics cyber ?"
        etapesmarelle={JSON.stringify(etapesMarelle)}
        action={JSON.stringify({
          titre: 'Devenir Aidant cyber',
          lien: '/realiser-des-diagnostics-anssi#formulaire-formation',
        })}
      ></lab-anssi-marelle>

      <div className="conteneur-accueil">
        <div className="fr-container"></div>
      </div>

      <div className="conteneur-accueil">
        <div className="fr-container">
          <div id="ce-que-cest" className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-8 fr-col-sm-12">
              <h2>Qu&apos;est-ce que MonAideCyber?</h2>
            </div>
            <div className="fr-col-md-6 fr-col-sm-12">
              <div className="detail bordure-gauche-violette">
                <h3>Une initiative de l’ANSSI</h3>
                <p>
                  Un <b>programme d’accompagnement</b> et de formation gratuit à
                  destination d’une <b>communauté d’Aidants cyber</b> leur
                  permettant de guider leur <b>écosystème</b> pour mettre en
                  œuvre une <b>démarche de cybersécurité.</b>
                </p>
              </div>
            </div>
            <div className="fr-col-md-6 fr-col-sm-12">
              <div className="detail bordure-gauche-jaune">
                <h3>Une démarche concrète</h3>
                <p>
                  <b>Clé-en-main</b> et <b>pédagogique</b>, MonAideCyber rend la
                  cybersécurité accessible à toutes et tous, et facilite la mise
                  en œuvre de <b>premières mesures</b> qui réduisent les risques
                  liés à la <b>cybercriminalité de masse.</b>
                </p>
              </div>
            </div>
            <div className="fr-col-md-6 fr-col-sm-12">
              <div className="detail bordure-gauche-jaune">
                <h3>Une startup d’état</h3>
                <p>
                  <b>MonAideCyber</b> est une start-up d’État incubée au sein du
                  laboratoire d’innovation de l’
                  <b>
                    Agence Nationale de la Sécurité des Systèmes d’Information
                    (ANSSI).
                  </b>
                </p>
              </div>
            </div>
            <div className="fr-col-md-6 fr-col-sm-12">
              <div className="detail bordure-gauche-violette">
                <h3>Pour toutes les entités novices</h3>
                <p>
                  <b>MonAideCyber</b> s’adresse aux{' '}
                  <b>entités publiques, associatives et privées,</b> déjà
                  sensibilisées et de <b>faible maturité cyber</b>, qui{' '}
                  <b>souhaitent s’engager</b> dans une démarche{' '}
                  <b>progressive.</b> Les particuliers ne sont pas concernés.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={couleurSlide}>
          <div className="fr-container">
            <img
              id="guillemets"
              src="/images/icones/guillemets.svg"
              alt="Les mots de"
            />
            <div className="slider">
              <div className="slides">
                <div id="slide-dg" className="fr-container">
                  <div className="fr-grid-row les-mots-de">
                    <div className="titre">Le mot du Directeur Général</div>
                    <div className="contenu">
                      MonAideCyber est un service d’accompagnement, simple et
                      adapté aux entités souhaitant améliorer leur niveau de
                      cybersécurité. Reposant sur un réseau d’experts aidants
                      cyber, MonAideCyber propose une méthode des « petits pas »
                      pour identifier les actions prioritaires, permettant ainsi
                      de tirer vers le haut l’ensemble des acteurs, quels que
                      soient leurs moyens et leur niveau de maturité.
                    </div>
                    <div className="personne">
                      <div className="illustration"></div>
                      <img
                        src="/images/illustration-dg-anssi.png"
                        alt="Directeur Général ANSSI"
                      />
                      <div className="nom">Vincent Strubel</div>
                      <div>Directeur Général de l&apos;ANSSI</div>
                    </div>
                  </div>
                </div>
                <div className="fr-col-6"></div>
                <div id="slide-general" className="fr-container">
                  <div className="fr-grid-row les-mots-de">
                    <div className="titre">Le mot du Général</div>
                    <div className="contenu">
                      L’accompagnement des différentes entités dans leur vie
                      numérique constitue un dénominateur commun de tous les
                      acteurs engagés dans la lutte contre les cybermenaces,
                      dont le commandement du ministère de l’Intérieur dans le
                      cyberespace (COMCYBER-MI). MonAideCyber permettra sans
                      aucun doute à ces mêmes entités d’améliorer leur niveau de
                      maturité cyber, et in fine leur cyberprotection.
                    </div>
                    <div className="personne">
                      <div className="illustration">
                        <img
                          src="/images/illustration-general-gendarmerie.png"
                          alt="Commandant de la Gendarmerie dans le cyberespace"
                        />
                      </div>
                      <div className="nom">Général Husson</div>
                      <div>
                        Commandement du ministère de l’Intérieur dans le
                        cyberespace (COMCYBER-MI)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lien-slider fr-grid-row fr-grid-row--center">
                <div>
                  <a
                    href="#slide-dg"
                    onClick={surCliqueMotDG}
                    className={motDGClique ? 'slider-active' : ''}
                  >
                    &nbsp;
                  </a>
                </div>
                <div>
                  <a
                    href="#slide-general"
                    onClick={surCliqueMotGeneral}
                    className={motGeneralClique ? 'slider-active' : ''}
                  >
                    &nbsp;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
        <div className="fr-container">
          <div className="fr-col-12">
            <h2>Comment fonctionne MonAideCyber ?</h2>
            <div className="etapes">
              <div className="etape">
                <img
                  className="taille-maximale tres-petite-marge-basse"
                  src="/images/illustration-echange.svg"
                  alt="Un Aidé faisant un diagnostic avec un Aidant cyber"
                />
                <div className="numero-etape visible-uniquement-desktop tres-petite-marge-basse numero-1">
                  <span>1</span>
                </div>
                <div>
                  <h4 className="alignement-gauche">
                    Réalisation d&apos;un diagnostic
                  </h4>
                  <p className="alignement-gauche">
                    Réalisation{' '}
                    <b>
                      d’un diagnostic cyber de premier niveau établi par des
                      Aidants cyber
                    </b>{' '}
                    auprès de leurs bénéficiaires. La plateforme contient
                    également un ensemble de <b>ressources et de dispositifs</b>{' '}
                    d’aides complémentaires mis à disposition.
                  </p>
                </div>
                <img
                  className="visible-uniquement-desktop chemin"
                  src="/images/chemin-etape.svg"
                ></img>
              </div>
              <div className="etape pair">
                <img
                  className="taille-maximale tres-petite-marge-basse"
                  src="/images/illustration-marelle.svg"
                  alt="Un Aidé sur un diagnostic"
                />
                <div className="numero-etape visible-uniquement-desktop tres-petite-marge-basse numero-2">
                  <span>2</span>
                </div>
                <div>
                  <h4 className="alignement-gauche">
                    Un référentiel avec des mesures accessibles
                  </h4>
                  <p className="alignement-gauche">
                    Le service de diagnostic accompagné s’appuie sur un{' '}
                    <b>référentiel évolutif de questions</b> et de mesures de
                    sécurité non exhaustives qui se focalise sur les risques de{' '}
                    <b>rançongiciels et de cybercriminalité de masse</b>.
                  </p>
                </div>
                <img
                  className="visible-uniquement-desktop chemin pair"
                  src="/images/chemin-etape.svg"
                ></img>
              </div>
              <div className="etape">
                <img
                  className="taille-maximale tres-petite-marge-basse"
                  src="/images/illustration-mesures.svg"
                  alt="Un Aidé découvrant les mesures à mettre en place"
                />
                <div className="numero-etape visible-uniquement-desktop tres-petite-marge-basse numero-3">
                  <span>3</span>
                </div>
                <div>
                  <h4 className="alignement-gauche">
                    Des mesures priorisées et applicables
                  </h4>
                  <p className="alignement-gauche">
                    À l’issue du <b>diagnostic d’1h30</b>, l’entité
                    diagnostiquée se voit proposer <b>6 mesures de sécurité</b>{' '}
                    à mener en priorité et à mettre en œuvre sur les 6 prochains
                    mois.
                  </p>
                </div>
                <img
                  className="visible-uniquement-desktop chemin"
                  src="/images/chemin-etape.svg"
                ></img>
              </div>
              <div className="etape pair">
                <img
                  className="taille-maximale tres-petite-marge-basse"
                  src="/images/illustration-suivi.svg"
                  alt="Un Aidé accompagné par son Aidant cyber"
                />
                <div className="numero-etape visible-uniquement-desktop tres-petite-marge-basse numero-4">
                  <span>4</span>
                </div>
                <div>
                  <h4 className="alignement-gauche">Un suivi à 6 mois</h4>
                  <p className="alignement-gauche">
                    <b>Un suivi</b> et des conseils complémentaires dans la mise
                    en œuvre de mesures de sécurité avec l’
                    <b>Aidant cyber</b> ayant réalisé le diagnostic peuvent
                    aussi être envisagés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ActionsPiedDePage />
        </div>
      </div>
    </main>
  );
};
