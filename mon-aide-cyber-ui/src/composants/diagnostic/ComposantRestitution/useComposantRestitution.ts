import { Lien } from '../../../domaine/Lien';
import { useCallback, useEffect, useState } from 'react';
import { MoteurDeLiens, ROUTE_AIDANT } from '../../../domaine/MoteurDeLiens';
import { useNavigationMAC } from '../../../fournisseurs/hooks';
import { rubriqueConsultee } from '../../../domaine/diagnostic/reducteurRestitution';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { UUID } from '../../../types/Types';
import { useRecupereLaRestitution } from './useRecupereLaRestitution';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useNavigueVersModifierDiagnostic } from '../../../fournisseurs/ContexteNavigationMAC.tsx';

export const useComposantRestitution = (idDiagnostic: UUID) => {
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();
  const { navigue } = useNavigueVersModifierDiagnostic();

  const { etatRestitution, envoie } = useRecupereLaRestitution(idDiagnostic);

  const [boutonDesactive, setBoutonDesactive] = useState<boolean>(false);

  useEffect(() => {
    if (etatRestitution.restitution) {
      const observateurDIntersection = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const nomRubriqueConsultee = entry.target.parentElement?.id;

              nomRubriqueConsultee &&
                envoie(rubriqueConsultee(nomRubriqueConsultee));
            }
          });
        },
        {
          rootMargin: '-20% 0% -60% 0%',
        }
      );

      const titresRubriques = document.querySelectorAll('.restitution h4');

      titresRubriques.forEach((titreRubrique) =>
        observateurDIntersection.observe(titreRubrique)
      );

      return () => {
        titresRubriques.forEach((titreRubrique) =>
          observateurDIntersection.unobserve(titreRubrique)
        );
      };
    }
  }, [etatRestitution.restitution, envoie]);

  useEffect(() => {
    window.addEventListener('beforeprint', () => {
      const details = document.querySelectorAll('details');
      details.forEach((d) => d.setAttribute('open', ''));
    });
  }, []);

  useEffect(() => {
    window.addEventListener('afterprint', () => {
      const details = document.querySelectorAll('details');
      details.forEach((d) => d.removeAttribute('open'));
    });
  }, []);

  const modifierLeDiagnostic = useCallback(() => {
    navigue(etatRestitution.restitution!.liens['modifier-diagnostic']);
  }, [etatRestitution, navigationMAC]);

  const telechargerRestitution = useCallback(() => {
    new MoteurDeLiens(etatRestitution.restitution!.liens).trouve(
      'restitution-pdf',
      (lien: Lien) => {
        const parametresAPI = constructeurParametresAPI()
          .url(lien.url)
          .methode(lien.methode!)
          .accept(lien.contentType!)
          .construis();
        macAPI
          .execute<void, Blob>(parametresAPI, (blob: Promise<Blob>) => {
            return blob.then((b) => {
              const fichier = URL.createObjectURL(b);
              const lien = document.createElement('a');
              lien.href = fichier;
              lien.download = `restitution-${idDiagnostic}.pdf`;
              lien.click();
            });
          })
          .then(() => {
            setBoutonDesactive(false);
          });
      }
    );
    setBoutonDesactive(true);
  }, [etatRestitution.restitution, idDiagnostic]);

  const navigueVersTableauDeBord = useCallback(() => {
    const liens = etatRestitution.restitution!.liens;
    const moteurDeLiens = new MoteurDeLiens(liens);
    if (moteurDeLiens.existe('lancer-diagnostic')) {
      navigationMAC.navigue(`${ROUTE_AIDANT}/tableau-de-bord`, liens, [
        'modifier-diagnostic',
        'restitution-pdf',
        'restitution-json',
      ]);
    }
  }, [etatRestitution.restitution, navigationMAC.etat]);

  return {
    etatRestitution,
    navigueVersTableauDeBord,
    telechargerRestitution,
    modifierLeDiagnostic,
    boutonDesactive,
  };
};
