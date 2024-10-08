import { ReactElement, useCallback, useState } from 'react';

import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';
import { ParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ComposantFormulaireModificationMotDePasse } from './ComposantFormulaireModificationMotDePasse.tsx';
import { TypographieH2 } from '../communs/typographie/TypographieH2/TypographieH2.tsx';
import { MACAPIType, useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { useFormulaireInformationsAidant } from './useFormulaireInformationsAidant.ts';
import Button from '../atomes/Button/Button.tsx';
import { cocheConsentementAnnuaire } from './reducteurProfil.ts';
import { ChampCaseACocher } from '../communs/ChampCaseACocher/ChampCaseACocher.tsx';
import { useFeatureFlag } from '../../hooks/useFeatureFlag.ts';
import { Toast } from '../communs/Toasts/Toast.tsx';

type ProprietesComposantProfilAidant = {
  macAPI: MACAPIType;
};

export const ComposantProfilAidant = ({
  macAPI,
}: ProprietesComposantProfilAidant) => {
  const { estFonctionaliteActive } = useFeatureFlag(
    'ESPACE_AIDANT_ECRAN_MES_PREFERENCES'
  );

  const navigationMAC = useNavigationMAC();
  const { etatProfil, declencheActionReducteur, enregistreProfil } =
    useFormulaireInformationsAidant();
  const [
    messageEnregistrementProfilAidant,
    setMessageEnregistrementProfilAidant,
  ] = useState<ReactElement | undefined>(undefined);

  const enregistreProfilAidant = () => {
    enregistreProfil(() => {
      setMessageEnregistrementProfilAidant(
        <Toast
          message="Vos informations ont bien été enregistrées"
          type="INFO"
        />
      );
      setTimeout(() => {
        setMessageEnregistrementProfilAidant((_prev) => undefined);
      }, 10000);
      () => {
        setMessageEnregistrementProfilAidant(
          <Toast
            message="Une erreur est survenue lors de l'enregistrement de vos informations"
            type="ERREUR"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementProfilAidant((_prev) => undefined);
        }, 10000);
      };
    });
  };

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
            {!estFonctionaliteActive ? (
              <div className="fr-mb-2w">
                Compte Créé le {etatProfil.dateCreationCompte}
              </div>
            ) : null}
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
                {estFonctionaliteActive ? (
                  <>
                    <div className="fr-mt-2w fr-mb-2w fr-checkbox-group mac-radio-group">
                      <ChampCaseACocher
                        label="Je souhaite que mon nom apparaisse sur l’annuaire des aidants"
                        element={{
                          code: 'consentement-annuaire',
                          nom: 'Je souhaite que mon nom apparaisse sur l’annuaire des aidants',
                        }}
                        checked={etatProfil.consentementAnnuaire}
                        aria-checked={etatProfil.consentementAnnuaire}
                        onChange={() =>
                          declencheActionReducteur(cocheConsentementAnnuaire())
                        }
                      />
                    </div>
                    <div className="fr-mt-2w fr-mb-2w">
                      Compte Crée le {etatProfil.dateCreationCompte}
                    </div>
                    {messageEnregistrementProfilAidant}
                    <Button
                      className="fr-mt-2w"
                      type="button"
                      role="button"
                      onClick={enregistreProfilAidant}
                    >
                      Enregistrer les modifications
                    </Button>
                  </>
                ) : null}
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
