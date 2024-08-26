import { useErrorBoundary } from 'react-error-boundary';
import { Lien, ReponseHATEOAS } from '../../../domaine/Lien';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens';
import { useMACAPI, useNavigationMAC } from '../../../fournisseurs/hooks';
import {
  reducteurRestitution,
  restitutionChargee,
  rubriqueConsultee,
} from '../../../domaine/diagnostic/reducteurRestitution';
import { ReponseTableauDeBord } from '../../espace-aidant/tableau-de-bord/TableauDeBord';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI';
import { Restitution } from '../../../domaine/diagnostic/Restitution';
import { UUID } from '../../../types/Types';

function useComposantRestitution(idDiagnostic: UUID) {
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();
  const macapi = useMACAPI();

  const [etatRestitution, envoie] = useReducer(reducteurRestitution, {});
  const [estTableauDeBordCharge, setEstTableauDeBordCharge] = useState(false);
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
  }, [etatRestitution.restitution]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-tableau-de-bord',
      (lien: Lien) => {
        if (estTableauDeBordCharge) {
          return;
        }

        macapi
          .appelle<ReponseTableauDeBord>(
            constructeurParametresAPI()
              .url(lien.url)
              .methode(lien.methode!)
              .construis(),
            (reponse) => reponse
          )
          .then((tableauDeBord) => {
            navigationMAC.ajouteEtat(tableauDeBord.liens);
            setEstTableauDeBordCharge(true);
          })
          .catch((erreur: ReponseHATEOAS) => {
            console.log(erreur);
          });
      }
    );
  }, [
    estTableauDeBordCharge,
    etatRestitution.restitution,
    macapi,
    navigationMAC,
  ]);

  useEffect(() => {
    if (estTableauDeBordCharge && !etatRestitution.restitution) {
      new MoteurDeLiens(navigationMAC.etat).trouve(
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
        }
      );
    }
  }, [
    navigationMAC,
    envoie,
    etatRestitution,
    idDiagnostic,
    macapi,
    showBoundary,
    estTableauDeBordCharge,
  ]);

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
    return navigationMAC.navigue(
      new MoteurDeLiens(etatRestitution.restitution!.liens),
      'modifier-diagnostic'
    );
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
        macapi
          .appelle<void>(parametresAPI, (blob: Promise<Blob>) => {
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
  }, [etatRestitution.restitution, idDiagnostic, macapi]);

  const navigueVersTableauDeBord = useCallback(() => {
    const liens = etatRestitution.restitution!.liens;
    const moteurDeLiens = new MoteurDeLiens(liens);
    navigationMAC.navigue(moteurDeLiens, 'lancer-diagnostic', [
      'modifier-diagnostic',
      'restitution-pdf',
      'restitution-json',
      'afficher-diagnostic',
    ]);
  }, [etatRestitution.restitution, navigationMAC]);

  return {
    etatRestitution,
    navigueVersTableauDeBord,
    telechargerRestitution,
    modifierLeDiagnostic,
    boutonDesactive,
  };
}

export default useComposantRestitution;
