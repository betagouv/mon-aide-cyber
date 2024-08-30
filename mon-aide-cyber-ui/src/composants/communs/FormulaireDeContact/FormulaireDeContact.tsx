import { FormEvent, useCallback, useEffect, useReducer } from 'react';
import {
  emailSaisi,
  envoiMessageInvalide,
  messageComplete,
  messageEnvoye,
  messageSaisi,
  nomSaisi,
  reducteurEnvoiMessageContact,
} from '../../../reducteurs/reducteurEnvoiMessageContact';
import { Message } from '../../../domaine/contact/Message';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { macAPI } from '../../../fournisseurs/api/macAPI.ts';

export const FormulaireDeContact = () => {
  const [etatMessage, envoie] = useReducer(reducteurEnvoiMessageContact, {
    nom: '',
    email: '',
    message: '',
    erreur: {},
    saisieValide: () => false,
  });
  const erreur = etatMessage.erreur;

  const envoieMessage = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    envoie(messageComplete());
  }, []);

  useEffect(() => {
    if (etatMessage.saisieValide() && !etatMessage.messageEnvoye) {
      macAPI
        .execute<void, void, Message>(
          constructeurParametresAPI<Message>()
            .url('/contact')
            .methode('POST')
            .corps({
              nom: etatMessage.nom,
              email: etatMessage.email,
              message: etatMessage.message,
            })
            .construis(),
          () => Promise.resolve()
        )
        .then(() => envoie(messageEnvoye()))
        .catch((erreur) => envoie(envoiMessageInvalide(erreur as Error)));
    }
  }, [etatMessage]);

  const surSaisieNom = useCallback((nom: string) => {
    envoie(nomSaisi(nom));
  }, []);
  const surSaisieEmail = useCallback((email: string) => {
    envoie(emailSaisi(email));
  }, []);
  const surSaisieMessage = useCallback((message: string) => {
    envoie(messageSaisi(message));
  }, []);

  return (
    <section className="mode-fonce contactez-nous">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div className="fr-col-md-5 fr-col-sm-12 fr-col-offset-1--right">
            <h2>Contactez-nous !</h2>
            <p>
              Vous avez des <b>questions</b> sur MonAideCyber ?
              <br />
              Toute l’équipe est à votre écoute.
            </p>
          </div>
          <div className="fr-col-md-6 fr-col-sm-12">
            <form onSubmit={envoieMessage}>
              <section>
                <div className="fr-col-12">
                  <fieldset>
                    <div className="fr-grid-row fr-grid-row--gutters">
                      <div className="fr-col-md-6 fr-col-sm-12">
                        <div
                          className={`fr-input-group ${
                            erreur ? erreur?.nom?.className : ''
                          }`}
                        >
                          <label className="fr-label" htmlFor="votre-nom">
                            Votre Nom
                          </label>
                          <input
                            className="fr-input"
                            type="text"
                            id={'votre-nom'}
                            name="votre-nom"
                            autoComplete={'name'}
                            onChange={(e) => surSaisieNom(e.target.value)}
                            value={etatMessage.nom}
                          />
                          {erreur?.nom?.texteExplicatif}
                        </div>
                      </div>
                      <div className="fr-col-md-6 fr-col-sm-12">
                        <div
                          className={`fr-input-group ${
                            erreur ? erreur?.email?.className : ''
                          }`}
                        >
                          <label className="fr-label" htmlFor="votre-email">
                            Votre adresse email
                          </label>
                          <input
                            className="fr-input"
                            type="text"
                            role="textbox"
                            id="votre-email"
                            name="votre-email"
                            autoComplete={'email'}
                            onChange={(e) => surSaisieEmail(e.target.value)}
                            value={etatMessage.email}
                          />
                          {erreur?.email?.texteExplicatif}
                        </div>
                      </div>
                    </div>
                    <div className="fr-mt-3w">
                      <div
                        className={`fr-input-group ${
                          erreur ? erreur?.message?.className : ''
                        }`}
                      >
                        <label className="fr-label" htmlFor="votre-message">
                          Votre message
                        </label>
                        <textarea
                          className="fr-input"
                          id="votre-message"
                          name="votre-message"
                          rows={4}
                          onChange={(e) => surSaisieMessage(e.target.value)}
                          value={etatMessage.message}
                        ></textarea>
                        {erreur?.message?.texteExplicatif}
                      </div>
                    </div>
                    <div className="fr-mt-3w">
                      <button
                        type="submit"
                        key="connexion-aidant"
                        className="fr-btn bouton-mac bouton-mac-primaire-inverse"
                      >
                        Envoyer le message
                      </button>
                      {etatMessage.messageEnvoye &&
                      !etatMessage.champsErreur ? (
                        <p id="message-envoye" className="fr-valid-text">
                          Message envoyé
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="fr-mt-2w">{etatMessage.champsErreur}</div>
                  </fieldset>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
