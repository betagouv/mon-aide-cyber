import { useEffect, useReducer } from 'react';
import { UUID } from '../../../types/Types';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { Lien } from '../../../domaine/Lien';
import { Restitution } from '../../../domaine/diagnostic/Restitution';
import {
  reducteurRestitution,
  restitutionChargee,
} from '../../../domaine/diagnostic/reducteurRestitution';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigationMAC } from '../../../fournisseurs/hooks';
import { ReponseTableauDeBord } from '../../../domaine/espace-aidant/ecran-diagnostics/EcranDiagnostics.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';

export const useRecupereLaRestitution = (idDiagnostic: UUID) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { showBoundary } = useErrorBoundary();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});

  const chargeRestitution = async (lien: Lien) => {
    try {
      const restitution = await macAPI.execute<Restitution, Restitution>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        (reponse) => reponse
      );

      navigationMAC.setEtat(new MoteurDeLiens(restitution.liens).extrais());
      envoie(restitutionChargee(restitution));
    } catch (error) {
      showBoundary(error);
    }
  };

  useEffect(() => {
    if (!navigationMAC.etat || Object.keys(navigationMAC.etat).length === 0) {
      return;
    }

    if (etatRestitution.restitution) {
      return;
    }

    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-tableau-de-bord',
      async (lien: Lien) => {
        try {
          const tableauDeBord = await macAPI.execute<
            ReponseTableauDeBord,
            ReponseTableauDeBord
          >(
            constructeurParametresAPI()
              .url(lien.url)
              .methode(lien.methode!)
              .construis(),
            (reponse) => reponse
          );
          new MoteurDeLiens(tableauDeBord.liens).trouve(
            `afficher-diagnostic-${idDiagnostic}`,
            async (lien: Lien) => await chargeRestitution(lien),
            () => {
              showBoundary({
                titre: 'Un problème est survenu',
                message: `Vous n'avez pas accès au diagnostic ${idDiagnostic}`,
              });
            }
          );
        } catch (erreur) {
          showBoundary(erreur);
        }
      }
    );
  }, [idDiagnostic, navigationMAC.etat]);

  return {
    etatRestitution,
    envoie,
  };
};
