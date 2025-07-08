import { beforeEach, describe, expect, it } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import { AdaptateurValidateurCoherenceMAC } from '../../src/adaptateurs/AdaptateurValidateurCoherenceMAC';

describe('Valide la consistence du corps d’une requête', () => {
  let codeStatutRecu: number | undefined = undefined;
  let suiteAppelee = false;
  let reponse: Response;
  const suite: NextFunction = () => {
    suiteAppelee = true;
  };

  beforeEach(() => {
    codeStatutRecu = undefined;
    suiteAppelee = false;
    reponse = {
      status: (code) => {
        codeStatutRecu = code;
        return reponse;
      },
      json: (__message) => {
        return reponse;
      },
    } as Response;
  });

  it('Valide un corps avec des attributs à plat', async () => {
    const requete: Request = {
      body: {
        champ1: 'valeur1',
        champ2: 'valeur2',
        champ3: 'valeur3',
      },
    } as Request;

    new AdaptateurValidateurCoherenceMAC().valide({
      champs: [{ nom: 'champ1' }, { nom: 'champ2' }],
    })(requete, reponse, suite);

    expect(codeStatutRecu).toBe(400);
  });

  it('Valide un corps avec des objets imbriqués', async () => {
    const requete: Request = {
      body: {
        champ1: {
          champ11: 'valeur11',
          champ12: 'valeur12',
          champ13: 'valeur13',
        },
        champ2: 'valeur2',
      },
    } as Request;

    new AdaptateurValidateurCoherenceMAC().valide({
      champs: [
        { nom: 'champ1', champs: [{ nom: 'champ11' }, { nom: 'champ12' }] },
        { nom: 'champ2' },
      ],
    })(requete, reponse, suite);

    expect(codeStatutRecu).toBe(400);
  });

  it('Valide même si les champs ne sont pas valués', async () => {
    const requete: Request = {
      body: {
        champ1: 'valeur1',
      },
    } as Request;

    await new AdaptateurValidateurCoherenceMAC().valide({
      champs: [{ nom: 'champ1' }, { nom: 'champ2' }],
    })(requete, reponse, suite);

    expect(codeStatutRecu).toBeUndefined();
    expect(suiteAppelee).toBe(true);
  });
});
