export const Authentification = () => {
  return (
    <>
      <form>
        <section>
          <div>
            <fieldset className="fr-mb-5w">
              <label className="fr-label" htmlFor="identifiant-connexion">
                Votre adresse email
              </label>
              <input
                className="fr-input"
                type="text"
                id="identifiant-connexion"
                name="identifiant-connexion"
              />
              <label className="fr-label" htmlFor="mot-de-passe">
                Votre mot de passe
              </label>
              <input
                className="fr-input"
                type="text"
                id="mot-de-passe"
                name="mot-de-passe"
              />
            </fieldset>
          </div>
        </section>
      </form>
    </>
  );
};
