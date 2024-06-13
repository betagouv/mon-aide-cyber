import { Profil } from '../../domaine/profil/Profil.ts';

export type EtatProfil = {
  nom: string;
  prenom: string;
  email: string;
  dateCreationCompte: string;
  enCoursDeChargement: boolean;
};

enum TypeActionProfil {
  PROFIL_CHARGE = 'PROFIL_CHARGE',
  PROFIL_CHARGE_EN_ERREUR = 'PROFIL_CHARGE_EN_ERREUR',
}

type ActionProfil =
  | {
      type: TypeActionProfil.PROFIL_CHARGE;
      profil: Profil;
    }
  | {
      type: TypeActionProfil.PROFIL_CHARGE_EN_ERREUR;
    };

export const reducteurProfil = (
  etat: EtatProfil,
  action: ActionProfil
): EtatProfil => {
  switch (action.type) {
    case TypeActionProfil.PROFIL_CHARGE_EN_ERREUR: {
      return { ...etat, enCoursDeChargement: false };
    }
    case TypeActionProfil.PROFIL_CHARGE: {
      const nomPrenomSepare = action.profil.nomPrenom.split(' ');
      const prenom = nomPrenomSepare[0];
      const nom = nomPrenomSepare[1];

      return {
        ...etat,
        nom,
        prenom,
        email: action.profil.identifiantConnexion,
        dateCreationCompte: action.profil.dateSignatureCGU,
        enCoursDeChargement: false,
      };
    }
  }
};

export const profilCharge = (profil: Profil): ActionProfil => {
  return {
    type: TypeActionProfil.PROFIL_CHARGE,
    profil,
  };
};

export const profilChargeEnErreur = (): ActionProfil => {
  return {
    type: TypeActionProfil.PROFIL_CHARGE_EN_ERREUR,
  };
};
