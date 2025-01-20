import { URL_CRISP_MAC } from '../../infrastructure/donnees/LiensExternes.ts';

export const LiensFooter = () => (
  <ul className="fr-footer__bottom-list">
    <li className="fr-footer__bottom-item">
      <a className="fr-footer__bottom-link" href="/accessibilite">
        Accessibilité : non conforme
      </a>
    </li>
    <li className="fr-footer__bottom-item">
      <a className="fr-footer__bottom-link" href="/mentions-legales">
        Mentions légales
      </a>
    </li>
    <li className="fr-footer__bottom-item">
      <a className="fr-footer__bottom-link" href="/charte-aidant">
        La charte de l&apos;aidant
      </a>
    </li>
    <li className="fr-footer__bottom-item">
      <a className="fr-footer__bottom-link" href="/cgu">
        Les CGU
      </a>
    </li>
    <li className="fr-footer__bottom-item">
      <a
        className="fr-footer__bottom-link"
        href={URL_CRISP_MAC}
        target="_blank"
        rel="noreferrer"
      >
        FAQ
      </a>
    </li>
  </ul>
);
