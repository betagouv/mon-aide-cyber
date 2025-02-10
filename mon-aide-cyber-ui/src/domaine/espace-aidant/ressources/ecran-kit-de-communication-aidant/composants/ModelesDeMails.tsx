import { TypographieH4 } from '../../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import Cadre from '../../../../../composants/a-propos/Cadre.tsx';

export const ModelesDeMails = () => {
  return (
    <div className="fr-col-12">
      <TypographieH4>Modèles de mails</TypographieH4>
      <p>
        Personalisez les mails d‘invitation à la réalistion de diagnostics
        MonAideCyber. <br />
        Exemple de mail :
      </p>
      <Cadre className="kit-aidant-cadre-exemple-texte">
        Bonjour [Madame/Monsieur,] Je vous contacte suite à la demande d’aide
        que vous avez faite auprès du dispositif MonAideCyber. <br />
        <br />
        En tant qu’Aidant cyber de votre territoire, je serai ravi de vous
        accompagner dans votre démarche de sécurisation cyber. Je vous propose
        de réaliser ensemble un diagnostic cyber de 1er niveau. Ce diagnostic
        gratuit prend la forme d’un échange qui s’appuie sur un questionnaire
        réalisé par l’ANSSI.
        <br />À la suite de ce diagnostic, une liste de 6 mesures prioritaires
        et accessibles vous est proposée. Nous pouvons prévoir un créneau
        d’environ 1h30 pour réaliser ce diagnostic, idéalement en présentiel. En
        ce sens, pouvez-vous m’indiquer par retour de mail plusieurs créneaux de
        disponibilité ainsi que l’adresse de vos locaux ? <br />
        <br />
        Afin de réaliser votre diagnostic dans les meilleures conditions, je
        vous conseille de convier à cet échange votre responsable informatique
        et/ou votre prestataire informatique, ainsi qu’un membre de la
        direction. Cet accompagnement est encadré par une charte que j’ai signée
        et que vous pouvez consulter en ligne vi a ce lien :
        https://www.monaidecyber.ssi.gouv.fr/charte-aidant <br />
        <br />
        Merci par avance pour votre retour et bonne journée, <br />
        <br />
        [Votre signature]
      </Cadre>
      <br />
      <a href="/fichiers/MAC_kit-aidant_modeles-de-mails.pdf" target="_blank">
        Télécharger tous les modèles de mail
      </a>
    </div>
  );
};
