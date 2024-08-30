import { useEffect, useReducer } from 'react';
import { UUID } from '../../../types/Types';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens';
import { ReponseTableauDeBord } from '../../espace-aidant/tableau-de-bord/TableauDeBord';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { Lien } from '../../../domaine/Lien';
import { Restitution } from '../../../domaine/diagnostic/Restitution';
import {
  reducteurRestitution,
  restitutionChargee,
} from '../../../domaine/diagnostic/reducteurRestitution';
import { useErrorBoundary } from 'react-error-boundary';
import { useMACAPI, useNavigationMAC } from '../../../fournisseurs/hooks';
import { ContexteMacAPIType } from '../../../fournisseurs/api/ContexteMacAPI';

const appelleAPI = <REPONSE>(macapi: ContexteMacAPIType, lien: Lien) =>
  macapi.appelle<REPONSE>(
    constructeurParametresAPI()
      .url(lien.url)
      .methode(lien.methode!)
      .construis(),
    (reponse) => reponse
  );

export const useRecupereLaRestitution = (idDiagnostic: UUID) => {
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();
  const { showBoundary } = useErrorBoundary();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});

  async function chargeRestitution(lien: Lien) {
    try {
      const restitution = await appelleAPI<Restitution>(macapi, lien);

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
          const tableauDeBord = await appelleAPI<ReponseTableauDeBord>(
            macapi,
            lien
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
