import { Perimetre } from '../../domaine/diagnostic/Referentiel.ts';
import { useEffect, useState } from 'react';

const perimetres: Map<Perimetre, { style: string; titre: string }> = new Map([
  [
    'SYSTEME-INDUSTRIEL',
    { style: 'fr-icon-database-fill', titre: 'SYSTÈME INDUSTRIEL' },
  ],
  [
    'ATTAQUE-CIBLEE',
    { style: 'fr-icon-map-pin-user-fill', titre: 'ATTAQUE CIBLÉE' },
  ],
]);

export const BadgePerimetre = ({ perimetre }: { perimetre: Perimetre }) => {
  const [perimetreCourant, setPerimetreCourant] = useState({
    style: '',
    titre: '',
  });

  useEffect(() => {
    setPerimetreCourant(perimetres.get(perimetre) || { style: '', titre: '' });
  }, [perimetre]);

  return (
    <p className={`${perimetreCourant.style} badge-diagnostic`}>
      {perimetreCourant.titre}
    </p>
  );
};
