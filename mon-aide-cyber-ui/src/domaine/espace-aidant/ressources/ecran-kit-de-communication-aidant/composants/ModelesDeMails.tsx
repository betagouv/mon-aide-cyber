import { TypographieH4 } from '../../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import Cadre from '../../../../../composants/a-propos/Cadre.tsx';

export const ModelesDeMails = () => {
  return (
    <div className="fr-col-12">
      <TypographieH4>Modèles de mails</TypographieH4>
      <p>
        Personalisez les mails d‘invitation à la réalisation de diagnostics
        MonAideCyber. <br />
        Exemple de mail :
      </p>
      <Cadre className="kit-aidant-cadre-exemple-texte">
        <p>
          Bonjour [Madame/Monsieur,] <br /> <br />
          Je vous contacte suite à la demande d’aide que vous avez faite auprès
          du dispositif <b>MonAideCyber</b>.
          <br />
          <br />
          En tant qu’Aidant cyber de votre territoire, je serai ravi de vous
          accompagner dans votre démarche de sécurisation cyber. Je vous propose
          de <b>réaliser ensemble un diagnostic cyber de premier niveau</b>. Ce
          diagnostic <b>gratuit</b> prend la forme d’un échange qui s’appuie sur
          un questionnaire réalisé par l’ANSSI.
          <br />À la suite de ce diagnostic,{' '}
          <b>une liste de 6 mesures prioritaires et accessibles</b> vous est
          proposée. Nous pouvons prévoir un créneau d’environ <b>1h30</b> pour
          réaliser ce diagnostic, idéalement en présentiel. En ce sens,
          pouvez-vous m’indiquer par retour de mail plusieurs créneaux de
          disponibilité ainsi que l’adresse de vos locaux ? <br />
          <br />
          <b>
            Afin de réaliser votre diagnostic dans les meilleures conditions, je
            vous conseille de convier à cet échange votre responsable
            informatique et/ou votre prestataire informatique, ainsi qu’un
            membre de la direction.
          </b>{' '}
          <br />
          <br />
          Cet accompagnement est encadré par une charte que j’ai signée et que
          vous pouvez consulter en ligne via ce lien :{' '}
          <a
            rel="noreferrer"
            href="https://monaide.cyber.gouv.fr/charte-aidant"
            target="_blank"
          >
            https://monaide.cyber.gouv.fr/charte-aidant
          </a>{' '}
          <br />
          <br />
          Merci par avance pour votre retour et bonne journée, <br />
          <br />
          [Votre signature]
        </p>
      </Cadre>
      <br />
      <a
        href="/fichiers/MonAideCyber_kit-aidant_modeles-de-mails.pdf"
        target="_blank"
      >
        Télécharger tous les modèles de mail
      </a>
    </div>
  );
};
