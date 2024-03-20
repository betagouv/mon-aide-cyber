import { describe, expect } from 'vitest';
import { AdaptateurDeVerificationDeCGUMAC } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGUMAC';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { Response } from 'express';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';
import { Entrepots } from '../../src/domaine/Entrepots';
import { AdaptateurDeVerificationDeCGU } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGU';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';

describe('Adaptateur de Vérification de CGU', () => {
  let entrepots: Entrepots;
  let adaptateurDeVerificationDeCGU: AdaptateurDeVerificationDeCGU;
  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    adaptateurDeVerificationDeCGU = new AdaptateurDeVerificationDeCGUMAC(entrepots);
  });

  it('vérifie que les CGU ont bien été signées', async () => {
    const aidant = unAidant().sansEspace().construis();
    aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
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
      },
    );

    expect(codeRecu).toBe(302);
    expect(jsonRecu).toStrictEqual<ReponseHATEOAS>({
      liens: {
        suite: { url: '/finalise-creation-compte' },
        'creer-espace-aidant': {
          url: '/api/espace-aidant/cree',
          methode: 'POST',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });

  it('exécute la suite si les CGU et la charte ont été signées', async () => {
    const aidant = unAidant().construis();
    entrepots.aidants().persiste(aidant);
    let suiteAppelee = false;

    await adaptateurDeVerificationDeCGU.verifie()(
      {
        identifiantUtilisateurCourant: aidant.identifiant,
      } as RequeteUtilisateur,
      {} as Response,
      () => {
        suiteAppelee = true;
      },
    );

    expect(suiteAppelee).toBe(true);
  });
});
