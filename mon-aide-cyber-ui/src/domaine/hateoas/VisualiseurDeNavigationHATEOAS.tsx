import { useNavigationMAC } from '../../fournisseurs/hooks.ts';
import Button from '../../composants/atomes/Button/Button.tsx';
import { useState } from 'react';

export const VisualiseurDeNavigationHATEOAS = () => {
  const navigationMAC = useNavigationMAC();
  const [visualiseurAffiche, setVisualiseurAffiche] = useState(false);

  const logueNavigationMAC = () => {
    setVisualiseurAffiche((prev) => !prev);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        borderRadius: '.5rem',
        border: '2px black dashed',
        padding: '1rem',
      }}
    >
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
