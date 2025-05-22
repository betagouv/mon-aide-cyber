import { PageHtmlCrisp } from '@lab-anssi/lib/dist/cms/cmsCrisp';

export type Article = PageHtmlCrisp;

export interface AdaptateurCmsCrispMAC {
  recupereGuideAidantCyber(): Promise<Article>;
}
