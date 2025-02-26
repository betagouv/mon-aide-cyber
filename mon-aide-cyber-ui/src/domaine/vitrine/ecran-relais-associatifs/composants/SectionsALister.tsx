import { ReferentielAssociations } from '../EcranRelaisAssociatifs.tsx';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import { SectionListeAssociationsParRegion } from './SectionListeAssociations.tsx';

export const SectionsDePageALister = ({
  referentiel,
}: {
  referentiel?: ReferentielAssociations;
}) => {
  if (!referentiel)
    return <section className="section">Pas de résultats</section>;

  return (
    <>
      <section className="section" id="national">
        <TypographieH2>Relais associatifs à portée nationale</TypographieH2>
        <br />
        <ul>
          {referentiel?.national?.map((association) => (
            <li key={association.nom}>
              <span>{association.nom}</span> <br />
              <a href={association.urlSite} target="_blank" rel="noreferrer">
                {association.urlSite}
              </a>
            </li>
          ))}
        </ul>
      </section>
      {referentiel?.regional ? (
        <SectionListeAssociationsParRegion
          code="regional"
          associationsParRegion={referentiel?.regional}
        />
      ) : null}
      {referentiel?.dromCom ? (
        <SectionListeAssociationsParRegion
          code="dromCom"
          associationsParRegion={referentiel?.dromCom}
        />
      ) : null}
    </>
  );
};
