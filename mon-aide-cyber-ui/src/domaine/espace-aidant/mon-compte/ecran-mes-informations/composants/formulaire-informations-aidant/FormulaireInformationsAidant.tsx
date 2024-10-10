import { ReactElement, useState } from 'react';
import { cocheConsentementAnnuaire } from '../reducteurProfil';
import { useFormulaireInformationsAidant } from './useFormulaireInformationsAidant';
import Button from '../../../../../../composants/atomes/Button/Button';
import { ChampCaseACocher } from '../../../../../../composants/communs/ChampCaseACocher/ChampCaseACocher';
import { Toast } from '../../../../../../composants/communs/Toasts/Toast';
import { useFeatureFlag } from '../../../../../../hooks/useFeatureFlag';
import { MACAPIType } from '../../../../../../fournisseurs/api/useMACAPI.ts';

type ProprietesFormulaireInformationsAidant = {
  macAPI: MACAPIType;
};

export const FormulaireInformationsAidant = ({
  macAPI,
}: ProprietesFormulaireInformationsAidant) => {
  const { estFonctionaliteActive } = useFeatureFlag(
    'ESPACE_AIDANT_ECRAN_MES_PREFERENCES'
  );
  const { etatProfil, declencheActionReducteur, enregistreProfil } =
    useFormulaireInformationsAidant(macAPI);
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
        setMessageEnregistrementProfilAidant(undefined);
      }, 10000);
      () => {
        setMessageEnregistrementProfilAidant(
          <Toast
            message="Une erreur est survenue lors de l'enregistrement de vos informations"
            type="ERREUR"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementProfilAidant(undefined);
        }, 10000);
      };
    });
  };
  return (
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
        <div className="fr-mt-2w fr-mb-2w">
          Compte Crée le {etatProfil.dateCreationCompte}
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
  );
};
