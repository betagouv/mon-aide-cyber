import { TypographieH4 } from '../typographie/TypographieH4/TypographieH4';

function TuileActionDevenirAidant() {
  return (
    <div className="tuile tuile-grande">
      <div className="illustration">
        <img
          src="/images/illustration-devenir-aidant.svg"
          alt="Deux personnes souhaitant devenir Aidant Cyber"
        />
      </div>
      <div className="corps">
        <TypographieH4>Devenir Aidant cyber</TypographieH4>
        <p>
          Vous êtes un <b>agent du service public</b>, un <b>professionnel</b>,
          un <b>bénévole</b> ou un <b>passionné</b> de Cyber et vous souhaitez{' '}
          <b className="violet-fonce">devenir Aidant cyber</b> ?
        </p>
        <a href="/realiser-des-diagnostics-anssi#formulaire-formation">
          <button
            type="button"
            className="fr-btn bouton-mac bouton-mac-primaire"
          >
            Je veux être Aidant cyber
          </button>
        </a>
      </div>
    </div>
  );
}

export default TuileActionDevenirAidant;
