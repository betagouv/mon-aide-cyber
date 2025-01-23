import { assert, describe, expect } from 'vitest';
import { AdaptateurDeVerificationDeCGUMAC } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGUMAC';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { Response } from 'express';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';
import { Entrepots } from '../../src/domaine/Entrepots';
import { AdaptateurDeVerificationDeCGU } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGU';

import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import crypto from 'crypto';

describe('Adaptateur de Vérification de CGU', () => {
  let entrepots: Entrepots;
  let adaptateurDeVerificationDeCGU: AdaptateurDeVerificationDeCGU;
  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    adaptateurDeVerificationDeCGU = new AdaptateurDeVerificationDeCGUMAC(
      entrepots
    );
  });

  it('Vérifie que les CGU ont bien été signées', async () => {
    const aidant = unAidant().sansCGUSignees().construis();
    await entrepots.aidants().persiste(aidant);
    let codeRecu = 0;
    let jsonRecu = {};
    let suiteAppelee = false;
    const reponse = {
      status: (code) => {
        codeRecu = code;
        return { json: (corps) => (jsonRecu = corps) };
      },
    } as Response;

    await adaptateurDeVerificationDeCGU.verifie()(
      {
        identifiantUtilisateurCourant: aidant.identifiant,
      } as RequeteUtilisateur,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(codeRecu).toBe(302);
    expect(jsonRecu).toStrictEqual<ReponseHATEOAS>({
      liens: {
        'valider-signature-cgu': {
          url: '/api/utilisateur/valider-signature-cgu',
          methode: 'POST',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });

  it('Exécute la suite si les CGU ont été signées', async () => {
    const utilisateur = unAidant().construis();
    await entrepots.aidants().persiste(utilisateur);
    let suiteAppelee = false;

    await adaptateurDeVerificationDeCGU.verifie()(
      {
        identifiantUtilisateurCourant: utilisateur.identifiant,
      } as RequeteUtilisateur,
      {} as Response,
      () => {
        suiteAppelee = true;
      }
    );

    expect(suiteAppelee).toBe(true);
  });

  it("Retourne une erreur si l'utilisateur n'est pas trouvé", async () => {
    try {
      await adaptateurDeVerificationDeCGU.verifie()(
        {
          identifiantUtilisateurCourant: crypto.randomUUID(),
        } as RequeteUtilisateur,
        {} as Response,
        () => ''
      );
      assert.fail('');
    } catch (e: unknown | Error) {
      expect((e as Error).message).toStrictEqual(
        "L'utilisateur voulant accédé à cette ressource n'est pas connu."
      );
    }
  });
});
