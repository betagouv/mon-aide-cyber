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
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useQuery } from '@tanstack/react-query';

export const useRecupereLaRestitution = (idDiagnostic: UUID) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { showBoundary } = useErrorBoundary();
  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});

  const chargeRestitution = async (lien: Lien) => {
    try {
      return await macAPI.execute<Restitution, Restitution>(
        constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .construis(),
        (reponse) => reponse
      );
    } catch (error) {
      showBoundary(error);
    }
  };

  const { data: restitution } = useQuery({
    queryKey: ['afficher-diagnostic', idDiagnostic],
    queryFn: () => {
      const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
        `afficher-diagnostic-${idDiagnostic}`
      );

      if (!lien) {
        showBoundary({
          titre: 'Un problème est survenu',
          message: `Vous n'avez pas accès au diagnostic ${idDiagnostic}`,
        });
      }

      return chargeRestitution(lien);
    },
  });

  useEffect(() => {
    if (!restitution) return;

    navigationMAC.ajouteEtat(restitution.liens);
    envoie(restitutionChargee(restitution));
  }, [restitution]);

  return {
    etatRestitution,
    envoie,
  };
};
