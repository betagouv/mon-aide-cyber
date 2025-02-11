import { Profil } from '../../../../profil/Profil';
import { TypeAffichageAnnuaire } from 'mon-aide-cyber-api/src/espace-aidant/Aidant.ts';

export type TypeAffichage = 'PRENOM_NOM' | 'PRENOM_N' | 'P_NOM';

export type EtatProfil = {
  nom: string;
  prenom: string;
  email: string;
  consentementAnnuaire: boolean;
  dateCreationCompte: string;
  enCoursDeChargement: boolean;
  affichagesAnnuaire?: {
    type: TypeAffichageAnnuaire;
    valeur: string;
    actif?: boolean;
  }[];
};

enum TypeActionProfil {
  PROFIL_CHARGE = 'PROFIL_CHARGE',
  PROFIL_CHARGE_EN_ERREUR = 'PROFIL_CHARGE_EN_ERREUR',
  COCHE_CONSENTEMENT_ANNUAIRE = 'COCHE_CONSENTEMENT_ANNUAIRE',
  COCHE_TYPE_AFFICHAGE_ANNUAIRE = 'COCHE_TYPE_AFFICHAGE_ANNUAIRE',
}

type ActionProfil =
  | {
      type: TypeActionProfil.PROFIL_CHARGE;
      profil: Profil;
    }
  | {
      type: TypeActionProfil.PROFIL_CHARGE_EN_ERREUR;
    }
  | {
      type: TypeActionProfil.COCHE_CONSENTEMENT_ANNUAIRE;
    }
  | {
      type: TypeActionProfil.COCHE_TYPE_AFFICHAGE_ANNUAIRE;
      typeAffichageAnnuaire: TypeAffichage;
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
      const [prenom, ...nom] = action.profil.nomPrenom.split(' ');
      return {
        ...etat,
        nom: nom.join(' '),
        prenom,
        email: action.profil.identifiantConnexion,
        dateCreationCompte: action.profil.dateSignatureCGU,
        consentementAnnuaire: action.profil.consentementAnnuaire,
        affichagesAnnuaire: action.profil.affichagesAnnuaire,
        enCoursDeChargement: false,
      };
    }
    case TypeActionProfil.COCHE_CONSENTEMENT_ANNUAIRE: {
      return {
        ...etat,
        consentementAnnuaire: !etat.consentementAnnuaire,
      };
    }
    case TypeActionProfil.COCHE_TYPE_AFFICHAGE_ANNUAIRE: {
      if (!etat.affichagesAnnuaire) return { ...etat };

      const affichagesAnnuaireAChanger = etat.affichagesAnnuaire;
      affichagesAnnuaireAChanger.forEach(
        (item) => (item.actif = item.type === action.typeAffichageAnnuaire)
      );

      return {
        ...etat,
        affichagesAnnuaire: affichagesAnnuaireAChanger,
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

export const cocheConsentementAnnuaire = (): ActionProfil => {
  return {
    type: TypeActionProfil.COCHE_CONSENTEMENT_ANNUAIRE,
  };
};

export const cocheTypeAffichageAnnuaire = (
  typeAffichageAnnuaire: TypeAffichage
): ActionProfil => {
  return {
    type: TypeActionProfil.COCHE_TYPE_AFFICHAGE_ANNUAIRE,
    typeAffichageAnnuaire,
  };
};
