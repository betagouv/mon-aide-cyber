import { TypographieH4 } from '../typographie/TypographieH4/TypographieH4';
import echelleSvg from '../../../../public/images/illustration-statistiques.svg';

function TuileActionStatistiques() {
  return (
    <div className="tuile tuile-grande">
      <div className="illustration">
        <img src={echelleSvg} alt="Illustration des statistiques" />
      </div>
      <div className="corps">
        <TypographieH4>Découvrir nos statistiques</TypographieH4>
        <p>
          MonAideCyber est une start up d’État, certaines statistiques du
          projets sont <b>ouvertes à tous</b> ! Le projet est accompagné par le
          Laboratoire d’innovation de l’ANSSI et la DINUM.
        </p>
        <a href="/statistiques-utilisation">
          <button
            type="button"
            className="fr-btn bouton-mac bouton-mac-primaire"
          >
            En savoir plus
          </button>
        </a>
      </div>
    </div>
  );
}

export default TuileActionStatistiques;
