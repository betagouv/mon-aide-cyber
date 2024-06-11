export const LienMAC = ({ titre, route }: { titre: string; route: string }) => (
  <a href={route} title={titre}>
    <img
      className="fr-responsive-img taille-reduite-en-mobile logo-mac-diagnostic"
      src="/images/logo_mac.svg"
      alt="ANSSI"
    />
  </a>
);
