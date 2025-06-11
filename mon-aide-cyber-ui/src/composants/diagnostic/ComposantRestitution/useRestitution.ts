import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import {
  constructeurParametresAPI,
  ParametresAPI,
} from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMutation } from '@tanstack/react-query';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MACAPIType, useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { UUID } from '../../../types/Types.ts';
import { Action } from '../../../domaine/Lien.ts';
import crypto from 'node:crypto';

type ConfigurationRequeteRestitution<T> = {
  identifiantDiagnostic: crypto.UUID;
  nom: string;
  action: Action;
  execute: (macAPI: MACAPIType, parametresAPI: ParametresAPI) => Promise<T>;
  surSuccesExecution?: (reponse: T) => void;
};

export const useRestitution = <T>(
  configurationRequete: ConfigurationRequeteRestitution<T>
) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  const { mutate: demanderRestitution, isPending: enAttenteRestitution } =
    useMutation({
      mutationKey: [
        configurationRequete.nom,
        configurationRequete.identifiantDiagnostic,
      ],
      mutationFn: () => {
        const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
          configurationRequete.action
        );
        if (!lien) {
          return Promise.reject(`Cette action n'est pas autorisée.`);
        }

        const parametresAPI = constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .accept(lien.contentType!)
          .construis();
        return configurationRequete.execute(macAPI, parametresAPI);
      },
      onSuccess: (blob) => {
        configurationRequete.surSuccesExecution?.(blob);
      },
    });

  return { demanderRestitution: demanderRestitution, enAttenteRestitution };
};

export const requeteTelechargementRestitution = (
  idDiagnostic: crypto.UUID
): ConfigurationRequeteRestitution<Blob> => ({
  identifiantDiagnostic: idDiagnostic,
  nom: 'telecharger-restitution',
  action: 'restitution-pdf',
  execute(macAPI: MACAPIType, parametresAPI: ParametresAPI): Promise<Blob> {
    return macAPI.execute<Blob, Blob>(parametresAPI, (blob) => blob);
  },
  surSuccesExecution: (blob: Blob): void => {
    const fichier = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = fichier;
    lien.download = `restitution-${idDiagnostic}.pdf`;
    lien.click();
  },
});

export const requeteEnvoyerRestitutionEntiteAidee = (
  idDiagnostic: UUID
): ConfigurationRequeteRestitution<void> => ({
  identifiantDiagnostic: idDiagnostic,
  action: 'envoyer-restitution-entite-aidee',
  execute: (macAPI: MACAPIType, parametresAPI: ParametresAPI): Promise<void> =>
    macAPI.execute<void, void>(parametresAPI, async () => {
      return;
    }),
  nom: 'envoyer-restitution',
});
