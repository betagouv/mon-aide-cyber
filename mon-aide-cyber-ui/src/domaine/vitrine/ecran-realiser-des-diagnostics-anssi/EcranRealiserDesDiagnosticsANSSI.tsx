import './ecran-realiser-des-diagnostics-anssi.scss';
import useDefilementFluide from '../../../hooks/useDefilementFluide.ts';
import { useNavigate } from 'react-router-dom';
import { ActionsPiedDePage } from '../../../composants/communs/ActionsPiedDePage.tsx';
import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { Temoignages } from '../ecran-devenir-aidant/composants/Temoignages.tsx';
import Button from '../../../composants/atomes/Button/Button.tsx';
import illustrationAutodiag from '../../../../public/images/illustration-autodiag.svg';
import { HeroRealiserDesDiagnosticsAnssi } from './composants/HeroRealiserDesDiagnosticsANSSI.tsx';
import { OeuvrerPourInteretGeneral } from './composants/OeuvrerPourInteretGeneral.tsx';
import { PrerequisAidantCyber } from './composants/PrerequisAidantCyber.tsx';
import { UtilisationDuService } from '../../parcours-utilisation-service/parcours-utilisateur-inscrit/ecran-utilisation-du-service/vitrine/UtilisationDuService.tsx';
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';

export const EcranRealiserDesDiagnosticsANSSI = () => {
  useTitreDePage('Réaliser des diagnostics ANSSI');

  useDefilementFluide();
  const navigate = useNavigate();

  return (
    <main role="main" className="ecran-realiser-des-diagnostics-anssi">
      <HeroRealiserDesDiagnosticsAnssi />
      <OeuvrerPourInteretGeneral />
      <section id="formulaire-formation" className="fond-clair-mac">
        <UtilisationDuService />
      </section>
      <PrerequisAidantCyber />
      <section className="fond-clair-mac section-diagnostic-libre-acces">
        <div className="fr-container focus-restitution-layout">
          <section>
            <TypographieH3>
              Accéder à l&apos;outil de diagnostic MonAideCyber
            </TypographieH3>
            <p>
              Réalisez vous-même le diagnostic de votre entité pour évaluer
              votre niveau en cybersécurité et mettre en place des premières
              mesures. Le diagnostic comprend une trentaine de questions, elles
              sont adaptées pour des entités avec un faible niveau de
              cybersécurité et souhaitant passer à l’action.
            </p>
            <p>
              Le diagnostic :
              <ul>
                <li>permet de faire ressortir les lacunes majeures</li>
                <li>
                  identifie les mesures prioritaires et les plus impactantes
                </li>
                <li>n’est pas exhaustif</li>
              </ul>
            </p>

            <Button
              type="button"
              onClick={() => navigate('/diagnostic-libre-acces')}
            >
              J&apos;accède au diagnostic
            </Button>
          </section>
          <section>
            <img src={illustrationAutodiag} alt="" />
          </section>
        </div>
      </section>
      <Temoignages
        verbatims={[
          {
            id: 1,
            auteur: 'Un utilisateur de La Réunion (974)',
            commentaire:
              'Encore merci pour cet outil qui, une fois la communauté d’aidants réunionnaise structurée et formée, nous aidera grandement dans le passage à l’échelle.',
          },
          {
            id: 2,
            auteur:
              'Un Aidant cyber, réserviste de la Police, dans le Rhône (69)',
            commentaire:
              'MonAideCyber remplit très bien sa mission, et le fait de pouvoir tout de suite donner un rapport aux interlocuteurs est un réel atout.',
          },
        ]}
      />
      <ActionsPiedDePage className="fond-clair-mac fr-pt-4w" />
    </main>
  );
};
