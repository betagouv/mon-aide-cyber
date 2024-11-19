import { Input } from '../atomes/Input/Input.tsx';
import { useModale } from '../../fournisseurs/hooks.ts';
import { useCallback } from 'react';
import { CorpsCGU } from '../../vues/ComposantCGU.tsx';
import Button from '../atomes/Button/Button.tsx';

export const ChampValidationCGUs = ({
  sontValidees,
  surCguCliquees,
}: {
  sontValidees: boolean;
  surCguCliquees: () => void;
}) => {
  const { affiche } = useModale();
  const afficheModaleCGU = useCallback(() => {
    affiche({
      corps: <CorpsCGU />,
      taille: 'large',
    });
  }, [affiche]);

  return (
    <div className={`fr-checkbox-group mac-radio-group`}>
      <Input
        type="checkbox"
        id="cgu-aide"
        name="cgu-aide"
        onClick={surCguCliquees}
        checked={sontValidees}
      />
      <label className="fr-label" htmlFor="cgu-aide">
        <div>
          <span className="asterisque">*</span>
          <span>
            {' '}
            J&apos;accepte les{' '}
            <b>
              <Button type="button" variant="link" onClick={afficheModaleCGU}>
                conditions générales d&apos;utilisation
              </Button>
            </b>{' '}
            de MonAideCyber au nom de l&apos;entité que je représente
          </span>
        </div>
      </label>
    </div>
  );
};
