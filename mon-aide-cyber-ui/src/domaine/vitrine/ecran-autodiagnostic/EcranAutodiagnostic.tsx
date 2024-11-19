import Button from '../../../composants/atomes/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

export const EcranAutodiagnostic = () => {
  const navigate = useNavigate();

  return (
    <main role="main">
      <p>La landing du diagnostic sans Aidant</p>
      <Button
        type="button"
        onClick={() => {
          navigate('/demande-autodiagnostic');
        }}
      >
        Faire une demande de diagnostic sans Aidant
      </Button>
    </main>
  );
};
