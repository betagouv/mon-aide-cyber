import { Constructeur } from './constructeur';
import { fakerFR } from '@faker-js/faker';
import { Article } from '../../src/adaptateurs/AdaptateurCmsCrispMAC';

class ConstructeurArticle implements Constructeur<Article> {
  private contenuArticle: string = fakerFR.lorem.text();
  private description: string = fakerFR.lorem.sentence();
  private titre: string = fakerFR.lorem.word();
  private tableDesMatieres: any[] = [];

  avecLeContenu(contenu: string): ConstructeurArticle {
    this.contenuArticle = contenu;
    return this;
  }

  avecLeTitre(titre: string): ConstructeurArticle {
    this.titre = titre;
    return this;
  }

  avecLaDescription(description: string): ConstructeurArticle {
    this.description = description;
    return this;
  }

  construis(): Article {
    return {
      titre: this.titre,
      contenu: this.contenuArticle,
      description: this.description,
      tableDesMatieres: this.tableDesMatieres,
    };
  }
}

export const unArticle = (): ConstructeurArticle => {
  return new ConstructeurArticle();
};
