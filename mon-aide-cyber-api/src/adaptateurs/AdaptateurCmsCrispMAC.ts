import { CmsCrisp, PageHtmlCrisp } from '@lab-anssi/lib';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { AdaptateurCmsCrispMACMemoire } from '../../test/adaptateurs/AdaptateurCmsCrispMACMemoire';

export type Article = PageHtmlCrisp;

export interface AdaptateurCmsCrispMAC {
  recupereGuideAidantCyber(): Promise<Article>;
}

class AdaptateurCmsCrispMACConcret implements AdaptateurCmsCrispMAC {
  private cmsCrisp: CmsCrisp;

  constructor(idSite: string, clefAPI: string) {
    this.cmsCrisp = new CmsCrisp(idSite, clefAPI);
  }

  async recupereGuideAidantCyber(): Promise<PageHtmlCrisp> {
    return await this.cmsCrisp.recupereArticle(
      adaptateurEnvironnement.crisp()?.guideAidantCyber ?? ''
    );
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
