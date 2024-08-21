function TuileActionDemandeAide() {
  return (
    <div className="tuile tuile-grande">
      <div className="illustration">
        <img
          src="/images/illustration-homepage-aides.svg"
          alt="Trois personnes souhaitant devenir Aidant MonAideCyber"
        />
      </div>
      <div className="corps">
        <h4>Bénéficier de MonAideCyber</h4>
        <p>
          Vous êtes décideur ou employé d’une <b>collectivité territoriale</b>,
          d’une <b>association</b>, ou d’une <b>entreprise</b> (TPE, PME,
          ETI...) et vous souhaitez <b className="violet-fonce">être aidé</b> ?
        </p>
        <a href="/demande-aide">
          <button
            type="button"
            className="fr-btn bouton-mac bouton-mac-primaire"
          >
            Je fais une demande d&apos;aide
          </button>
        </a>
      </div>
    </div>
  );
}

export default TuileActionDemandeAide;
