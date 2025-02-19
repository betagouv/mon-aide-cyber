import {
  Association,
  AssociationsParRegion,
} from '../EcranRelaisAssociatifs.tsx';
import { TypographieH6 } from '../../../../composants/communs/typographie/TypographieH6/TypographieH6.tsx';
import { TypographieH2 } from '../../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';

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
    <div className="section" id={props.code}>
      <TypographieH2>{recupereTitreParType(props.code)}</TypographieH2>
      <br />
      {Object.entries(props.associationsParRegion).map(([clef, valeur]) => (
        <div key={clef}>
          <TypographieH6>{valeur.nom}</TypographieH6>
          {valeur.associations && valeur.associations.length > 0 ? (
            <AssociationsParRegion associations={valeur.associations} />
          ) : (
            <span>
              Nous n'avons pas de relais associatifs dans cette région pour le
              moment. Nous mettons à jour nos informations régulièrement,
              n'hésitez pas à revenir sur cette page.
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
