import { Input } from '../atomes/Input/Input.tsx';

export const ChampValidationCGUs = ({
  sontValidees,
  surCguCliquees,
  erreur,
}: {
  sontValidees: boolean;
  erreur?: any;
  surCguCliquees: () => void;
}) => {
  return (
    <div
      className={`fr-checkbox-group mac-radio-group ${erreur ? 'fr-input-group--error' : ''}`}
    >
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
            <b className="violet-fonce">
              <a href="/cgu" target="_blank">
                conditions générales d&apos;utilisation
              </a>
            </b>{' '}
            de MonAideCyber
          </span>
        </div>
      </label>
    </div>
  );
};
