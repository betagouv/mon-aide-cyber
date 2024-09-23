import { useEffect, useState } from 'react';
import { Lien, ReponseHATEOAS } from '../../../domaine/Lien.ts';
import { useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { UUID } from '../../../types/Types.ts';
import { macAPI } from '../../../fournisseurs/api/macAPI.ts';
import { ComposantDiagnostics } from '../../../composants/espace-aidant/tableau-de-bord/ComposantDiagnostics.tsx';
import {
  ComposantLancerDiagnostic,
  ComposantLienCreerDiagnostic,
} from '../../../composants/diagnostic/ComposantLancerDiagnostic.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';

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
              console.log(erreur);
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
            <p>
              Retrouvez ici l’ensemble des diagnostics que vous avez menés.
              <br />
              <br />
              Vous souhaitez créer un diagnostic ? Il est impératif que le
              contact de l’entité souhaitant bénéficier du diagnostic valide les
              CGU avant de le réaliser. Cliquez sur le bouton ci-dessous pour
              effectuer une demande de création de diagnostic et de validation
              des CGU :
            </p>
            <br />
            <ComposantLancerDiagnostic
              composant={ComposantLienCreerDiagnostic}
            />
          </div>
          <div className="w-100">
            {/*
            <div className=" tuile-tdb">
              <TypographieH5>
                Créer un diagnostic de test <i>(à venir)</i>
              </TypographieH5>
              <p>
                Vous souhaitez vous entraîner ? Créez un diagnostic de test, qui
                ne sera pas comptabilisé.
              </p>
              <button
                type="button"
                disabled={true}
                className="bouton-mac bouton-mac-primaire"
              >
                Créer un diagnostic de test
              </button>
            </div>
            */}
          </div>
        </div>
      </section>
      <section>
        <ComposantDiagnostics diagnostics={diagnostics} />
      </section>
    </article>
  );
};
