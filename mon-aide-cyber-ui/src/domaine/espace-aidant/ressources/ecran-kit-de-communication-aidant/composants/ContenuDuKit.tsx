import IconeInformation from '../../../../../composants/communs/IconeInformation.tsx';
import { LienMailtoMAC } from '../../../../../composants/atomes/LienMailtoMAC.tsx';

export const ContenuDuKit = () => {
  return (
    <div className="fr-col-md-8 fr-col-sm-12">
      <p>
        Vous trouverez dans ce kit :
        <ul>
          <li>
            Des modèles de publication de posts Linkedin pour partager votre
            expérience d‘Aidant cyber
          </li>
          <li>
            Des modèles de mails pour vous aider à solliciter des entités
            bénéficiaires à se faire accompagner via MonAideCyber
          </li>
          <li>
            Des modèles de signatures électroniques interactives pour inciter
            vos interlocuteurs à bénéficier d‘un diagnostic
          </li>
          <li>
            Des tutoriels pour vous guider pas à pas dans l‘utilisation de ces
            ressources.
          </li>
        </ul>
      </p>
      <a
        href="/fichiers/MonAideCyber_kit_des_Aidants_cyber.zip"
        target="_blank"
      >
        Télécharger le kit des Aidants cyber
      </a>

      <div className="fr-mt-2w information-message">
        <IconeInformation />
        <p>
          <span className="white-space-no-wrap white-space-xl-normal">
            Quelques bonnes pratiques et consignes d‘utilisation :
          </span>
          <br />
          <ul className="fr-pl-4w">
            <li>
              Vous pouvez personnaliser vos textes mais veillez à utiliser les
              éléments graphiques et typographiques conformément à ce qui est
              fourni dans le kit
            </li>
            <li>
              Ce kit est uniquement réservé aux activités de communication
              MonAideCyber
            </li>
            <li>
              <b>L’utilisation du logo de l’ANSSI n’est pas autorisée</b>
            </li>
            <li>
              N‘hésitez pas à nous contacter pour toute question sur{' '}
              <LienMailtoMAC />
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
};
