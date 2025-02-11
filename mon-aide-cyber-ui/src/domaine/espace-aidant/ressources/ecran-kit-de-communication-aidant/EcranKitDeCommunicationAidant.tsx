import './ecran-kit-de-communication-aidants.scss';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import illustrationKitDeCom from '../../../../../public/images/illustration-tornade.svg';
import { ContenuDuKit } from './composants/ContenuDuKit.tsx';
import { PublicationSurLesReseaux } from './composants/PublicationSurLesReseaux.tsx';
import { ModelesDeMails } from './composants/ModelesDeMails.tsx';
import { SignaturesDeMails } from './composants/SignaturesDeMails.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';

export const EcranKitDeCommunicationAidant = () => {
  return (
    <article className="w-100 ecran-kit-de-communication-aidant">
      <section className="entete">
        <div>
          <TypographieH2 className="fr-mb-2w">
            Kit des Aidants cyber
          </TypographieH2>
          <p>
            Ce kit de communication a été exclusivement conçu pour vous aider à
            communiquer sur votre engagement et vous faire connaître en tant
            qu‘Aidant cyber auprès de votre écosystème. Il vous offre des
            ressources toutes prêtes pour gagner en visibilité.
          </p>
          <Button
            type="button"
            variant="primary"
            icon="fr-icon-download-line"
            iconPos="right"
            onClick={() => {
              window.open(
                '/fichiers/MonAideCyber_kit_des_Aidants_cyber.zip',
                '_blank'
              );
            }}
          >
            Télécharger le kit des Aidants cyber
          </Button>
        </div>
        <div>
          <img
            className="entete-icone"
            src={illustrationKitDeCom}
            alt="Illustration MonAideCyber tornade"
          />
        </div>
      </section>
      <section className="contenu">
        <div className=" fr-grid-row">
          <ContenuDuKit />
          <PublicationSurLesReseaux />
          <ModelesDeMails />
          <SignaturesDeMails />
        </div>
      </section>
    </article>
  );
};
