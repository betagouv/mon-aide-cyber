import { Objet, TypeUtilisateur, Utilisateur } from '../../relation/Tuple';

declare const ConstructeurUtilisateur = {
  deType: (type: TypeUtilisateur) => ConstructeurUtilisateur,
  deTypeAidant: () => ConstructeurUtilisateur,
  avecIdentifiant: (identifiant: string) => ConstructeurUtilisateur,
  construis: () => Utilisateur,
};

declare const ConstructeurObjet = {
  deTypeDiagnostic: () => ConstructeurObjet,
  avecIdentifiant: (identifiant: string) => ConstructeurObjet,
  construis: () => Objet,
};

export { ConstructeurUtilisateur, ConstructeurObjet };
