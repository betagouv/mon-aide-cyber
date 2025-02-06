import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import Button from '../../composants/atomes/Button/Button.tsx';
import { useState } from 'react';
import './visualiseur-de-navigation-hateoas.scss';

export const VisualiseurDeNavigationHATEOAS = () => {
  const navigationMAC = useNavigationMAC();
  const [visualiseurAffiche, setVisualiseurAffiche] = useState(false);

  const logueNavigationMAC = () => {
    setVisualiseurAffiche((prev) => !prev);
  };

  return (
    <div className="visualiseur-navigation-hateoas">
      {visualiseurAffiche ? (
        <ul>
          {Object.keys(navigationMAC.etat).map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ) : null}
      <Button onClick={logueNavigationMAC}>NavigationMAC</Button>
    </div>
  );
};
