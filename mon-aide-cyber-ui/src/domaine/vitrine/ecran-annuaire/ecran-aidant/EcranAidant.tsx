import { useSearchParams } from 'react-router-dom';
import { SolliciterAidant } from './SolliciterAidant';
import { AidantAnnuaire } from '../AidantAnnuaire.ts';
import { UUID } from '../../../../types/Types.ts';
import { useTitreDePage } from '../../../../hooks/useTitreDePage.ts';

export const EcranAidant = () => {
  const [params] = useSearchParams();
  const parametresUrl = new URLSearchParams(params);
  useTitreDePage('Solliciter un Aidant cyber');

  const nomPrenomAidant = parametresUrl.get('nomPrenom')!;
  const identifiantAidant = parametresUrl.get('aidant')!;
  const nomDepartement = parametresUrl.get('dpt')!;

  const aidant: AidantAnnuaire = {
    nomPrenom: nomPrenomAidant,
    identifiant: identifiantAidant as UUID,
  };

  return (
    <main role="main">
      <div className="fond-clair-mac">
        <div className="fr-container" id="formulaire-solliciter-aidant">
          {aidant ? (
            <SolliciterAidant aidant={aidant} nomDepartement={nomDepartement} />
          ) : null}
        </div>
      </div>
    </main>
  );
};
