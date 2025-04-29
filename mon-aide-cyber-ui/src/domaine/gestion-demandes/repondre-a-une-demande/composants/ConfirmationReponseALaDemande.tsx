import './confirmation-reponse-a-la-demande.scss';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import illustrationEchangeSvg from '../../../../../public/images/illustration-echange.svg';
import { useNavigate } from 'react-router-dom';

export const ConfirmationReponseALaDemande = () => {
  const navigate = useNavigate();

  return (
    <div className="ecran-reponse-a-la-demande">
      <div className="formulaire-colonne-gauche">
        <div className="fr-container">
          <TypographieH1 className="titre-merci">Merci !</TypographieH1>
          <p>
            Vous êtes le premier Aidant cyber à répondre à cette demande. Vous
            allez recevoir un email avec les coordonnées de l’entité afin de
            réaliser son diagnostic.
          </p>
          <div className="cta-bas-de-section">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/connexion')}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
      <div className="fond-clair-mac icone-colonne-droite">
        <img src={illustrationEchangeSvg} alt="" />
      </div>
    </div>
  );
};
