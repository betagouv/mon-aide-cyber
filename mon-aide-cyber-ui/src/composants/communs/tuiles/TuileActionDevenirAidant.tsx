function TuileActionDevenirAidant() {
  return (
    <div className="tuile tuile-grande">
      <div className="illustration">
        <img
          src="/images/illustration-devenir-aidant.svg"
          alt="Deux personnes souhaitant devenir Aidant MonAideCyber"
        />
      </div>
      <div className="corps">
        <h4>Devenir Aidant</h4>
        <p>
          Vous êtes un <b>agent du service public</b>, un <b>professionnel</b>,
          un <b>bénévole</b> ou un <b>passionné</b> de Cyber et vous souhaitez{' '}
          <b className="violet-fonce">devenir Aidant</b> ?
        </p>
        <a href="/demandes/devenir-aidant">
          <button
            type="button"
            className="fr-btn bouton-mac bouton-mac-primaire"
          >
            Je veux être Aidant
          </button>
        </a>
      </div>
    </div>
  );
}

export default TuileActionDevenirAidant;
