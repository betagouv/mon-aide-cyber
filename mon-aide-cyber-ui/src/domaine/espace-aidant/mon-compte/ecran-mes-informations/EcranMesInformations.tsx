import { useCallback } from 'react';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI';
import { useNavigationMAC } from '../../../../fournisseurs/hooks';
import { ROUTE_AIDANT } from '../../../MoteurDeLiens';
import { FormulaireInformationsAidant } from './composants/formulaire-informations-aidant/FormulaireInformationsAidant';
import { FormulaireModificationMotDePasse } from './composants/formulaire-modification-mot-de-passe/FormulaireModificationMotDePasse';
import { useMoteurDeLiens } from '../../../../hooks/useMoteurDeLiens.ts';

export const EcranMesInformations = () => {
  const navigationMAC = useNavigationMAC();
  const { accedeALaRessource } = useMoteurDeLiens('modifier-mot-de-passe');

  const afficherTableauDeBord = useCallback(() => {
    navigationMAC.navigue(
      `${ROUTE_AIDANT}/tableau-de-bord`,
      navigationMAC.etat
    );
  }, [navigationMAC]);

  return (
    <article className="w-100 ecran-profil">
      <section className="fond-clair-mac">
        <TypographieH2>Mes informations</TypographieH2>
      </section>
      <section>
        <div className="fr-grid-row">
          <div className="fr-col-md-6 fr-col-sm-12">
            <div>
              <button
                className="bouton-mac bouton-mac-secondaire"
                onClick={afficherTableauDeBord}
              >
                Mes diagnostics
              </button>
            </div>
            <FormulaireInformationsAidant macAPI={useMACAPI()} />
            {accedeALaRessource ? (
              <>
                <hr />
                <div>
                  <h4>Modifier son mot de passe</h4>
                </div>
              </>
            ) : null}

            <FormulaireModificationMotDePasse
              lienModificationMotDePasse={
                navigationMAC.etat['modifier-mot-de-passe']
              }
              macAPI={useMACAPI()}
              inactif={!accedeALaRessource}
            />
          </div>
        </div>
      </section>
    </article>
  );
};
