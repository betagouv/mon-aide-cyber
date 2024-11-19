import HeroBloc from '../../../composants/communs/HeroBloc.tsx';
import { TypographieH5 } from '../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import { FormulaireDemandeAutodiagnostic } from '../../../composants/formulaires/formulaire-demande-autodiagnostic/FormulaireDemandeAutodiagnostic.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';

export const EcranDemandeAutodiagnostic = () => {
  return (
    <main role="main" className="demande-aide">
      <HeroBloc>
        <div className="contenu">
          <TypographieH2 className="fr-mb-2w">
            Diagnostic sans Aidant
          </TypographieH2>
          <p>Faire le diagnostic MonAideCyber en autonomie</p>
        </div>
      </HeroBloc>
      <section className="fond-clair-mac">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-md-8 fr-col-sm-12 section">
              <p className="fr-mb-2w">
                Demande pour bénéficier de MonAideCyber
              </p>
              <div className="fr-mt-2w">
                <div>
                  <TypographieH5>
                    Vous souhaitez bénéficier du dispositif MonAideCyber et
                    mener un diagnostic en autonomie
                  </TypographieH5>
                  <p>
                    Veuillez compléter les informations ci-dessous pour
                    formaliser votre demande.
                  </p>
                  <p>
                    Les information que vous fournissez via ce formulaire sont
                    strictement confidentielles et respectent nos conditions
                    générales d&apos;utilisation
                  </p>
                </div>
                <div className="champs-obligatoire">
                  <span className="asterisque">*</span>
                  <span> Champ obligatoire</span>
                </div>
              </div>
              <div className="fr-mt-2w">
                <FormulaireDemandeAutodiagnostic />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
