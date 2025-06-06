import { PageHtmlCrisp } from '@lab-anssi/lib';
import {
  AdaptateurCmsCrispMAC,
  Article,
} from '../../src/adaptateurs/AdaptateurCmsCrispMAC';

export class AdaptateurCmsCrispMACMemoire implements AdaptateurCmsCrispMAC {
  private articleARetourner: Map<string, Article> = new Map();

  async relaisAssociatifs(): Promise<PageHtmlCrisp> {
    return this.articleARetourner.get('relais-associatifs')!;
  }

  async promouvoirCommunauteAidantsCyber(): Promise<PageHtmlCrisp> {
    return this.articleARetourner.get('promouvoir-communaute-aidants-cyber')!;
  }

  async recupereGuideAidantCyber(): Promise<Article> {
    return this.articleARetourner.get('guide-aidant-cyber')!;
  }

  async promouvoirDiagnosticCyber(): Promise<PageHtmlCrisp> {
    return this.articleARetourner.get('promouvoir-diagnostic-cyber')!;
  }

  retourneArticle(nomArticle: string, article: Article) {
    this.articleARetourner.set(nomArticle, article);
  }
}
