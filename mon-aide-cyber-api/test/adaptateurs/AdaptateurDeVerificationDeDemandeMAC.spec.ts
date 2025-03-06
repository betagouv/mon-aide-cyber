import { describe, expect, it } from 'vitest';
import { uneDemandeAide } from '../gestion-demandes/aide/ConstructeurDemandeAide';
import { EntrepotAideMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { AdaptateurDeVerificationDeDemandeMAC } from '../../src/adaptateurs/AdaptateurDeVerificationDeDemandeMAC';
import { Request, Response } from 'express';

describe('Adaptateur Vérification de demande d‘Aide', () => {
  it("Vérifie que l'email fourni a bien une demande associée", async () => {
    const demandeAide = uneDemandeAide().construis();
    const entrepotAide = new EntrepotAideMemoire();
    await entrepotAide.persiste(demandeAide);
    let suiteAppelee = false;
    const corps: Record<string, any> = {
      emailEntiteAidee: demandeAide.email,
    };

    await new AdaptateurDeVerificationDeDemandeMAC(entrepotAide).verifie()(
      { body: corps } as Request<Record<string, any>>,
      {} as Response,
      () => {
        suiteAppelee = true;
      }
    );

    expect(suiteAppelee).toBe(true);
  });

  it("Renvoie une erreur si la demande n'existe pas", async () => {
    let suiteAppelee = false;
    const corps: Record<string, any> = {
      emailEntiteAidee: 'mail inconnu',
    };
    let codeRecu = 0;
    let jsonRecu = {};
    const reponse = {
      status: (code) => {
        codeRecu = code;
        return { json: (corps) => (jsonRecu = corps) };
      },
    } as Response;

    await new AdaptateurDeVerificationDeDemandeMAC(
      new EntrepotAideMemoire()
    ).verifie()(
      { body: corps } as Request<Record<string, any>>,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(codeRecu).toBe(422);
    expect(jsonRecu).toStrictEqual({
      message:
        "Aucune demande d'aide ne correspond à cet email. Assurez-vous que l'entité a effectué une demande en ligne.",
    });
    expect(suiteAppelee).toBe(false);
  });

  it('Renvoie une erreur si la demande est incomplète', async () => {
    const demandeAide = uneDemandeAide().incomplete().construis();
    const entrepotAide = new EntrepotAideMemoire();
    entrepotAide.persiste(demandeAide);
    let suiteAppelee = false;
    const corps: Record<string, any> = {
      emailEntiteAidee: demandeAide.email,
    };
    let codeRecu = 0;
    let jsonRecu = {};
    const reponse = {
      status: (code) => {
        codeRecu = code;
        return { json: (corps) => (jsonRecu = corps) };
      },
    } as Response;

    await new AdaptateurDeVerificationDeDemandeMAC(entrepotAide).verifie()(
      { body: corps } as Request<Record<string, any>>,
      reponse,
      () => {
        suiteAppelee = true;
      }
    );

    expect(codeRecu).toBe(422);
    expect(jsonRecu).toStrictEqual({
      message:
        "Aucune demande d'aide ne correspond à cet email. Assurez-vous que l'entité a effectué une demande en ligne.",
    });
    expect(suiteAppelee).toBe(false);
  });
});
