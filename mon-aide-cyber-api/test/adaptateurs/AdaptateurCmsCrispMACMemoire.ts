import { unArticle } from '../constructeurs/constructeurArticle';
import {
  AdaptateurCmsCrispMAC,
  Article,
} from '../../src/adaptateurs/AdaptateurCmsCrispMAC';

export class AdaptateurCmsCrispMACMemoire implements AdaptateurCmsCrispMAC {
  private articleARetourner: Article = unArticle().construis();

  async recupereGuideAidantCyber(): Promise<Article> {
    return this.articleARetourner;
  }

  retourneArticle(article: Article) {
    this.articleARetourner = article;
  }
}
