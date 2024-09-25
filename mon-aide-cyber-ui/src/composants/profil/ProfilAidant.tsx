import { useCallback, useEffect, useReducer } from 'react';
import {
  profilCharge,
  profilChargeEnErreur,
  reducteurProfil,
} from './reducteurProfil.ts';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import {
  constructeurParametresAPI,
  ParametresAPI,
} from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { Lien, ReponseHATEOAS } from '../../domaine/Lien.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { ComposantFormulaireModificationMotDePasse } from './ComposantFormulaireModificationMotDePasse.tsx';
import { TypographieH2 } from '../communs/typographie/TypographieH2/TypographieH2.tsx';
import { Profil } from '../../domaine/profil/Profil.ts';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';

type ProprietesComposantProfilAidant = {
  macAPI: {
    execute: <REPONSE, REPONSEAPI, CORPS = void>(
      parametresAPI: ParametresAPI<CORPS>,
      transcris: (contenu: Promise<REPONSEAPI>) => Promise<REPONSE>
    ) => Promise<REPONSE>;
  };
};

export const ComposantProfilAidant = ({
  macAPI,
}: ProprietesComposantProfilAidant) => {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const [etatProfil, envoie] = useReducer(reducteurProfil, {
    nom: '',
    prenom: '',
    email: '',
    dateCreationCompte: '',
    enCoursDeChargement: true,
  });

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-profil',
      (lien: Lien) => {
        if (etatProfil.enCoursDeChargement) {
          macAPI
            .execute<Profil, Profil>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (reponse) => reponse
            )
            .then((profil) => {
              navigationMAC.ajouteEtat(profil.liens);
              envoie(profilCharge(profil));
            })
            .catch((erreur: ReponseHATEOAS) => {
              envoie(profilChargeEnErreur());
              showBoundary(erreur);
            });
        }
      }
    );
  }, [etatProfil.enCoursDeChargement, showBoundary, navigationMAC]);

  const afficherTableauDeBord = useCallback(() => {
    navigationMAC.navigue(
      new MoteurDeLiens(navigationMAC.etat),
      'afficher-tableau-de-bord'
    );
  }, [navigationMAC]);

  return (
    <article className="w-100 ecran-profil">
      <section className="fond-clair-mac">
        <TypographieH2>Mes informations</TypographieH2>
      </section>
      <section>
        <div className="fr-grid-row">
          <div className="fr-col-md-6 fr-col-sm-12">
            <div className="fr-mb-2w">
              Compte Crée le {etatProfil.dateCreationCompte}
            </div>
            <div>
              <button
                className="bouton-mac bouton-mac-secondaire"
                onClick={afficherTableauDeBord}
              >
                Mes diagnostics
              </button>
            </div>
            <div className="fr-mt-2w">
              <hr />
              <div>
                <h4>Informations personnelles</h4>
              </div>
              <fieldset className="fr-mb-5w">
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-md-6 fr-col-sm-12">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="prenom-profil">
                        Prénom
                      </label>
                      <input
                        className="fr-input"
                        type="text"
                        id="prenom-profil"
                        name="prenom-profil"
                        disabled={true}
                        value={etatProfil.prenom}
                      />
                    </div>
                  </div>
                  <div className="fr-col-md-6 fr-col-sm-12">
                    <div className="fr-input-group">
                      <label className="fr-label" htmlFor="nom-profil">
                        Nom de famille
                      </label>
                      <input
                        className="fr-input"
                        type="text"
                        role="textbox"
                        id="nom-profil"
                        name="nom-profil"
                        value={etatProfil.nom}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="fr-col-md-12 fr-mt-2w">
                  <div className="fr-input-group">
                    <label className="fr-label" htmlFor="email-profil">
                      Email
                    </label>
                    <input
                      className="fr-input"
                      type="text"
                      role="textbox"
                      id="email-profil"
                      name="email-profil"
                      value={etatProfil.email}
                      disabled={true}
                    />
                  </div>
                </div>
              </fieldset>
            </div>
            <hr />
            <div>
              <h4>Modifier son mot de passe</h4>
            </div>
            <ComposantFormulaireModificationMotDePasse
              lienModificationMotDePasse={
                navigationMAC.etat['modifier-mot-de-passe']
              }
              macAPI={macAPI}
            />
          </div>
        </div>
      </section>
    </article>
  );
};

export const ProfilAidant = () => {
  return <ComposantProfilAidant macAPI={useMACAPI()} />;
};
