import { Link } from 'react-router-dom';

export const LienMAC = ({ titre, route }: { titre: string; route: string }) => (
  <Link to={route} title={titre}>
    <img
      className="fr-responsive-img taille-reduite-en-mobile logo-mac-diagnostic"
      src="/images/logo_mac.svg"
      alt="ANSSI"
    />
  </Link>
);
