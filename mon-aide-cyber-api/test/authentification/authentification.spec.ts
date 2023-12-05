import { describe } from 'vitest';
import { authentifie } from '../../src/authentification/authentification';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from './constructeurs/constructeurAidant';
import { GestionnaireDeJetonJWT } from '../../src/infrastructure/authentification/gestionnaireDeJetonJWT';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Authentification', () => {
  it('génère un jeton JWT', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2023-02-04T10:00:00+01:00')),
    );

    const entrepotAidant = new EntrepotAidantMemoire();
    const thomas = unAidant()
      .avecUnIdentifiant('98fb45f5-db74-40d2-8ab8-0c774e39df36')
      .avecUnNomPrenom('Thomas')
      .avecUnIdentifiantDeConnexion('Thomas')
      .avecUnMotDePasse('motDePasse')
      .construis();
    entrepotAidant.persiste(thomas);

    const aidantAuthentifie = await authentifie(
      entrepotAidant,
      new GestionnaireDeJetonJWT('ma-clef-secrete'),
      'Thomas',
      'motDePasse',
    );
    expect(aidantAuthentifie.jeton).toStrictEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWFudCI6Ijk4ZmI0NWY1LWRiNzQtNDBkMi04YWI4LTBjNzc0ZTM5ZGYzNiIsImlhdCI6MTY3NTUwMTIwMDAwMH0.XaNT7-A3lUv4NgZEbpD6gc-Nrv0fE19RN554t3IUjTM',
    );
  });
});
