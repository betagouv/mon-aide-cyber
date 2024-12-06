import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMutation } from '@tanstack/react-query';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { UUID } from '../../../types/Types.ts';

export const useTelechargerRestitution = (idDiagnostic: UUID) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  const { mutate: telechargerRestitution, isPending: chargeLeFichier } =
    useMutation({
      mutationKey: ['telecharger-restitution', idDiagnostic],
      mutationFn: () => {
        const lien = new MoteurDeLiens(navigationMAC.etat).trouveEtRenvoie(
          'restitution-pdf'
        );
        if (!lien) {
          return Promise.reject(`Cette action n'est pas autorisée.`);
        }

        const parametresAPI = constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .accept(lien.contentType!)
          .construis();
        return macAPI.execute<Blob, Blob>(parametresAPI, (blob) => blob);
      },
      onSuccess: (blob) => {
        const fichier = URL.createObjectURL(blob);
        const lien = document.createElement('a');
        lien.href = fichier;
        lien.download = `restitution-${idDiagnostic}.pdf`;
        lien.click();
      },
    });

  return { telechargerRestitution, chargeLeFichier };
};
