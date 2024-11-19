import HeroBloc from '../../composants/communs/HeroBloc.tsx';
import { TypographieH5 } from '../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';
import { TypographieH2 } from '../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { CapteurFormulaireDemandeAutodiagnostic } from './formulaire-demande-auto-diagnostic/CapteurFormulaireDemandeAutodiagnostic.tsx';

export const EcranDemandeAutodiagnostic = () => {
  return (
    <main role="main" className="demande-aide">
      <HeroBloc>
        <div className="contenu">
          <TypographieH2 className="fr-mb-2w">
            Utiliser l&apos;outil de diagnostic
          </TypographieH2>
          <p>Bénéficier du service sans faire appel à un Aidant cyber</p>
        </div>
      </HeroBloc>
      <section className="fond-clair-mac">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-md-8 fr-col-sm-12 section">
              <div className="fr-mt-2w">
                <div>
                  <TypographieH5>
                    Vous souhaitez accéder à l'outil de diagnostic de
                    MonAideCyber
                  </TypographieH5>
                  <p>
                    Veuillez compléter les informations ci-dessous pour
                    formaliser votre demande.
                  </p>
                  <p style={{ fontSize: '12px' }}>
                    Les informations que vous fournissez via ce formulaire sont
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
                <CapteurFormulaireDemandeAutodiagnostic />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
