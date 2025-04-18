import { liensMesServicesCyber } from '../../../infrastructure/mes-services-cyber/liens.ts';
import Button from '../Button/Button.tsx';
import './bouton-demande-aide.scss';

export const BoutonDemandeAide = ({ titre }: { titre: string }) => {
  return (
    <Button type={'button'} className={'bouton-demande-aide'}>
      <a
        href={liensMesServicesCyber().cyberDepart}
        target="_blank"
        rel="noreferrer"
      >
        {titre}
      </a>
    </Button>
  );
};
