import { useEffect, useReducer } from 'react';
import { UUID } from '../../../types/Types';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens';
import { ReponseTableauDeBord } from '../../espace-aidant/tableau-de-bord/TableauDeBord';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { Lien, ReponseHATEOAS } from '../../../domaine/Lien';
import { Restitution } from '../../../domaine/diagnostic/Restitution';
import {
  reducteurRestitution,
  restitutionChargee,
} from '../../../domaine/diagnostic/reducteurRestitution';
import { useErrorBoundary } from 'react-error-boundary';
import { useMACAPI, useNavigationMAC } from '../../../fournisseurs/hooks';

function useRecupereLaRestitution(idDiagnostic: UUID) {
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();
  const { showBoundary } = useErrorBoundary();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});

  useEffect(() => {
    if (!navigationMAC.etat || Object.keys(navigationMAC.etat).length === 0) {
      return;
    }

    if (etatRestitution.restitution) {
      return;
    }

    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-tableau-de-bord',
      (lien: Lien) => {
        macapi
          .appelle<ReponseTableauDeBord>(
            constructeurParametresAPI()
              .url(lien.url)
              .methode(lien.methode!)
              .construis(),
            (reponse) => reponse
          )
          .then((tableauDeBord) => {
            new MoteurDeLiens(tableauDeBord.liens).trouve(
              `afficher-diagnostic-${idDiagnostic}`,
              (lien: Lien) => {
                macapi
                  .appelle<Restitution>(
                    constructeurParametresAPI()
                      .url(lien.url)
                      .methode(lien.methode!)
                      .construis(),
                    async (json) => Promise.resolve((await json) as Restitution)
                  )
                  .then((restitution) => {
                    navigationMAC.setEtat(
                      new MoteurDeLiens(restitution.liens).extrais()
                    );
                    envoie(restitutionChargee(restitution));
                  })
                  .catch((erreur) => showBoundary(erreur));
              },
              () => {
                console.error(`Pas accès au diagnostic ${idDiagnostic}`);
                showBoundary({
                  titre: 'Un problème est survenu',
                  message: `Vous n'avez pas accès au diagnostic ${idDiagnostic}`,
                });
              }
            );
          })
          .catch((erreur: ReponseHATEOAS) => {
            console.log(erreur);
          });
      }
    );
  }, [idDiagnostic, navigationMAC.etat]);

  return {
    etatRestitution,
    envoie,
  };
}

export default useRecupereLaRestitution;
