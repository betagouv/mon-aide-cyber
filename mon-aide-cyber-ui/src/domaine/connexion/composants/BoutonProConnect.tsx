export const BoutonProConnect = () => {
  return (
    <div>
      <div className="fr-connect-group texte-centre">
        <a className="fr-connect" href="/pro-connect/connexion">
          <span className="fr-connect__login">S’identifier avec</span>{' '}
          <span className="fr-connect__brand">ProConnect</span>
        </a>
        <p>
          <a
            href={import.meta.env['VITE_URL_PRO_CONNECT']}
            target="_blank"
            rel="noopener noreferrer"
            title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
          >
            Qu’est-ce que ProConnect ?
          </a>
        </p>
      </div>
    </div>
  );
};
