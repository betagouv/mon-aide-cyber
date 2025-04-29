import { LienMailtoMAC } from '../../atomes/LienMailtoMAC.tsx';

type ProprietesConfirmation = {
  onClick: () => void;
};
export const Confirmation = (proprietes: ProprietesConfirmation) => {
  return (
    <>
      <div>
        <div className="fr-mt-2w">
          <h4>Votre demande a bien été prise en compte !</h4>
        </div>
        <div className="fr-mt-2w">
          <p>
            Celle-ci sera traitée dans les meilleurs délais.
            <br />
            Vous recevrez un email de validation lorsque votre demande sera
            affectée à un Aidant cyber.
          </p>
          <p>
            Pensez à vérifier dans vos spams ou contactez-nous à{' '}
            <LienMailtoMAC />
          </p>
        </div>
        <button
          type="button"
          key="envoyer-demande-aide"
          className="fr-btn bouton-mac bouton-mac-primaire"
          onClick={() => proprietes.onClick()}
        >
          Retour à la page d&apos;accueil
        </button>
      </div>
    </>
  );
};
