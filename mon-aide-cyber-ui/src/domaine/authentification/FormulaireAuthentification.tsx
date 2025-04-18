import { useNavigationMAC, useUtilisateur } from '../../fournisseurs/hooks.ts';
import { FormEvent, useCallback, useReducer } from 'react';
import {
  authentificationInvalidee,
  identifiantSaisi,
  initialiseReducteur,
  motDePasseSaisi,
  reducteurAuthentification,
  saisieInvalidee,
} from './reducteurAuthentification.tsx';
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
  ROUTE_MON_ESPACE_VALIDER_CGU,
} from '../MoteurDeLiens.ts';
import { Lien } from '../Lien.ts';
import { ReponseAuthentification } from './Authentification.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MACAPIType, useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { useRecupereContexteNavigation } from '../../hooks/useRecupereContexteNavigation.ts';
import { Input } from '../../composants/atomes/Input/Input.tsx';
import { PasswordInput } from '../../composants/atomes/Input/PasswordInput.tsx';
import Button from '../../composants/atomes/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

export type Identifiants = {
  identifiant: string;
  motDePasse: string;
};

type ProprietesComposantAuthentification = {
  macAPI: MACAPIType;
};

export const ComposantAuthentification = ({
  macAPI,
}: ProprietesComposantAuthentification) => {
  const navigationMAC = useNavigationMAC();
  useRecupereContexteNavigation('se-connecter');
  const navigate = useNavigate();

  const { setUtilisateurConnecte } = useUtilisateur();

  const [etatAuthentification, envoie] = useReducer(
    reducteurAuthentification,
    initialiseReducteur()
  );

  const surSaisieMoteDePasse = useCallback((motDePasse: string) => {
    envoie(motDePasseSaisi(motDePasse));
  }, []);

  const surSaisieIdentifiant = useCallback((identifiant: string) => {
    envoie(identifiantSaisi(identifiant));
  }, []);

  const connexion = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const saisieValide = etatAuthentification.saisieValide();
      if (!saisieValide) {
        envoie(saisieInvalidee());
      } else {
        new MoteurDeLiens(navigationMAC.etat).trouve(
          'se-connecter',
          (lien: Lien) => {
            macAPI
              .execute<
                ReponseAuthentification,
                ReponseAuthentification,
                Identifiants
              >(
                constructeurParametresAPI<Identifiants>()
                  .url(lien.url)
                  .methode(lien.methode!)
                  .corps({
                    identifiant: etatAuthentification.identifiant,
                    motDePasse: etatAuthentification.motDePasse,
                  })
                  .construis(),
                async (reponse) => await reponse
              )
              .then((reponse) => {
                setUtilisateurConnecte({
                  nomPrenom: reponse.nomPrenom,
                  email: reponse.email,
                });
                const moteurDeLiens = new MoteurDeLiens({ ...reponse.liens });

                const actionValiderProfilAidant = moteurDeLiens.trouveEtRenvoie(
                  'valider-profil-aidant'
                );
                const actionValiderProfilUtilisateurInscrit =
                  moteurDeLiens.trouveEtRenvoie(
                    'valider-profil-utilisateur-inscrit'
                  );

                if (
                  actionValiderProfilAidant ||
                  actionValiderProfilUtilisateurInscrit
                ) {
                  return navigationMAC.navigue(
                    `${ROUTE_MON_ESPACE}/mon-utilisation-du-service`,
                    reponse.liens
                  );
                }

                moteurDeLiens.trouve(
                  'afficher-tableau-de-bord',
                  () =>
                    navigationMAC.navigue(
                      `${ROUTE_MON_ESPACE}/tableau-de-bord`,
                      { ...reponse.liens }
                    ),
                  () =>
                    moteurDeLiens.trouve('valider-signature-cgu', () =>
                      navigationMAC.navigue(`${ROUTE_MON_ESPACE_VALIDER_CGU}`, {
                        ...reponse.liens,
                      })
                    )
                );
              })
              .catch((erreur) => envoie(authentificationInvalidee(erreur)));
          }
        );
      }
    },
    [etatAuthentification]
  );

  const erreur = etatAuthentification.erreur;
  return (
    <>
      <form onSubmit={connexion}>
        <section>
          <div>
            <fieldset className="fr-mb-5w">
              <div
                className={`fr-input-group ${
                  erreur ? erreur?.identifiant?.className : ''
                }`}
              >
                <label className="fr-label" htmlFor="identifiant-connexion">
                  Votre adresse électronique
                </label>
                <Input
                  type="text"
                  id="identifiant-connexion"
                  name="identifiant-connexion"
                  autoComplete="email"
                  onChange={(e) => surSaisieIdentifiant(e.target.value)}
                />
                {erreur?.identifiant?.texteExplicatif}
              </div>
              <div
                className={`fr-input-group ${
                  erreur ? erreur?.motDePasse?.className : ''
                }`}
              >
                <label className="fr-label" htmlFor="mot-de-passe">
                  Votre mot de passe
                </label>
                <PasswordInput
                  role="textbox"
                  id="mot-de-passe"
                  name="mot-de-passe"
                  autoComplete="current-password"
                  onChange={(e) => surSaisieMoteDePasse(e.target.value)}
                />
                {erreur?.motDePasse?.texteExplicatif}
              </div>
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/utilisateur/mot-de-passe-oublie')}
              >
                Mot de passe oublié ?
              </Button>
            </fieldset>
          </div>
          <div className="fr-grid-row fr-grid-row--center">
            <button
              type="submit"
              key="connexion-aidant"
              className="fr-btn bouton-mac bouton-mac-primaire"
            >
              Se connecter
            </button>
          </div>
          <div className="fr-mt-2w">{etatAuthentification.champsErreur}</div>
        </section>
      </form>
    </>
  );
};
export const FormulaireAuthentification = () => {
  return <ComposantAuthentification macAPI={useMACAPI()} />;
};
