import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import './ecran-ressources.scss';
import EncartContenu from './composants/EncartContenu.tsx';

const EcranRessources = () => {
  return (
    <article className="w-100 ecran-ressources">
      <section className="entete">
        <TypographieH2>Ressources</TypographieH2>
        <p>
          Des ressources pédagogiques pour vous aider à accompagner efficacement
          les organisations.
        </p>
      </section>
      <section className="contenu">
        <EncartContenu
          titre="Comment naviguer dans MonAideCyber ?"
          paragraphe="Cette vidéo vous explique en 2 min comment naviguer dans
                MonAideCyber et retrouver tous les outils mis à disposition pour
                aider les Aidants cyber dans leur rôle."
          video={{
            imageCouverture: '/images/video-naviguer-sur-mac-apercu.png',
            source:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/Video_navigation_MAC.mp4',
            sousTitres:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/Video_navigation_MAC.vtt',
          }}
        />
        <EncartContenu
          titre="Comment organiser un diag dating ?"
          paragraphe="
                Cet atelier a été organisé afin de présenter les principes du
                Diag Dating. Cet événement a fait ses preuves pour déployer le
                diagnostic cyber de l‘État. Créé à l‘initiative d‘un Aidant
                cyber de Dordogne, il témoigne également lors de cet atelier.
              "
          video={{
            imageCouverture: '/images/video-atelier-diag-dating-apercu.png',
            source:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/replay_atelier_Diag_Dating.mp4',
            sousTitres:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/replay_atelier_Diag_Dating.vtt',
          }}
        />
        <EncartContenu
          titre="Comment trouver des entités bénéficiaires ?"
          paragraphe="Cette vidéo vous aide à appréhender la prise de contact pour proposer d‘accompagner votre réseau dans la réalisation d‘un diagnostic cyber."
          video={{
            imageCouverture: '/images/video-comment-trouver-des-aides.png',
            source:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/MSC-comment-trouver-des-aides.mp4',
            sousTitres:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/MSC-comment-trouver-des-aides.vtt',
          }}
        />
        <EncartContenu
          titre="Le diagnostic"
          paragraphe="Cette présentation déroule le diagnostic question par question et répond aux interrogations récurrentes des aidés pour vous donner les bons éléments de langages."
          video={{
            source:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/Presentation_diagnostic.mp4',
            sousTitres:
              'https://ressources-mac.cellar-c2.services.clever-cloud.com/Presentation_diagnostic.vtt',
          }}
        />
      </section>
    </article>
  );
};

export default EcranRessources;
