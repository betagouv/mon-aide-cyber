import { AidantAnnuaire } from '../../AidantAnnuaire.ts';

export type EtatReducteurPagination = {
  readonly aidantsInitiaux: AidantAnnuaire[];
  aidantsCourants: AidantAnnuaire[];
  page: number;
  pageSuivante?: number;
  pagePrecedente?: number;
  nombreDePages: number;
};

enum TypeActionPagination {
  AIDANTS_CHARGE = 'AIDANTS_CHARGE',
  PAGE_SUIVANTE = 'PAGE_SUIVANTE',
  PAGE_PRECEDENTE = 'PAGE_PRECEDENTE',
}

type ActionPagination =
  | {
      type: TypeActionPagination.AIDANTS_CHARGE;
      aidants: AidantAnnuaire[];
    }
  | { type: TypeActionPagination.PAGE_SUIVANTE }
  | { type: TypeActionPagination.PAGE_PRECEDENTE };

const TAILLE_PARTITION = 12;

export const reducteurPagination = (
  etat: EtatReducteurPagination,
  action: ActionPagination
): EtatReducteurPagination => {
  switch (action.type) {
    case TypeActionPagination.PAGE_PRECEDENTE: {
      const page = etat.page - 1;
      const etatCourant = { ...etat };
      delete etatCourant['pagePrecedente'];
      return {
        ...etatCourant,
        aidantsCourants: etat.aidantsInitiaux.slice(
          (page - 1) * TAILLE_PARTITION,
          page * TAILLE_PARTITION
        ),
        ...(page > 1 && { pagePrecedente: page - 1 }),
        pageSuivante: page + 1,
        page,
      };
    }
    case TypeActionPagination.PAGE_SUIVANTE: {
      const page = etat.page + 1;
      const etatCourant = { ...etat };
      delete etatCourant['pageSuivante'];
      return {
        ...etatCourant,
        aidantsCourants: etat.aidantsInitiaux.slice(
          etat.page * TAILLE_PARTITION,
          page * TAILLE_PARTITION
        ),
        pagePrecedente: page - 1,
        ...(page < etat.nombreDePages && { pageSuivante: page + 1 }),
        page,
      };
    }
    case TypeActionPagination.AIDANTS_CHARGE: {
      const nombreDePages = Math.ceil(action.aidants.length / TAILLE_PARTITION);
      return {
        ...etat,
        aidantsInitiaux: action.aidants,
        aidantsCourants: action.aidants.slice(0, TAILLE_PARTITION),
        page: 1,
        ...(nombreDePages > 1 && { pageSuivante: 2 }),
        nombreDePages,
      };
    }
  }
};

export const chargeAidants = (aidants: AidantAnnuaire[]): ActionPagination => ({
  type: TypeActionPagination.AIDANTS_CHARGE,
  aidants,
});

export const accedePageSuivante = (): ActionPagination => ({
  type: TypeActionPagination.PAGE_SUIVANTE,
});

export const accedePagePrecedente = (): ActionPagination => ({
  type: TypeActionPagination.PAGE_PRECEDENTE,
});

export const initialiseEtatPagination = (): EtatReducteurPagination => ({
  aidantsInitiaux: [],
  aidantsCourants: [],
  nombreDePages: 0,
  page: 0,
});
