import { CmsCrisp, PageHtmlCrisp } from '@lab-anssi/lib';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';

export type Article = PageHtmlCrisp;

export interface AdaptateurCmsCrispMAC {
  recupereGuideAidantCyber(): Promise<Article>;

  promouvoirDiagnosticCyber(): Promise<Article>;

  promouvoirCommunauteAidantsCyber(): Promise<Article>;

  relaisAssociatifs(): Promise<Article>;
}

class AdaptateurCmsCrispMACConcret implements AdaptateurCmsCrispMAC {
  private cmsCrisp: CmsCrisp;

  constructor(idSite: string, clefAPI: string) {
    this.cmsCrisp = new CmsCrisp(idSite, clefAPI);
  }

  relaisAssociatifs(): Promise<PageHtmlCrisp> {
    throw new Error('Method not implemented.');
  }

  async promouvoirCommunauteAidantsCyber(): Promise<PageHtmlCrisp> {
    return await this.cmsCrisp.recupereArticle(
      adaptateurEnvironnement.crisp()?.promouvoirCommunauteAidantsCyber ?? ''
    );
  }

  async promouvoirDiagnosticCyber(): Promise<PageHtmlCrisp> {
    return await this.cmsCrisp.recupereArticle(
      adaptateurEnvironnement.crisp()?.promouvoirDiagnosticCyber ?? ''
    );
  }

  async recupereGuideAidantCyber(): Promise<Article> {
    return await this.cmsCrisp.recupereArticle(
      adaptateurEnvironnement.crisp()?.guideAidantCyber ?? ''
    );
  }
}

class AdaptateurCmsCrispMACMemoire implements AdaptateurCmsCrispMAC {
  private articeBouchone = {
    titre: 'Un article',
    contenu: 'Un contenu',
    description: 'Une description',
    tableDesMatieres: [],
  };

  async relaisAssociatifs(): Promise<PageHtmlCrisp> {
    return this.articeBouchone;
  }

  async promouvoirCommunauteAidantsCyber(): Promise<PageHtmlCrisp> {
    return this.articeBouchone;
  }

  async promouvoirDiagnosticCyber(): Promise<PageHtmlCrisp> {
    return this.articeBouchone;
  }
  async recupereGuideAidantCyber(): Promise<Article> {
    return this.articeBouchone;
  }
}

export const unAdaptateurCmsCrisp = (): AdaptateurCmsCrispMAC => {
  const configurationCrisp = adaptateurEnvironnement.crisp();
  if (!configurationCrisp) {
    return new AdaptateurCmsCrispMACMemoire();
  }
  return new AdaptateurCmsCrispMACConcret(
    configurationCrisp.idSite,
    configurationCrisp.clefAPI
  );
};
