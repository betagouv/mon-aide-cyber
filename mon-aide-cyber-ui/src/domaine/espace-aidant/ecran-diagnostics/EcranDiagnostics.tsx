import { useEffect, useState } from 'react';
import { Lien, ReponseHATEOAS } from '../../Lien.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { UUID } from '../../../types/Types.ts';
import { ComposantDiagnostics } from '../../../composants/espace-aidant/tableau-de-bord/ComposantDiagnostics.tsx';
import {
  ComposantLancerDiagnostic,
  ComposantLienCreerDiagnostic,
} from '../../../composants/diagnostic/ComposantLancerDiagnostic.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { useErrorBoundary } from 'react-error-boundary';
import { TypographieH5 } from '../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import { Link } from 'react-router-dom';

export type Diagnostic = {
  dateCreation: string;
  identifiant: UUID;
  secteurActivite: string;
  secteurGeographique: string;
};
export type ReponseTableauDeBord = ReponseHATEOAS & {
  diagnostics: Diagnostic[];
};
export const EcranDiagnostics = () => {
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(true);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const navigationMAC = useNavigationMAC();
  const { showBoundary } = useErrorBoundary();
  const macAPI = useMACAPI();

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-tableau-de-bord',
      (lien: Lien) => {
        if (enCoursDeChargement) {
          macAPI
            .execute<ReponseTableauDeBord, ReponseTableauDeBord>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (reponse) => reponse
            )
            .then((tableauDeBord) => {
              navigationMAC.ajouteEtat(tableauDeBord.liens);
              setEnCoursDeChargement(false);
              setDiagnostics(tableauDeBord.diagnostics);
            })
            .catch((erreur: ReponseHATEOAS) => {
              showBoundary(erreur);
            });
        }
      }
    );
  }, [enCoursDeChargement, navigationMAC]);

  return (
    <article className="w-100 ecran-diagnostics">
      <section className="mes-diagnostics-cta">
        <TypographieH2>Mes Diagnostics</TypographieH2>

        <div className="cartes">
          <div className="w-100">
            <div className="tuile-tdb sans-fond">
              <p>
                Retrouvez ici l’ensemble des diagnostics que vous avez menés.
                <br />
                <br />
                Pour créer un nouveau diagnostic, cliquez sur le bouton
                ci-dessous.
              </p>
              <ComposantLancerDiagnostic
                composant={ComposantLienCreerDiagnostic}
              />
            </div>
          </div>
          <div className="w-100">
            <div className="tuile-tdb">
              <TypographieH5>Réaliser un diagnostic test</TypographieH5>
              <p>
                Vous souhaitez vous entraîner ?
                <br />
                Créez un diagnostic de test, qui ne sera pas comptabilisé dans
                vos diagnostics.
              </p>
              <Link to="/diagnostic-libre-acces" target="_blank">
                Créer un diagnostic de test
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <ComposantDiagnostics diagnostics={diagnostics} />
      </section>
    </article>
  );
};
