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
import { macAPI } from '../../../fournisseurs/api/macAPI.ts';
import { ReponseTableauDeBord } from '../../../domaine/espace-aidant/ecran-diagnostics/EcranDiagnostics.tsx';

const appelleAPI = <REPONSE>(lien: Lien) =>
  macAPI.execute<REPONSE, REPONSE>(
    constructeurParametresAPI()
      .url(lien.url)
      .methode(lien.methode!)
      .construis(),
    (reponse) => reponse
  );

export const useRecupereLaRestitution = (idDiagnostic: UUID) => {
  const navigationMAC = useNavigationMAC();
  const { showBoundary } = useErrorBoundary();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});

  async function chargeRestitution(lien: Lien) {
    try {
      const restitution = await appelleAPI<Restitution>(lien);

      navigationMAC.setEtat(new MoteurDeLiens(restitution.liens).extrais());
      envoie(restitutionChargee(restitution));
    } catch (error) {
      showBoundary(error);
    }
  }

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
          const tableauDeBord = await appelleAPI<ReponseTableauDeBord>(lien);
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
