import { describe, expect, it } from 'vitest';
import { Request, Response } from 'express';
import { AdaptateurSignatureRequeteHTTP } from '../../src/adaptateurs/AdaptateurSignatureRequeteHTTP';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { adaptateurEnvironnement } from '../../src/adaptateurs/adaptateurEnvironnement';

describe('Signature Requete HTTP', () => {
  it('Vérifie la signature TALLY', async () => {
    let suiteAppelee = false;
    const requete: Request = {
      headers: {
        'tally-signature': 'dJiTp1hkvdSvPEL51kGtiwcQhSmMSJ7RGXOFjmTJBqg=',
      },
      body: { body: '' },
    } as unknown as Request;
    const reponse = {} as unknown as Response;
    const suite = () => (suiteAppelee = true);

    new AdaptateurSignatureRequeteHTTP().verifie('TALLY')(
      requete,
      reponse,
      suite
    );

    expect(suiteAppelee).toBe(true);
  });

  it('Retourne une erreur HTTP 401 si la signature TALLY ne correspond pas', async () => {
    let suiteAppelee = false;
    let statusEnvoye: number | undefined = undefined;
    let messageRecu: string | undefined = undefined;
    const requete: Request = {
      headers: {
        'tally-signature': 'abc',
      },
      body: { body: '' },
    } as unknown as Request;
    const reponse = {
      status: (status: number) => {
        statusEnvoye = status;
        return {
          send: (message: string) => {
            messageRecu = message;
          },
        };
      },
    } as unknown as Response;
    const suite = () => (suiteAppelee = true);

    new AdaptateurSignatureRequeteHTTP().verifie('TALLY')(
      requete,
      reponse,
      suite
    );

    expect(suiteAppelee).toBe(false);
    expect(statusEnvoye).toBe(401);
    expect(messageRecu).toBe('La signature est invalide');
  });

  it('Vérifie la signature LIVESTORM', async () => {
    FournisseurHorlogeDeTest.initialise(new Date('2025-07-16T08:00:00Z'));
    let suiteAppelee = false;
    adaptateurEnvironnement.signatures = () => ({
      livestorm: () => ({
        finAtelier: 'signature',
      }),
      tally: () => ({
        suiviDiagnostic: '',
      }),
    });
    const requete: Request = {
      headers: {
        'x-livestorm-signature': `bcee8607a976dee318a3aa34fa780a4a9ce777b4feb4a6ab218c24c45ca7953e,${FournisseurHorloge.maintenant().getTime()}`,
      },
      body: {
        uneClef: 'valeur',
      },
    } as unknown as Request;
    const reponse = {} as unknown as Response;
    const suite = () => (suiteAppelee = true);

    new AdaptateurSignatureRequeteHTTP().verifie('LIVESTORM')(
      requete,
      reponse,
      suite
    );

    expect(suiteAppelee).toBe(true);
  });

  it('Retourne une erreur HTTP 401 si la signature LIVESTORM ne correspond pas', async () => {
    let suiteAppelee = false;
    let statusEnvoye: number | undefined = undefined;
    let messageRecu: string | undefined = undefined;
    const requete: Request = {
      headers: {
        'x-livestorm-signature': `abc,${FournisseurHorloge.maintenant().getTime()}`,
      },
      body: {
        uneClef: 'valeur',
      },
    } as unknown as Request;
    const reponse = {
      status: (status: number) => {
        statusEnvoye = status;
        return {
          send: (message: string) => {
            messageRecu = message;
          },
        };
      },
    } as unknown as Response;
    const suite = () => (suiteAppelee = true);

    new AdaptateurSignatureRequeteHTTP().verifie('LIVESTORM')(
      requete,
      reponse,
      suite
    );

    expect(suiteAppelee).toBe(false);
    expect(statusEnvoye).toBe(401);
    expect(messageRecu).toBe('La signature est invalide');
  });
});
