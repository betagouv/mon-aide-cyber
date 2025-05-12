import './confirmation-reponse-a-la-demande.scss';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import illustrationEchangeSvg from '../../../../../public/images/illustration-echange.svg';

export const DemandeDejaPourvue = () => {
  return (
    <div className="ecran-reponse-a-la-demande">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container">
          <TypographieH1 className="titre-merci">Oups…</TypographieH1>
          <p>
            La demande a déjà été pourvue.
            <br />
            Vous serez sans aucun doute sollicité prochainement pour d’autres
            demandes, à très vite !
          </p>
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img src={illustrationEchangeSvg} alt="" />
      </div>
    </div>
  );
};
