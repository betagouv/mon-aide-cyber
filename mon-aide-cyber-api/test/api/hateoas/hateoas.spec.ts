import { describe, it } from 'vitest';
import { lesContextesUtilisateursExistants } from './lesContextesUtilisateursExistants';
import { constructeurActionsHATEOAS } from '../../../src/api/hateoas/hateoas';
import { InformationsContexte } from '../../../src/adaptateurs/AdaptateurDeVerificationDeSession';

describe('HATEOAS', () => {
  it.each(lesContextesUtilisateursExistants)(
    'Retourne les liens correspondant au contexte $contexte',
    (contexte) => {
      const reponseHATEOAS = constructeurActionsHATEOAS()
        .pour(contexte.informationContexte as InformationsContexte)
        .construis();

      expect(reponseHATEOAS).toStrictEqual({
        liens: { ...contexte.liens },
      });
    }
  );
});
