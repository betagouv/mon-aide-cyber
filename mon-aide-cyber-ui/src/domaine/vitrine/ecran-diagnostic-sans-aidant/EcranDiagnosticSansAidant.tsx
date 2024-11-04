import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { useNavigate } from 'react-router-dom';
import Button from '../../../composants/atomes/Button/Button.tsx';
import illustrationAutodiagSvg from '../../../../public/images/illustration-autodiag.svg';
import './ecran-diagnostic-sans-aidant.scss';
import illustrationDialogue from '../../../../public/images/illustration-echange.svg';
import { TypographieH4 } from '../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { FormulaireDeContact } from '../../../composants/communs/FormulaireDeContact/FormulaireDeContact.tsx';
import TuileActionKitDeCommunication from '../../../composants/communs/tuiles/TuileActionKitDeCommunication.tsx';
import TuileActionDemandeAide from '../../../composants/communs/tuiles/TuileActionDemandeAide.tsx';

export const EcranDiagnosticSansAidant = () => {
  const navigate = useNavigate();

  return (
    <main role="main" className="ecran-diagnostic-sans-aidant">
      <div>
        <section className="fr-container explication-page-layout">
          <section>
            <TypographieH3>Faire un diagnostic sans Aidant</TypographieH3>
            <p>
              Réalisez vous-même le diagnostic de votre entité pour évaluer
              votre niveau en cybersécurité et mettre en place des premières
              mesures. Le diagnostic comprend une trentaine de questions, elles
              sont adaptées pour des entités avec un faible niveau de
              cybersécurité et souhaitant passer à l’action.
              <br />
              <br />
              Le diagnostic :
              <ul>
                <li>permet de faire ressortir les lacunes majeures</li>
                <li>
                  identifie les mesures prioritaires et les plus impactantes
                </li>
                <li>n’est pas exhaustif</li>
              </ul>
            </p>

            <div>
              <Button
                type="button"
                onClick={() =>
                  navigate('/beneficier-du-dispositif/auto-diagnostic/demande')
                }
              >
                Je commence le diagnostic
              </Button>
            </div>
          </section>
          <section>
            <img
              src={illustrationAutodiagSvg}
              alt="Représentation graphique de la restitution sous forme de radar par catégorie cyber"
            />
          </section>
        </section>
        <section className="fr-container preferer-etre-accompagne-layout">
          <div className="flex justify-center">
            <img
              src={illustrationDialogue}
              alt="Un aidé pensant à toutes les problématiques cyber de son entité"
            />
          </div>
          <div>
            <TypographieH4>
              <b>Qui est concerné ?</b>
            </TypographieH4>
            <p>
              Le dispositif s’adresse aux entités privées comme publiques, de
              toute taille. Elles sont déjà sensibilisées au risque cyber et
              souhaitent s’engager dans une première démarche de renforcement de
              leur sécurité numérique. Le dispositif est à l’inverse inadapté
              pour les entités jugées “matures” et les particuliers.
            </p>

            <div className="boutons-parcours-classique">
              <Button
                type="button"
                onClick={() =>
                  navigate(
                    '/beneficier-du-dispositif/etre-aide#formulaire-demande-aide'
                  )
                }
              >
                Je fais une demande
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/beneficier-du-dispositif/annuaire')}
              >
                Je consulte l’annuaire des aidants
              </Button>
            </div>
          </div>
        </section>
      </div>
      <section className="participer fr-pt-4w">
        <div className="fr-container conteneur-participer">
          <div className="fr-col-12">
            <TypographieH2>Pour aller plus loin</TypographieH2>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionDemandeAide />
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <TuileActionKitDeCommunication />
            </div>
          </div>
        </div>
      </section>
      <FormulaireDeContact />
    </main>
  );
};
