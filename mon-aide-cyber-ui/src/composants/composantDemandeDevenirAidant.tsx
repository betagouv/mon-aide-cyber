import { useReducer } from 'react';
import { Footer } from './Footer.tsx';
import { Header } from './Header.tsx';
import { LienMAC } from './LienMAC.tsx';
import { AutoCompletion } from './auto-completion/AutoCompletion.tsx';

type EtatDemande = {
  prenom: string;
};

enum ActionDemandesDevenirAidant {
  ENVOI_DEMANDE = 'ENVOI_DEMANDE',
}

type Action = { type: ActionDemandesDevenirAidant.ENVOI_DEMANDE };

const reducteurDemandeDevenirAidant = (
  etatDemande: EtatDemande,
  action: Action
): EtatDemande => {
  switch (action.type) {
    case ActionDemandesDevenirAidant.ENVOI_DEMANDE: {
      return {
        ...etatDemande,
      };
    }
  }
};

const envoieDemande = () => ({
  type: ActionDemandesDevenirAidant.ENVOI_DEMANDE,
});

export function ComposantDemandeDevenirAidant() {
  const [_, envoie] = useReducer(reducteurDemandeDevenirAidant, {
    prenom: '',
  });

  return (
    <>
      <>
        <Header
          lienMAC={<LienMAC titre="Accueil - MonAideCyber" route="/" />}
        />
        <main role="main" className="demande-aide">
          <div className="mode-fonce">
            <div className="fr-container">
              <div className="fr-grid-row contenu">
                <h2>Vous souhaitez devenir Aidant MonAideCyber</h2>
                <p>
                  Pour cela, il convient d&apos;effectuer une formation.
                  Complétez le formulaire pour être averti de la prochaine
                  formation prévue dans votre territoir !
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
                      <p>Pour devenir aidant, il est nécessaire de :</p>
                      <ul>
                        <li>
                          participer à une formation animée par l&apos;ANSSI
                        </li>
                        <li>
                          prende connaissance de la charte de l&apos;aidant, qui
                          rappelle notamment le principe de gratuité du
                          dispositif, la signer avant ou après la formation
                        </li>
                      </ul>
                      <p>
                        Veuillez compléter les informations ci-dessous pour être
                        averti de la prochaine session de formation prévue dans
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
                            />
                          </div>
                        </div>
                        <div className="fr-col-12">
                          <div className="fr-input-group">
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
                            />
                          </div>
                        </div>
                        <div className="fr-col-12">
                          <div className="fr-input-group">
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
                            />
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
                                Dans quel département ou DROM-COM êtes-vous
                                situé ?
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
    </>
  );
}
