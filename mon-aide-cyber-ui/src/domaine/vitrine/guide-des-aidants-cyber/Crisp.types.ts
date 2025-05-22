import { ReponseHATEOAS } from '../../Lien.ts';

export type TableDesMatieres = {
  profondeur: number;
  texte: string;
  id: string;
}[];
export type ReponseArticle = ReponseHATEOAS & {
  titre: string;
  contenu: string | null;
  description: string;
  tableDesMatieres: TableDesMatieres;
};
