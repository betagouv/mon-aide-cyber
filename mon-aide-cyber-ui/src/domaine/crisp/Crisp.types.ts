export type TableDesMatieres = {
  profondeur: number;
  texte: string;
  id: string;
}[];

export type ReponseArticle = {
  titre: string;
  contenu: string | null;
  description: string;
  tableDesMatieres: TableDesMatieres;
};
