import './encart-realiser-des-diagnostics-cyber.scss';
import Button from '../../atomes/Button/Button.tsx';
import { TypographieH3 } from '../../communs/typographie/TypographieH3/TypographieH3.tsx';
import { useNavigate } from 'react-router-dom';

export const EncartRealiserDesDiagnosticsCyber = () => {
  const navigate = useNavigate();

  return (
    <section className="encart-realiser-des-diagnostics-cyber">
      <div className="contenu">
        <div className="titre-details">
          <TypographieH3>
            Vous souhaitez réaliser des diagnostics cyber dans le cadre de vos
            activités commerciales ?
          </TypographieH3>
          <p>
            C‘est aussi possible. Vous ne pourrez, en revanche, pas être
            référencé Aidant cyber.
          </p>
        </div>
        <div className="cta">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/connexion')}
          >
            Réaliser des diagnostics cyber
          </Button>
        </div>
      </div>
    </section>
  );
};
