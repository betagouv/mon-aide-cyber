import {
  ComposantModificationMotDePasse,
  ModificationMotDePasse,
} from '../mot-de-passe/ComposantModificationMotDePasse.tsx';
import { FormEvent, ReactElement, useCallback, useMemo, useState } from 'react';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ChampSucces } from '../alertes/Succes.tsx';
import { ChampsErreur } from '../alertes/Erreurs.tsx';
import { Lien } from '../../domaine/Lien.ts';
import { MACAPIType } from '../../fournisseurs/api/useMACAPI.ts';

type CorpsModificationMotDePasse = {
  ancienMotDePasse: string;
  motDePasse: string;
  confirmationMotDePasse: string;
};

type ProprietesComposantFormulaireModificationMotDePasse = {
  lienModificationMotDePasse: Lien;
  macAPI: MACAPIType;
};
export const ComposantFormulaireModificationMotDePasse = ({
  lienModificationMotDePasse,
  macAPI,
}: ProprietesComposantFormulaireModificationMotDePasse) => {
  const [
    modificationMotDePasseTransmise,
    setModificationMotDePasseATransmettre,
  ] = useState<boolean>(false);
  const [formulaireMotDePasseAVider, setFormulaireMotDePasseAVider] =
    useState<boolean>(false);
  const [retourModificationMotDePasse, setRetourModificationMotDePasse] =
    useState<ReactElement | undefined>(undefined);
  const modifierMotDePasse = useMemo(
    () => lienModificationMotDePasse,
    [lienModificationMotDePasse]
  );

  const modifieMotDePasse = useCallback(
    (modificationMotDePasse: ModificationMotDePasse) => {
      if (modificationMotDePasse.valide) {
        macAPI
          .execute<void, void, CorpsModificationMotDePasse>(
            constructeurParametresAPI<CorpsModificationMotDePasse>()
              .url(modifierMotDePasse.url)
              .methode(modifierMotDePasse.methode!)
              .corps({
                ancienMotDePasse: modificationMotDePasse.ancienMotDePasse,
                motDePasse: modificationMotDePasse.nouveauMotDePasse,
                confirmationMotDePasse:
                  modificationMotDePasse.confirmationNouveauMotDePasse,
              })
              .construis(),
            () => Promise.resolve()
          )
          .then(() => {
            setModificationMotDePasseATransmettre(false);
            setRetourModificationMotDePasse(
              <ChampSucces message="Mot de passe modifié avec succès" />
            );
            setFormulaireMotDePasseAVider(true);
          })
          .catch((erreur) => {
            setRetourModificationMotDePasse(<ChampsErreur erreur={erreur} />);
            setModificationMotDePasseATransmettre(false);
            setFormulaireMotDePasseAVider(true);
          });
      }
    },
    [modifierMotDePasse]
  );

  const modifieLeMotDePasse = useCallback((e: FormEvent) => {
    e.preventDefault();
    setModificationMotDePasseATransmettre(true);
  }, []);

  return (
    <form onSubmit={modifieLeMotDePasse}>
      <fieldset className="fr-fieldset">
        <div className="fr-fieldset__content">
          <ComposantModificationMotDePasse
            titreSaisieAncienMotDePasse="Saisissez votre ancien mot de passe"
            messagesErreurs={{
              motsDePasseConfirmeDifferent:
                'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
              motsDePasseVides: 'Vous devez saisir vos mots de passe.',
              ancienMotDePasseIdentiqueAuNouveauMotDePasse:
                'Votre nouveau mot de passe doit être différent de votre ancien mot de passe.',
            }}
            {...(modificationMotDePasseTransmise && {
              surValidation: (modificationMotDePasse) => {
                modifieMotDePasse(modificationMotDePasse);
                setModificationMotDePasseATransmettre(false);
              },
            })}
            {...(formulaireMotDePasseAVider && {
              reinitialise: () => setFormulaireMotDePasseAVider(false),
            })}
          />
          <div className="fr-grid-row fr-grid-row--right fr-mt-3w">
            <button
              type="submit"
              key="modification-mot-de-passe"
              className="fr-btn bouton-mac bouton-mac-primaire"
            >
              Modifier le mot de passe
            </button>
          </div>
        </div>
        <div className="fr-mt-2w">{retourModificationMotDePasse}</div>
      </fieldset>
    </form>
  );
};
