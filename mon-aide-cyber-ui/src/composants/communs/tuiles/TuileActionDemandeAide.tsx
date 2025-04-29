import { TypographieH4 } from '../typographie/TypographieH4/TypographieH4';
import { BoutonDemandeAide } from '../../atomes/Lien/BoutonDemandeAide.tsx';

function TuileActionDemandeAide() {
  return (
    <div className="tuile tuile-grande">
      <div className="illustration">
        <img
          src="/images/illustration-homepage-aides.svg"
          alt="Trois personnes souhaitant devenir Aidant Cyber"
        />
      </div>
      <div className="corps">
        <TypographieH4>Bénéficier de MonAideCyber</TypographieH4>
        <p>
          Vous êtes décideur ou employé d’une <b>collectivité territoriale</b>,
          d’une <b>association</b>, ou d’une <b>entreprise</b> (TPE, PME,
          ETI...) et vous souhaitez <b className="violet-fonce">être aidé</b> ?
        </p>
        <BoutonDemandeAide titre={'Je fais une demande d’aide'} />
      </div>
    </div>
  );
}

export default TuileActionDemandeAide;
