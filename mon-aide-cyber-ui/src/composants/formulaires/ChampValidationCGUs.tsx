import { Input } from '../atomes/Input/Input.tsx';
import { Link } from 'react-router-dom';

export const ChampValidationCGUs = ({
  sontValidees,
  surCguCliquees,
}: {
  sontValidees: boolean;
  surCguCliquees: () => void;
}) => {
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
            <b className="violet-fonce">
              <Link to="/cgu" target="_blank">
                conditions générales d&apos;utilisation
              </Link>
            </b>{' '}
            de MonAideCyber
          </span>
        </div>
      </label>
    </div>
  );
};
