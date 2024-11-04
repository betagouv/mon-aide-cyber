import HeroBloc from '../../../../composants/communs/HeroBloc.tsx';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { FormulaireDemandeAutodiagnostic } from './formulaire-demande-autodiagnostic/FormulaireDemandeAutodiagnostic.tsx';

export const EcranDemandeAutodiagnostic = () => {
  return (
    <main role="main" className="formulaire-autodiagnostic">
      <HeroBloc>
        <div className="contenu">
          <TypographieH2>Diagnostic sans Aidant</TypographieH2>
          <br />
          <p>Faire le diagnostic MonAideCyber en autonomie</p>
        </div>
      </HeroBloc>
      <section className="fond-clair-mac">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <FormulaireDemandeAutodiagnostic />
          </div>
        </div>
      </section>
    </main>
  );
};
