import { useCallback, useReducer } from 'react';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';
import { LienMAC } from './LienMAC.tsx';
import { AutoCompletion } from './auto-completion/AutoCompletion.tsx';
import { construisErreur, PresentationErreur } from './alertes/Erreurs.tsx';

type ErreursSaisieDemande = {
  prenom?: PresentationErreur;
  nom?: PresentationErreur;
  mail?: PresentationErreur;
};

type EtatDemande = {
  prenom: string;
  nom: string;
  mail: string;
  erreurs?: ErreursSaisieDemande;
};

enum TypeAction {
  DEMANDE_ENVOYEE = 'DEMANDE_ENVOYEE',
  PRENOM_SAISI = 'PRENOM_SAISI',
  NOM_SAISI = 'NOM_SAISI',
  MAIL_SAISI = 'MAIL_SAISI',
}

type Action =
  | { type: TypeAction.DEMANDE_ENVOYEE }
  | { type: TypeAction.PRENOM_SAISI; saisie: string }
  | { type: TypeAction.NOM_SAISI; saisie: string }
  | { type: TypeAction.MAIL_SAISI; saisie: string };

const estVide = (chaine: string): boolean => chaine === '';

const contientUnChiffre = (chaine: string): boolean =>
  chaine.match(/[0-9]+/) !== null;

const estPrenomValide = (prenom: string): boolean =>
  !estVide(prenom) && !contientUnChiffre(prenom);

const estMailValide = (email: string) =>
  email.trim().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) !==
  null;

const reducteurDemandeDevenirAidant = (
  etatDemande: EtatDemande,
  action: Action
): EtatDemande => {
  switch (action.type) {
    case TypeAction.DEMANDE_ENVOYEE: {
      delete etatDemande.erreurs;

      return {
        erreurs: {
          ...(!estPrenomValide(etatDemande.prenom)
            ? construisErreur('prenom', {
                identifiantTexteExplicatif: 'prenom',
                texte: 'Veuillez saisir un prénom valide',
              })
            : undefined),
          ...(!estPrenomValide(etatDemande.nom)
            ? construisErreur('nom', {
                identifiantTexteExplicatif: 'nom',
                texte: 'Veuillez saisir un nom valide',
              })
            : undefined),
          ...(!estMailValide(etatDemande.mail)
            ? construisErreur('mail', {
                identifiantTexteExplicatif: 'mail',
                texte: 'Veuillez saisir un mail valide',
              })
            : undefined),
        },
        ...etatDemande,
      };
    }

    case TypeAction.PRENOM_SAISI: {
      delete etatDemande.erreurs?.prenom;

      return {
        ...etatDemande,
        prenom: action.saisie,
      };
    }

    case TypeAction.NOM_SAISI: {
      delete etatDemande.erreurs?.nom;

      return {
        ...etatDemande,
        nom: action.saisie,
      };
    }

    case TypeAction.MAIL_SAISI: {
      delete etatDemande.erreurs?.mail;

      return {
        ...etatDemande,
        mail: action.saisie,
      };
    }
  }
};

const envoieDemande = (): Action => ({
  type: TypeAction.DEMANDE_ENVOYEE,
});

const saisiPrenom = (saisie: string): Action => ({
  type: TypeAction.PRENOM_SAISI,
  saisie,
});

const saisieNom = (saisie: string): Action => ({
  type: TypeAction.NOM_SAISI,
  saisie,
});

const initialiseDemande = (): EtatDemande => ({
  prenom: '',
  nom: '',
  mail: '',
});

const saisieMail = (saisie: string): Action => ({
  type: TypeAction.MAIL_SAISI,
  saisie,
});

export const ComposantDemandeDevenirAidant = () => {
  const [etatDemande, envoie] = useReducer(
    reducteurDemandeDevenirAidant,
    initialiseDemande()
  );

  const surSaisiePrenom = useCallback((saisie: string) => {
    envoie(saisiPrenom(saisie));
  }, []);

  const surSaisieNom = useCallback((saisie: string) => {
    envoie(saisieNom(saisie));
  }, []);

  const surSaisieMail = useCallback((saisie: string) => {
    envoie(saisieMail(saisie));
  }, []);

  return (
    <>
      <Header lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />} />
      <main role="main" className="demande-aide">
        <div className="mode-fonce">
          <div className="fr-container">
            <div className="fr-grid-row contenu">
              <h2>Vous souhaitez devenir Aidant MonAideCyber</h2>
              <p>
                Pour cela, il convient d&apos;effectuer une formation. Complétez
                le formulaire pour être averti de la prochaine formation prévue
                sur votre territoire !
              </p>
            </div>
          </div>
        </div>
        <div className="fond-clair-mac">
          <div className="fr-container">
            <div className="fr-grid-row fr-grid-row--center">
              <div className="fr-col-md-8 fr-col-sm-12 section">
                <div className="fr-mb-2w">
                  Demande d&apos;inscription à une formation MonAideCyber
                </div>
                <div className="fr-mt-2w">
                  <div>
                    <h5>Vous souhaitez devenir Aidant MonAideCyber</h5>
                    <p>Pour devenir aidant, il est nécessaire de&nbsp;:</p>
                    <ul>
                      <li>
                        participer à une formation animée par l&apos;ANSSI
                      </li>
                      <li>
                        prendre connaissance de la charte de l&apos;aidant, qui
                        rappelle notamment le principe de gratuité du
                        dispositif, et la signer avant ou après la formation
                      </li>
                    </ul>
                    <p>
                      Veuillez compléter les informations ci-dessous pour être
                      averti de la prochaine session de formation prévue sur
                      votre territoire.
                    </p>
                  </div>
                </div>
                <div className="champs-obligatoire">
                  <span className="asterisque">*</span>
                  <span> Champ obligatoire</span>
                </div>
                <form>
                  <fieldset className="fr-mb-5w">
                    <div className="fr-grid-row fr-grid-row--gutters">
                      <div className="fr-col-12">
                        <div className="fr-input-group">
                          <div
                            className={`fr-input-group ${
                              etatDemande.erreurs
                                ? etatDemande.erreurs.prenom?.className
                                : ''
                            }`}
                          >
                            <label className="fr-label" htmlFor="prenom">
                              <span className="asterisque">*</span>
                              <span> Votre prénom :</span>
                            </label>
                            <input
                              className="fr-input"
                              type="text"
                              id="prenom"
                              name="prenom"
                              placeholder="Exemple : Martin"
                              onChange={(e) => surSaisiePrenom(e.target.value)}
                            />
                            {etatDemande.erreurs?.prenom?.texteExplicatif}
                          </div>
                        </div>
                      </div>
                      <div className="fr-col-12">
                        <div className="fr-input-group">
                          <div
                            className={`fr-input-group ${
                              etatDemande.erreurs
                                ? etatDemande.erreurs.nom?.className
                                : ''
                            }`}
                          >
                            <label className="fr-label" htmlFor="nom">
                              <span className="asterisque">*</span>
                              <span> Votre nom :</span>
                            </label>
                            <input
                              className="fr-input"
                              type="text"
                              id="nom"
                              name="nom"
                              placeholder="Exemple : Dubois"
                              onChange={(e) => surSaisieNom(e.target.value)}
                            />
                            {etatDemande.erreurs?.nom?.texteExplicatif}
                          </div>
                        </div>
                      </div>
                      <div className="fr-col-12">
                        <div className="fr-input-group">
                          <div
                            className={`fr-input-group ${
                              etatDemande.erreurs
                                ? etatDemande.erreurs.mail?.className
                                : ''
                            }`}
                          >
                            <label className="fr-label" htmlFor="mail">
                              <span className="asterisque">*</span>
                              <span> Votre adresse électronique :</span>
                            </label>
                            <input
                              className="fr-input"
                              type="text"
                              id="mail"
                              name="mail"
                              placeholder="Exemple : martin@mail.com"
                              onChange={(e) => surSaisieMail(e.target.value)}
                            />
                            {etatDemande.erreurs?.mail?.texteExplicatif}
                          </div>
                        </div>
                      </div>
                      <div className="fr-col-12">
                        <div className="fr-input-group">
                          <label
                            className="fr-label"
                            htmlFor="departement-drom-com"
                          >
                            <span className="asterisque">*</span>
                            <span>
                              {' '}
                              Dans quel département ou DROM-COM êtes-vous situé
                              ?
                            </span>
                          </label>
                          <AutoCompletion<{ nom: string }>
                            nom="departement"
                            suggestionsInitiales={[
                              { nom: 'departement 1' },
                              { nom: 'departement 2' },
                              { nom: 'departement 3' },
                            ]}
                            mappeur={(
                              departement: string | { nom: string }
                            ) => {
                              return typeof departement === 'string'
                                ? departement
                                : departement.nom;
                            }}
                            surSelection={() => {
                              return;
                            }}
                            surSaisie={() => {
                              return;
                            }}
                            clefsFiltrage={['nom']}
                            valeurSaisie={{
                              nom: 'Exemple : Gironde',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
                      <button
                        type="button"
                        key="envoyer-demande-devenir-aidant"
                        className="fr-btn bouton-mac bouton-mac-primaire"
                        onClick={() => envoie(envoieDemande())}
                      >
                        Envoyer
                      </button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
