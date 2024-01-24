import { Header } from './composants/Header.tsx';
import { Footer } from './composants/Footer.tsx';
import { PropsWithChildren, ReactNode, useCallback, useState } from 'react';

type ProprietesComposantEtape = {
  illustration: { chemin: string; texteAlternatif: string };
  numeroEtape: number;
};

type ProprietesComposantEtape2 = {
  elementDroite: ReactNode;
  elementGauche: ReactNode;
  numeroEtape: number;
};

const ComposantEtape = (
  proprietes: PropsWithChildren<ProprietesComposantEtape2>,
) => {
  return (
    <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      {proprietes.elementGauche}
      <div className="fr-col-2 fr-grid-row fr-grid-row--center">
        <div className={`etape etape-${proprietes.numeroEtape}`}>
          <i>{proprietes.numeroEtape}</i>
        </div>
      </div>
      {proprietes.elementDroite}
    </div>
  );
};
const ComposantEtapeDroite = (
  proprietes: PropsWithChildren<ProprietesComposantEtape>,
) => {
  return (
    <ComposantEtape
      elementDroite={
        <div className="fr-col-5">
          <img
            src={proprietes.illustration.chemin}
            alt={proprietes.illustration.texteAlternatif}
            className="illustration"
          />
        </div>
      }
      elementGauche={
        <div className="fr-col-4 fr-col-offset-1">{proprietes.children}</div>
      }
      numeroEtape={proprietes.numeroEtape}
    />
  );
};
const ComposantEtapeGauche = (
  proprietes: PropsWithChildren<ProprietesComposantEtape>,
) => {
  return (
    <ComposantEtape
      elementDroite={
        <div className="fr-col-4 fr-col-offset-1--right">
          {proprietes.children}
        </div>
      }
      elementGauche={
        <div className="fr-col-5">
          <img
            src={proprietes.illustration.chemin}
            alt={proprietes.illustration.texteAlternatif}
            className="illustration"
          />
        </div>
      }
      numeroEtape={proprietes.numeroEtape}
    />
  );
};

export const Accueil = () => {
  const [motDGClique, setMotDGClique] = useState<boolean>(true);
  const [motGeneralClique, setMotGeneralClique] = useState<boolean>(false);

  const surCliqueMotDG = useCallback(() => {
    setMotGeneralClique(false);
    setMotDGClique(true);
  }, []);

  const surCliqueMotGeneral = useCallback(() => {
    setMotDGClique(false);
    setMotGeneralClique(true);
  }, []);
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
        <div className="conteneur-accueil">
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
                        MonAideCyber aiguille les entités vers des dispositifs
                        et des tiers de confiance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fr-container">
            <div id="ce-que-cest" className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-8">
                <h2>Qu&apos;est-ce que MonAideCyber ?</h2>
              </div>
              <div className="fr-col-6">
                <div className="detail bordure-gauche-violette">
                  <h3>Une initiative de l’État</h3>
                  Un <b>programme d’accompagnement</b> et de formation gratuit à
                  destination d’une <b>communauté d’Aidants</b> leur permettant
                  de guider leur <b>écosystème</b> pour mettre en œuvre une{' '}
                  <b>démarche de cybersécurité.</b>
                </div>
              </div>
              <div className="fr-col-6">
                <div className="detail bordure-gauche-jaune">
                  <h3>Une démarche concrète</h3>
                  <b>Clé-en-main</b> et <b>pédagogique</b>, MonAideCyber rend la
                  cybersécurité accessible à toutes et tous, et facilite la mise
                  en œuvre de <b>premières mesures</b> qui réduisent les risques
                  liés à la <b>cybercriminalité de masse.</b>
                </div>
              </div>
              <div className="fr-col-6">
                <div className="detail bordure-gauche-jaune">
                  <h3>Une startup d’état</h3>
                  <b>MonAideCyber</b> est une start-up d’État incubée au sein du
                  laboratoire d’innovation de l’
                  <b>
                    Agence Nationale de la Sécurité des Systèmes d’Information
                    (ANSSI).
                  </b>
                </div>
              </div>
              <div className="fr-col-6">
                <div className="detail bordure-gauche-violette">
                  <h3>Pour toutes les entités novices</h3>
                  <b>MonAideCyber</b> s’adresse aux{' '}
                  <b>entités publiques, associatives et privées,</b> déjà
                  sensibilisées et de <b>faible maturité cyber</b>, qui{' '}
                  <b>souhaitent s’engager</b> dans une démarche{' '}
                  <b>progressive.</b> Les particuliers ne sont pas concernés.
                </div>
              </div>
            </div>
          </div>
          <div className="bandeau-violet">
            <div className="fr-container">
              <img src="/images/icones/guillemets.svg" alt="Les mots de" />
              <div className="slider">
                <div className="slides">
                  <div id="slide-dg" className="fr-container">
                    <div className="fr-grid-row les-mots-de">
                      <div className="titre">Le mot du Directeur Général</div>
                      <div className="contenu">
                        MonAideCyber est un service d’accompagnement, simple et
                        adapté aux entités souhaitant améliorer leur niveau de
                        cybersécurité. Reposant sur un réseau d’experts aidants,
                        MonAideCyber propose une méthode des « petits pas » pour
                        identifier les actions prioritaires, permettant ainsi de
                        tirer vers le haut l’ensemble des acteurs, quels que
                        soit leurs moyens et leur niveau de maturité.
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nulla eget condimentum orci, faucibus viverra ipsum.
                        Aliquam sed lorem turpis. Nunc facilisis leo nec metus
                        rutrum, eget scelerisque dolor mollis. Curabitur at
                        tortor non neque hendrerit egestas et vel massa. Integer
                        ac lectus vitae lacus mollis varius at at quam. Proin
                        sagittis libero ex. Nunc iaculis non dui vel.
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
                          Commandant de la Gendarmerie dans le cyberespace
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
          <div className="fr-container comment-fonctionne-mon-aide-cyber">
            <div className="fr-col-12">
              <h2>Comment fonctionne MonAideCyber ?</h2>
            </div>
            <div className="etapes">
              <ComposantEtapeGauche
                illustration={{
                  chemin: '/images/illustration-echange.svg',
                  texteAlternatif:
                    'Un Aidé faisant un diagnostic avec un Aidant',
                }}
                numeroEtape={1}
              >
                <h4>Réalisation d’un diagnostic</h4>
                Réalisation{' '}
                <b>
                  d’un diagnostic cyber de premier niveau établi par des Aidants
                </b>{' '}
                auprès de leurs bénéficiaires. La plateforme contient également
                un ensemble de <b>ressources et de dispositifs</b> d’aides
                complémentaires mis à disposition.
              </ComposantEtapeGauche>
              <ComposantEtapeDroite
                illustration={{
                  chemin: '/images/illustration-marelle.svg',
                  texteAlternatif: 'Un Aidé avançant sur un diagnostic',
                }}
                numeroEtape={2}
              >
                <h4>Un référentiel avec des mesures accessibles</h4>
                Le service de diagnostic accompagné s’appuie sur un{' '}
                <b>référentiel évolutif de questions</b> et de mesures de
                sécurité non exhaustif inspiré en particulier du guide{' '}
                <b>« La cybersécurité pour les TPE/PME en 13 questions »</b> de
                l’ANSSI.
              </ComposantEtapeDroite>
              <ComposantEtapeGauche
                illustration={{
                  chemin: '/images/illustration-mesures.svg',
                  texteAlternatif:
                    'Un Aidé découvrant les mesures à mettre en place',
                }}
                numeroEtape={3}
              >
                <h4>Des mesures priorisées et applicables</h4>À l’issue du{' '}
                <b>diagnostic d’1h30</b>, l’entité diagnostiquée se voit
                proposer <b>6 mesures de sécurité</b> à mener en priorité et à
                mettre en œuvre sur les 6 prochains mois.
              </ComposantEtapeGauche>
              <ComposantEtapeDroite
                illustration={{
                  chemin: '/images/illustration-suivi.svg',
                  texteAlternatif: 'Un Aidé accompagné par son Aidant',
                }}
                numeroEtape={4}
              >
                <h4>Un suivi à 6 mois</h4>
                <b>Un suivi</b> et des conseils complémentaires dans la mise en
                œuvre de mesures de sécurité avec l’<b>Aidant cyber</b> ayant
                réalisé le diagnostic peuvent aussi être envisagés.
              </ComposantEtapeDroite>
            </div>
          </div>
          <div id="participer" className="fr-container">
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
};
