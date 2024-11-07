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
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { Lien } from '../../domaine/Lien.ts';
import { ReponseAuthentification } from '../../domaine/authentification/Authentification.ts';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { MACAPIType, useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { useRecupereContexteNavigation } from '../../hooks/useRecupereContexteNavigation.ts';
import { Input } from '../atomes/Input/Input.tsx';
import { PasswordInput } from '../atomes/Input/PasswordInput.tsx';

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
                setUtilisateurConnecte({ nomPrenom: reponse.nomPrenom });
                const moteurDeLiens = new MoteurDeLiens({
                  ...reponse.liens,
                });

                moteurDeLiens.trouve(
                  'afficher-tableau-de-bord',
                  () =>
                    navigationMAC.navigue(
                      moteurDeLiens,
                      'afficher-tableau-de-bord'
                    ),
                  () =>
                    moteurDeLiens.trouve('creer-espace-aidant', () =>
                      navigationMAC.navigue(
                        moteurDeLiens,
                        'creer-espace-aidant'
                      )
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
