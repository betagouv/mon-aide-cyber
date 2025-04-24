import { liensMesServicesCyber } from '../../../infrastructure/mes-services-cyber/liens.ts';
import Button from '../Button/Button.tsx';
import './bouton-demande-aide.scss';
import React, { PropsWithChildren } from 'react';

export const BoutonDemandeAide = ({
  titre,
  ...proprietes
}: PropsWithChildren<
  React.HTMLAttributes<HTMLButtonElement> & { titre: string }
>) => {
  const { className } = proprietes;
  return (
    <Button type={'button'} className={`bouton-demande-aide ${className}`}>
      <a
        href={liensMesServicesCyber().cyberDepartAvecTracking}
        target="_blank"
        rel="noreferrer"
      >
        {titre}
      </a>
    </Button>
  );
};
