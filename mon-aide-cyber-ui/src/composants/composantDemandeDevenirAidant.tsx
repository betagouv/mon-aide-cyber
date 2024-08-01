import { useCallback, useEffect, useReducer, useState } from 'react';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';
import { LienMAC } from './LienMAC.tsx';
import { AutoCompletion } from './auto-completion/AutoCompletion.tsx';
import { construisErreur, PresentationErreur } from './alertes/Erreurs.tsx';
import { useMACAPI } from '../fournisseurs/hooks.ts';
import { Departement } from '../domaine/demande-aide/Aide.ts';
import { estDepartement } from './demande-aide/SaisieInformations.tsx';

type ErreursSaisieDemande = {
  prenom?: PresentationErreur;
  nom?: PresentationErreur;
  mail?: PresentationErreur;
  departement?: PresentationErreur;
};

type EtatDemande = {
  prenom: string;
  nom: string;
  mail: string;
  departementSaisi: Departement;
  departementsProposes: Departement[];
  erreurs?: ErreursSaisieDemande;
};

enum TypeAction {
  DEMANDE_VALIDEE = 'DEMANDE_VALIDEE',
  PRENOM_SAISI = 'PRENOM_SAISI',
  NOM_SAISI = 'NOM_SAISI',
  MAIL_SAISI = 'MAIL_SAISI',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  DEPARTEMENTS_PROPOSES = 'DEPARTEMENT_PROPOSES',
}

type Action =
  | { type: TypeAction.DEMANDE_VALIDEE }
  | { type: TypeAction.PRENOM_SAISI; saisie: string }
  | { type: TypeAction.NOM_SAISI; saisie: string }
  | { type: TypeAction.MAIL_SAISI; saisie: string }
  | { type: TypeAction.DEPARTEMENT_SAISI; saisie: string | Departement }
  | { type: TypeAction.DEPARTEMENTS_PROPOSES; departements: Departement[] };

const estVide = (chaine: string): boolean => chaine === '';

const contientUnChiffre = (chaine: string): boolean =>
  chaine.match(/[0-9]+/) !== null;

const estPrenomValide = (prenom: string): boolean =>
  !estVide(prenom) && !contientUnChiffre(prenom);

const estMailValide = (email: string) =>
  email.trim().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) !==
  null;

const trouveDepartement = (
  nomDepartement: string,
  listeDepartements: Departement[]
): Departement | undefined =>
  listeDepartements.find(({ nom }) => nom === nomDepartement);

const reducteurDemandeDevenirAidant = (
  etatDemande: EtatDemande,
  action: Action
): EtatDemande => {
  switch (action.type) {
    case TypeAction.DEMANDE_VALIDEE: {
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
          ...(!trouveDepartement(
            etatDemande.departementSaisi.nom || '',
            etatDemande.departementsProposes
          )
            ? construisErreur('departement', {
                identifiantTexteExplicatif: 'departement',
                texte: 'Veuillez sélectionner un département dans la liste',
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

    case TypeAction.DEPARTEMENT_SAISI: {
      delete etatDemande.erreurs?.departement;

      const nomDepartementSaisi = estDepartement(action.saisie)
        ? action.saisie.nom
        : action.saisie;

      return {
        ...etatDemande,
        departementSaisi:
          trouveDepartement(
            nomDepartementSaisi,
            etatDemande.departementsProposes
          ) || ({} as Departement),
      };
    }

    case TypeAction.DEPARTEMENTS_PROPOSES: {
      return {
        ...etatDemande,
        departementsProposes: action.departements,
      };
    }
  }
};

type ReponseDemandeInitiee = PreRequisDemande;

type PreRequisDemande = {
  departements: Departement[];
};

const initialiseDemande = (): EtatDemande => ({
  prenom: '',
  nom: '',
  mail: '',
  departementSaisi: {} as Departement,
  departementsProposes: [],
});

const valideDemande = (): Action => ({
  type: TypeAction.DEMANDE_VALIDEE,
});

const saisiPrenom = (saisie: string): Action => ({
  type: TypeAction.PRENOM_SAISI,
  saisie,
});

const saisieNom = (saisie: string): Action => ({
  type: TypeAction.NOM_SAISI,
  saisie,
});

const saisieMail = (saisie: string): Action => ({
  type: TypeAction.MAIL_SAISI,
  saisie,
});

const saisieDepartement = (saisie: Departement | string): Action => ({
  type: TypeAction.DEPARTEMENT_SAISI,
  saisie,
});

function proposeDepartements(departements: Departement[]): Action {
  return {
    type: TypeAction.DEPARTEMENTS_PROPOSES,
    departements,
  };
}

export const ComposantDemandeDevenirAidant = () => {
  const macAPI = useMACAPI();
  const [prerequisDemande, setPrerequisDemande] = useState<
    PreRequisDemande | undefined
  >();
  const [etatDemande, envoie] = useReducer(
    reducteurDemandeDevenirAidant,
    initialiseDemande()
  );

  useEffect(() => {
    macAPI
      .appelle<ReponseDemandeInitiee>(
        { url: '/api/demandes/devenir-aidant', methode: 'GET' },
        (corps) => corps
      )
      .then((reponse) => {
        setPrerequisDemande({ departements: reponse.departements });
      });
  }, [macAPI]);

  useEffect(() => {
    if (prerequisDemande) {
      envoie(proposeDepartements(prerequisDemande.departements));
    }
  }, [prerequisDemande]);

  const surSaisiePrenom = useCallback((saisie: string) => {
    envoie(saisiPrenom(saisie));
  }, []);

  const surSaisieNom = useCallback((saisie: string) => {
    envoie(saisieNom(saisie));
  }, []);

  const surSaisieMail = useCallback((saisie: string) => {
    envoie(saisieMail(saisie));
  }, []);

  const surSaisieDepartement = useCallback((saisie: Departement | string) => {
    envoie(saisieDepartement(saisie));
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
                          <div
                            className={`fr-input-group ${
                              etatDemande.erreurs
                                ? etatDemande.erreurs.departement?.className
                                : ''
                            }`}
                          >
                            <label
                              className="fr-label"
                              htmlFor="departement-drom-com"
                            >
                              <span className="asterisque">*</span>
                              <span>
                                {' '}
                                Dans quel département ou DROM-COM êtes-vous
                                situé ?
                              </span>
                            </label>

                            <AutoCompletion<Departement>
                              nom="departement"
                              suggestionsInitiales={
                                prerequisDemande?.departements || []
                              }
                              mappeur={(departement) =>
                                estDepartement(departement)
                                  ? `${departement.code} - ${departement.nom}`
                                  : typeof departement === 'string'
                                    ? departement
                                    : ''
                              }
                              surSelection={(departement) => {
                                surSaisieDepartement(departement);
                              }}
                              surSaisie={(departement) => {
                                surSaisieDepartement(departement);
                              }}
                              clefsFiltrage={['code', 'nom']}
                              valeurSaisie={etatDemande.departementSaisi}
                            />
                            {etatDemande.erreurs?.departement?.texteExplicatif}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
                      <button
                        type="button"
                        key="envoyer-demande-devenir-aidant"
                        className="fr-btn bouton-mac bouton-mac-primaire"
                        onClick={() => envoie(valideDemande())}
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
