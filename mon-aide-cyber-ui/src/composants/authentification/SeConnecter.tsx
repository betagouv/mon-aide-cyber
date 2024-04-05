import { useEffect, useState } from 'react';
import { Lien } from '../../domaine/Lien.ts';
import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../domaine/MoteurDeLiens.ts';

export const SeConnecter = () => {
  const [lienConnexion, setLienConnexion] = useState<Lien>({
    url: '/connexion',
  });
  const navigationMAC = useNavigationMAC();
  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve('rediriger', (lien) =>
      setLienConnexion(lien),
    );
  }, [navigationMAC.etat]);

  return (
    <a href={lienConnexion.url} className="violet-fonce">
      Se connecter
    </a>
  );
};
