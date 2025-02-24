import {
  Association,
  AssociationsParRegion,
} from '../EcranRelaisAssociatifs.tsx';
import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import { Accordion } from '../../../../composants/atomes/Accordion/Accordion.tsx';

const AssociationsParRegion = (props: { associations: Association[] }) => {
  return (
    <ul>
      {props?.associations.map((association) => (
        <li key={association.nom}>
          <span>{association.nom}</span> <br />
          <a href={association.urlSite} target="_blank" rel="noreferrer">
            {association.urlSite}
          </a>
        </li>
      ))}
    </ul>
  );
};
export const recupereTitreParType = (code: string) => {
  switch (code) {
    case 'national':
      return 'Relais associatifs à portée nationale';
    case 'regional':
      return 'Relais associatifs régionaux';
    case 'dromCom':
      return 'Relais associatifs dans les DROM/COM';
  }
};

export const SectionListeAssociationsParRegion = (props: {
  code: string;
  associationsParRegion: AssociationsParRegion;
}) => {
  if (!props.associationsParRegion) return null;

  return (
    <section className="section" id={props.code}>
      <TypographieH3>{recupereTitreParType(props.code)}</TypographieH3>
      <div className="fr-accordions-group">
        {Object.entries(props.associationsParRegion).map(
          ([clef, valeur], index) => (
            <Accordion
              key={valeur.nom}
              title={`${valeur.nom} (${valeur?.associations ? valeur.associations?.length : '0'})`}
              id={`accordion-${clef}-${index}`}
            >
              {valeur.associations && valeur.associations.length > 0 ? (
                <AssociationsParRegion associations={valeur.associations} />
              ) : (
                <span>
                  Nous n‘avons pas de relais associatifs dans cette région pour
                  le moment. Nous mettons à jour nos informations régulièrement,
                  n‘hésitez pas à revenir sur cette page.
                </span>
              )}
            </Accordion>
          )
        )}
      </div>
    </section>
  );
};
