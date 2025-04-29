import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { Link } from 'react-router-dom';
import duoAidants from '../../../../../public/images/illustration-deux-personnes.svg';

export const PrerequisAidantCyber = () => {
  return (
    <div>
      <div className="fr-container engagements-aidant-layout">
        <section>
          <TypographieH3>
            Quels sont les prérequis pour être référencé Aidant cyber ?
          </TypographieH3>
          <p>Pour être référencé Aidant cyber, les prérequis sont de :</p>
          <ul>
            <li>
              Représenter ou faire partie au titre de son activité
              professionnelle ou associative d’un service de l’État, d’une
              administration, d’une réserve citoyenne ou d’une entité morale à
              but non lucratif
            </li>
            <li>
              Être dans une démarche non lucrative tout au long du dispositif
            </li>
            <li>
              Participer à un atelier Devenir Aidant cyber dispensé par l’ANSSI
            </li>
            <li>
              Accepter la <u>Charte de l’Aidant cyber</u>
            </li>
          </ul>
          <p>
            Les Aidants cyber sont référencés sur <u>l’annuaire en ligne</u>, et
            peuvent être mis en relation avec les entités qui font des demandes
            d’aide via le dispositif.
          </p>
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
