import { UtilisationDuService } from './UtilisationDuService.tsx';
import './utilisation-du-service.scss';
import { useTitreDePage } from '../../../../../hooks/useTitreDePage.ts';

export const EcranUtilisationDuService = () => {
  useTitreDePage('Utilisation du service');

  return (
    <section className="fond-clair-mac w-100">
      <UtilisationDuService />
    </section>
  );
};
