import TuileActionDemandeAide from './tuiles/TuileActionDemandeAide.tsx';
import TuileActionDevenirAidant from './tuiles/TuileActionDevenirAidant.tsx';
import { TypographieH2 } from './typographie/TypographieH2/TypographieH2.tsx';

type ActionsPiedDePageProps = React.HTMLAttributes<HTMLDivElement>;

export const ActionsPiedDePage = ({
  ...proprietesRestantes
}: ActionsPiedDePageProps) => {
  const { className } = proprietesRestantes;

  const nomsDeClasseEntier = [
    className ? `${className}` : null,
    'participer',
  ].join(' ');

  return (
    <section {...proprietesRestantes} className={nomsDeClasseEntier}>
      <div className="fr-container conteneur-participer">
        <div className="fr-col-12">
          <TypographieH2>Vous souhaitez participer ?</TypographieH2>
        </div>
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-6">
            <TuileActionDemandeAide />
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <TuileActionDevenirAidant />
          </div>
        </div>
      </div>
    </section>
  );
};
