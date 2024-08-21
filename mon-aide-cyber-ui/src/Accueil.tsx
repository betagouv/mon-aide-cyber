import { Header } from './composants/Header.tsx';
import { Footer } from './composants/Footer.tsx';
import React, { useCallback } from 'react';
import { LienMAC } from './composants/LienMAC.tsx';
import FormulaireDeContact from './composants/communs/FormulaireDeContact/FormulaireDeContact.tsx';

export const Accueil = () => {
  const mailMonAideCyber = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      window.location.href = 'mailto:monaidecyber@ssi.gouv.fr';
      e.preventDefault();
    },
    []
  );
  const demandeAide = useCallback(() => {
    window.location.href = '/demande-aide';
  }, []);

  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <main role="main">
        <div className="mode-fonce accueil">
          <div id="presentation" className="fr-container">
            <div className="fr-grid-row fr-grid-row--middle fr-py-20v">
              <div id="corps" className="fr-col-md-6 fr-col-sm-12">
                <h1 className="fr-mb-5w">MonAideCyber</h1>
                <p>
                  Passez à l’action et menons ensemble votre première démarche
                  de cybersécurité grâce à notre communauté d’Aidants présente
                  sur tout le territoire !
                </p>
              </div>
              <div id="illustration" className="fr-col-md-6 fr-col-sm-12">
                <img
                  src="/images/illustration-dialogue-mac.svg"
                  alt="scène d'un aidant et d'un aidé faisant un diagnostic"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="conteneur-accueil">
          <div className="fr-container tuiles">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-md-4 fr-col-sm-12">
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
              <div className="fr-col-md-4 fr-col-sm-12">
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
              <div className="fr-col-md-4 fr-col-sm-12">
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
              <div className="fr-col-8 fr-col-sm-12">
                <h2>Qu&apos;est-ce que MonAideCyber?</h2>
              </div>
              <div className="fr-col-md-6 fr-col-sm-12">
                <div className="detail bordure-gauche-violette">
                  <h3>Une initiative de l’ANSSI</h3>
                  <p>
                    Un <b>programme d’accompagnement</b> et de formation gratuit
                    à destination d’une <b>communauté d’Aidants</b> leur
                    permettant de guider leur <b>écosystème</b> pour mettre en
                    œuvre une <b>démarche de cybersécurité.</b>
                  </p>
                </div>
              </div>
              <div className="fr-col-md-6 fr-col-sm-12">
                <div className="detail bordure-gauche-jaune">
                  <h3>Une démarche concrète</h3>
                  <p>
                    <b>Clé-en-main</b> et <b>pédagogique</b>, MonAideCyber rend
                    la cybersécurité accessible à toutes et tous, et facilite la
                    mise en œuvre de <b>premières mesures</b> qui réduisent les
                    risques liés à la <b>cybercriminalité de masse.</b>
                  </p>
                </div>
              </div>
              <div className="fr-col-md-6 fr-col-sm-12">
                <div className="detail bordure-gauche-jaune">
                  <h3>Une startup d’état</h3>
                  <p>
                    <b>MonAideCyber</b> est une start-up d’État incubée au sein
                    du laboratoire d’innovation de l’
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
          <div className="mode-fonce">
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
                  {/*<div className="fr-col-6"></div>*/}
                  {/*<div id="slide-general" className="fr-container">*/}
                  {/*  <div className="fr-grid-row les-mots-de">*/}
                  {/*    <div className="titre">Le mot du Général</div>*/}
                  {/*    <div className="contenu">*/}
                  {/*      Lorem ipsum dolor sit amet, consectetur adipiscing elit.*/}
                  {/*      Nulla eget condimentum orci, faucibus viverra ipsum.*/}
                  {/*      Aliquam sed lorem turpis. Nunc facilisis leo nec metus*/}
                  {/*      rutrum, eget scelerisque dolor mollis. Curabitur at*/}
                  {/*      tortor non neque hendrerit egestas et vel massa. Integer*/}
                  {/*      ac lectus vitae lacus mollis varius at at quam. Proin*/}
                  {/*      sagittis libero ex. Nunc iaculis non dui vel.*/}
                  {/*    </div>*/}
                  {/*    <div className="personne">*/}
                  {/*      <div className="illustration">*/}
                  {/*        <img*/}
                  {/*          src="/images/illustration-general-gendarmerie.png"*/}
                  {/*          alt="Commandant de la Gendarmerie dans le cyberespace"*/}
                  {/*        />*/}
                  {/*      </div>*/}
                  {/*      <div className="nom">Général Husson</div>*/}
                  {/*      <div>*/}
                  {/*        Commandant de la Gendarmerie dans le cyberespace*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
                {/*<div className="lien-slider fr-grid-row fr-grid-row--center">*/}
                {/*  <div>*/}
                {/*    <a*/}
                {/*      href="#slide-dg"*/}
                {/*      onClick={surCliqueMotDG}*/}
                {/*      className={motDGClique ? 'slider-active' : ''}*/}
                {/*    >*/}
                {/*      &nbsp;*/}
                {/*    </a>*/}
                {/*  </div>*/}
                {/*  <div>*/}
                {/*    <a*/}
                {/*      href="#slide-general"*/}
                {/*      onClick={surCliqueMotGeneral}*/}
                {/*      className={motGeneralClique ? 'slider-active' : ''}*/}
                {/*    >*/}
                {/*      &nbsp;*/}
                {/*    </a>*/}
                {/*  </div>*/}
                {/*</div>*/}
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
                    alt="Un Aidé faisant un diagnostic avec un Aidant"
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
                        Aidants
                      </b>{' '}
                      auprès de leurs bénéficiaires. La plateforme contient
                      également un ensemble de{' '}
                      <b>ressources et de dispositifs</b> d’aides
                      complémentaires mis à disposition.
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
                      sécurité non exhaustives qui se focalise sur les risques
                      de <b>rançongiciels et de cybercriminalité de masse</b>.
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
                      diagnostiquée se voit proposer{' '}
                      <b>6 mesures de sécurité</b> à mener en priorité et à
                      mettre en œuvre sur les 6 prochains mois.
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
                    alt="Un Aidé accompagné par son Aidant"
                  />
                  <div className="numero-etape visible-uniquement-desktop tres-petite-marge-basse numero-4">
                    <span>4</span>
                  </div>
                  <div>
                    <h4 className="alignement-gauche">Un suivi à 6 mois</h4>
                    <p className="alignement-gauche">
                      <b>Un suivi</b> et des conseils complémentaires dans la
                      mise en œuvre de mesures de sécurité avec l’
                      <b>Aidant cyber</b> ayant réalisé le diagnostic peuvent
                      aussi être envisagés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="fr-container participer">
              <div className="conteneur-participer">
                <div className="fr-col-12">
                  <h2>Vous souhaitez participer ?</h2>
                </div>
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-md-6 fr-col-sm-12">
                    <div className="tuile tuile-grande">
                      <div className="illustration">
                        <img
                          src="/images/illustration-devenir-aidant.svg"
                          alt="Deux personnes souhaitant devenir Aidant MonAideCyber"
                        />
                      </div>
                      <div className="corps">
                        <h4>Devenir Aidant</h4>
                        <p>
                          Vous êtes un <b>agent du service public</b>, un{' '}
                          <b>professionnel</b>, un <b>bénévole</b> ou un{' '}
                          <b>passionné</b> de Cyber et vous souhaitez{' '}
                          <b className="violet-fonce">devenir Aidant</b> ?
                        </p>
                        <button
                          type="button"
                          className="fr-btn bouton-mac bouton-mac-primaire"
                          onClick={mailMonAideCyber}
                        >
                          Je veux être Aidant
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="fr-col-md-6 fr-col-sm-12">
                    <div className="tuile tuile-grande">
                      <div className="illustration">
                        <img
                          src="/images/diagnostic/gouvernance/illustration.svg"
                          alt="Des personnes portées par une main leur montrant le chemin."
                        />
                      </div>
                      <div className="corps">
                        <h4>Être Aidé</h4>
                        <p>
                          Vous êtes décideur ou employé d’une{' '}
                          <b>collectivité territoriale</b>, d’une{' '}
                          <b>association</b>, ou d’une <b>entreprise</b> (TPE,
                          PME, ETI...) et vous souhaitez{' '}
                          <b className="violet-fonce">être Aidé</b> ?
                        </p>
                        <button
                          type="button"
                          className="fr-btn bouton-mac bouton-mac-primaire"
                          onClick={demandeAide}
                        >
                          Je veux être Aidé
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FormulaireDeContact />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
