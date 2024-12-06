import { useCallback, useEffect, useReducer } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  profilCharge,
  profilChargeEnErreur,
  reducteurProfil,
} from '../reducteurProfil';
import { constructeurParametresAPI } from '../../../../../../fournisseurs/api/ConstructeurParametresAPI';
import { MACAPIType } from '../../../../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../../../../fournisseurs/hooks';
import { Lien, ReponseHATEOAS } from '../../../../../Lien';
import { MoteurDeLiens } from '../../../../../MoteurDeLiens';
import { Profil } from '../../../../../profil/Profil';

type CorpsModificationProfil = {
  consentementAnnuaire: boolean;
};

export const useFormulaireInformationsAidant = (macAPI: MACAPIType) => {
  const navigationMAC = useNavigationMAC();
  const { showBoundary } = useErrorBoundary();

  const [etatProfil, declencheActionReducteur] = useReducer(reducteurProfil, {
    nom: '',
    prenom: '',
    email: '',
    dateCreationCompte: '',
    consentementAnnuaire: false,
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
              declencheActionReducteur(profilCharge(profil));
            })
            .catch((erreur: ReponseHATEOAS) => {
              declencheActionReducteur(profilChargeEnErreur());
              showBoundary(erreur);
            });
        }
      }
    );
  }, [etatProfil.enCoursDeChargement, showBoundary, navigationMAC]);

  const enregistreProfil = useCallback(
    (enSucces?: () => void, enErreur?: () => void) => {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'modifier-profil',
        (lien: Lien) => {
          const parametresAPI =
            constructeurParametresAPI<CorpsModificationProfil>()
              .url(lien.url)
              .methode(lien.methode!)
              .corps({
                consentementAnnuaire: etatProfil.consentementAnnuaire,
              })
              .construis();
          macAPI
            .execute<void, void, CorpsModificationProfil>(parametresAPI, () =>
              Promise.resolve()
            )
            .then(() => {
              enSucces && enSucces();
            })
            .catch((erreur) => {
              console.error(erreur);
              enErreur && enErreur();
            });
        }
      );
    },
    [navigationMAC.etat, etatProfil]
  );

  return {
    etatProfil,
    declencheActionReducteur,
    enregistreProfil,
  };
};
