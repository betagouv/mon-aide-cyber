import { TypographieH3 } from '../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import illustrationInteretGeneral from '../../../../public/images/illustration-interet-general.svg';
import illustrationCadreProfessionnel from '../../../../public/images/illustration-cadre-professionnel.svg';

export const ChoixUtilisation = () => {
  return (
    <>
      <div className="choix-utilisation text-center">
        <TypographieH3 className="violet-fonce">
          Le dispositif MonAideCyber évolue !
        </TypographieH3>
        <span>Quelle utilisation du service envisagez-vous ?</span>
      </div>
      <label className="formulaire-colonne-gauche">
        <div>
          <input name="choix-utilisation-service" type="radio" />
        </div>
        <img
          src={illustrationInteretGeneral}
          alt="Illustration d’une personne oeuvrant pour l’intérêt général."
        />
        <div>
          <b>Œuvrer exclusivement pour l’intérêt général </b>
        </div>
        <div className="checklist">
          <div className="item">
            <div className="vert">
              <i className="fr-icon-check-line"></i>
            </div>
            <div>Je m’engage avec MonAideCyber de manière non-lucrative</div>
          </div>
          <div className="item">
            <div className="vert">
              <i className="fr-icon-check-line"></i>
            </div>
            <div>
              Je peux réaliser des diagnostics cybersécurité de premier niveau
              en appliquant une méthodologie de l’ANSSI
            </div>
          </div>
          <div className="item">
            <div className="vert">
              <i className="fr-icon-check-line"></i>
            </div>
            <div>
              Je peux être référencé “Aidant cyber” et mis en relation avec des
              entités qui sollicitent une aide via le dispositif
            </div>
          </div>
          <div className="item">
            <div className="rouge">
              <i className="fr-icon-close-line"></i>
            </div>
            <div>
              Je ne peux pas proposer de prestations commerciales pendant et à
              l’issue d’un diagnostic
            </div>
          </div>
        </div>
      </label>
      <label className="formulaire-colonne-droite">
        <input name="choix-utilisation-service" type="radio" />
        <img
          src={illustrationCadreProfessionnel}
          alt="Illustration d’une personne travaillant dans le cadre professionnel."
        />
        <div>
          <b>
            Utiliser le dispositif dans le cadre de mon activité professionnelle
          </b>
        </div>
        <div className="checklist">
          <div className="item">
            <div className="vert">
              <i className="fr-icon-check-line"></i>
            </div>
            <div>Je m’engage avec MonAideCyber de manière non-lucrative</div>
          </div>
          <div className="item">
            <div className="vert">
              <i className="fr-icon-check-line"></i>
            </div>
            <div>
              Je peux réaliser des diagnostics cybersécurité de premier niveau
              en appliquant une méthodologie de l’ANSSI
            </div>
          </div>
          <div className="item">
            <div className="rouge">
              <i className="fr-icon-close-line"></i>
            </div>
            <div>Je ne suis pas référencé en tant qu’”Aidant cyber”</div>
          </div>
          <div className="item">
            <div className="vert">
              <i className="fr-icon-check-line"></i>
            </div>
            <div>
              Je peux proposer des prestations commerciales pendant et à l’issue
              d’un diagnostic
            </div>
          </div>
        </div>
      </label>
      <div className="validation">
        <button type="button" className="fr-btn bouton-mac bouton-mac-primaire">
          Je valide ma sélection
        </button>
      </div>
    </>
  );
};
