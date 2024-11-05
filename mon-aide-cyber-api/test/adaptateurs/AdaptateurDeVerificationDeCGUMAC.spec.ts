import { describe, expect } from 'vitest';
import { AdaptateurDeVerificationDeCGUMAC } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGUMAC';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { Response } from 'express';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';
import { Entrepots } from '../../src/domaine/Entrepots';
import { AdaptateurDeVerificationDeCGU } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGU';
import { unUtilisateur } from '../authentification/constructeurs/constructeurUtilisateur';

describe('Adaptateur de Vérification de CGU', () => {
  let entrepots: Entrepots;
  let adaptateurDeVerificationDeCGU: AdaptateurDeVerificationDeCGU;
  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    adaptateurDeVerificationDeCGU = new AdaptateurDeVerificationDeCGUMAC(
      entrepots
    );
  });

  it('vérifie que les CGU ont bien été signées', async () => {
    const utilisateur = unUtilisateur().sansCGUSignees().construis();
    await entrepots.utilisateurs().persiste(utilisateur);
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
        identifiantUtilisateurCourant: utilisateur.identifiant,
      } as RequeteUtilisateur,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(codeRecu).toBe(302);
    expect(jsonRecu).toStrictEqual<ReponseHATEOAS>({
      liens: {
        'creer-espace-aidant': {
          url: '/api/espace-aidant/cree',
          methode: 'POST',
        },
      },
    });
    expect(suiteAppelee).toBe(false);
  });

  it('exécute la suite si les CGU et la charte ont été signées', async () => {
    const utilisateur = unUtilisateur().construis();
    entrepots.utilisateurs().persiste(utilisateur);
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
});
