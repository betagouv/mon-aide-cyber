import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2';
import { FormulaireMesPreferences } from './composants/FormulaireMesPreferences';
import './ecran-mes-preferences.scss';

export const EcranMesPreferences = () => {
  return (
    <article className="w-100 ecran-mes-preferences">
      <section className="fond-clair-mac">
        <TypographieH2>Mes préférences</TypographieH2>
      </section>
      <section>
        <div className="fr-grid-row">
          <div className="fr-col-md-6 fr-col-sm-12">
            <p>
              Indiquez ici vos préférences concernant les entités que vous
              souhaitez diagnostiquer. Ces informations sont utilisées pour
              faciliter la mise en relation entre votre profil et les demandes
              des bénéficiaires. Vous pouvez les modifier à tout moment.
            </p>
          </div>
        </div>
        <div className="fr-grid-row">
          <div className="fr-col-md-9 fr-col-sm-12">
            <FormulaireMesPreferences />
          </div>
        </div>
      </section>
    </article>
  );
};
