import { describe } from 'vitest';
import { authentifie } from '../../src/authentification/authentification';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from './constructeurs/constructeurAidant';
import { GestionnaireDeJetonJWT } from '../../src/infrastructure/authentification/gestionnaireDeJetonJWT';

describe('Authentification', () => {
  it('génère un jeton JWT', async () => {
    process.env.SECRET_JETON = 'ma-clef-secrete';

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
      'eyJhbGciOiJIUzI1NiJ9.OThmYjQ1ZjUtZGI3NC00MGQyLThhYjgtMGM3NzRlMzlkZjM2.hKtc0U2BhwunzgdXvpFuuEkkStMYAcVM8ge6ttYDmBc',
    );
  });

  it('jette une erreur quand decoder un jeton echoue', () => {
    expect(() =>
      new GestionnaireDeJetonJWT('clef-secrete').verifie(
        'un jeton indecodable',
      ),
    ).toThrowError(new Error('jwt malformed'));
  });
});
