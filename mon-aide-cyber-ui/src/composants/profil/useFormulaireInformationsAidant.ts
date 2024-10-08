import { useCallback, useEffect, useReducer } from 'react';
import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI';
import { useMACAPI } from '../../fournisseurs/api/useMACAPI';
import { useErrorBoundary } from 'react-error-boundary';
import {
  profilCharge,
  profilChargeEnErreur,
  reducteurProfil,
} from './reducteurProfil';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens';
import { useNavigationMAC } from '../../fournisseurs/hooks';
import { Lien, ReponseHATEOAS } from '../../domaine/Lien';
import { Profil } from '../../domaine/profil/Profil';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

type CorpsModificationProfil = {
  consentementAnnuaire: boolean;
};

export const useFormulaireInformationsAidant = () => {
  const { estFonctionaliteActive } = useFeatureFlag(
    'ESPACE_AIDANT_ECRAN_MES_PREFERENCES'
  );

  const navigationMAC = useNavigationMAC();
  const { showBoundary } = useErrorBoundary();
  const macAPI = useMACAPI();

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
      if (!estFonctionaliteActive) return;

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
