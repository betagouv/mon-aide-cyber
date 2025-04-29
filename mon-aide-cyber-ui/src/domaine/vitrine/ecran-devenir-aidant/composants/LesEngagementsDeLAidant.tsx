import { Link } from 'react-router-dom';
import duoAidants from '../../../../../public/images/illustration-dialogue-mac.svg';
import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3';

export const LesEngagementsDeLAidant = () => {
  return (
    <div>
      <div className="fr-container engagements-aidant-layout">
        <section>
          <TypographieH3>Les engagements de l&apos;Aidant cyber</TypographieH3>
          <ul>
            <li>
              Aucune démarche commerciale, le diagnostic est réalisé
              gratuitement
            </li>
            <li>
              Devoir de confidentialité et de neutralité auprès des entités
              diagnostiquées
            </li>
            <li>Respect de la méthodologie MonAideCyber</li>
          </ul>
          <div>
            <Link to="#formulaire-formation">
              <button type="button" className="bouton-mac bouton-mac-primaire">
                Je rejoins la communauté
              </button>
            </Link>
          </div>
        </section>
        <section>
          <img
            src={duoAidants}
            alt="Scène d'un aidant cyber et d'un aidé faisant un diagnostic"
          />
        </section>
      </div>
    </div>
  );
};
