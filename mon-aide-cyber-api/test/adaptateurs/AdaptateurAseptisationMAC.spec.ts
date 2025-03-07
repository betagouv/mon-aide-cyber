import { describe, expect, it } from 'vitest';
import { AdaptateurAseptisationMAC } from '../../src/adaptateurs/AdaptateurAseptisationMAC';
import { Request, Response } from 'express';

describe("sur demande d'aseptisation", () => {
  it('supprime les espaces au début et à la fin du paramètre', async () => {
    const requete: Request = { body: { param: '  une valeur ' } } as Request;
    let valeurAseptisee;
    const suite = () => (valeurAseptisee = requete.body.param);

    await new AdaptateurAseptisationMAC().aseptise('param')(
      requete,
      {} as Response,
      suite
    );

    expect(valeurAseptisee).toStrictEqual('une valeur');
  });

  it('prend en compte plusieurs paramètres', async () => {
    const requete: Request = {
      body: { paramRenseigne: '  une valeur ' },
    } as Request;
    let valeurAseptisee;
    const suite = () => (valeurAseptisee = requete.body.paramRenseigne);

    await new AdaptateurAseptisationMAC().aseptise(
      'paramAbsent',
      'paramRenseigne'
    )(requete, {} as Response, suite);

    expect(valeurAseptisee).toStrictEqual('une valeur');
  });

  it('neutralise le code HTML', async () => {
    const requete: Request = {
      body: { paramRenseigne: '<script>alert("hacked!");</script>' },
    } as Request;
    const suite = () => (paramRenseigne = requete.body.paramRenseigne);
    let paramRenseigne;

    await new AdaptateurAseptisationMAC().aseptise('paramRenseigne')(
      requete,
      {} as Response,
      suite
    );

    expect(paramRenseigne).toStrictEqual(
      '&lt;script&gt;alert(&quot;hacked!&quot;);&lt;&#x2F;script&gt;'
    );
  });

  it('aseptise les paramètres de la requête', async () => {
    const requete: Request = {
      params: { paramRenseigne: '<script>alert("hacked!");</script>' },
    } as unknown as Request;
    const suite = () => (paramRenseigne = requete.params.paramRenseigne);
    let paramRenseigne;

    await new AdaptateurAseptisationMAC().aseptise('paramRenseigne')(
      requete,
      {} as Response,
      suite
    );

    expect(paramRenseigne).toStrictEqual(
      '&lt;script&gt;alert(&quot;hacked!&quot;);&lt;&#x2F;script&gt;'
    );
  });
});
