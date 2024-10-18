import { AidantAnnuaire } from '../../AidantAnnuaire.ts';

export type EtatReducteurPagination = {
  readonly aidantsInitiaux: AidantAnnuaire[];
  readonly taillePagination: number;
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
  PAGE_INDEX = 'PAGE_INDEX',
  DERNIERE_PAGE = 'DERNIERE_PAGE',
  PREMIERE_PAGE = 'PREMIERE_PAGE',
}

type ActionPagination =
  | {
      type: TypeActionPagination.AIDANTS_CHARGE;
      aidants: AidantAnnuaire[];
    }
  | { type: TypeActionPagination.PAGE_SUIVANTE }
  | { type: TypeActionPagination.PAGE_PRECEDENTE }
  | { type: TypeActionPagination.DERNIERE_PAGE }
  | { type: TypeActionPagination.PREMIERE_PAGE }
  | { type: TypeActionPagination.PAGE_INDEX; indexPage: number };

const TAILLE_PARTITION = 18;

export const reducteurPagination = (
  etat: EtatReducteurPagination,
  action: ActionPagination
): EtatReducteurPagination => {
  const retourneLesAidantsCourants = (
    borneInferieure: number,
    borneSuperieure?: number
  ) =>
    etat.aidantsInitiaux.slice(
      borneInferieure * etat.taillePagination,
      borneSuperieure ? borneSuperieure * etat.taillePagination : undefined
    );

  switch (action.type) {
    case TypeActionPagination.PREMIERE_PAGE: {
      const etatCourant = { ...etat };
      delete etatCourant['pagePrecedente'];
      return {
        ...etatCourant,
        aidantsCourants: retourneLesAidantsCourants(0, 1),
        page: 1,
        pageSuivante: 2,
      };
    }
    case TypeActionPagination.DERNIERE_PAGE: {
      const etatCourant = { ...etat };
      delete etatCourant['pageSuivante'];
      return {
        ...etatCourant,
        aidantsCourants: retourneLesAidantsCourants(etat.nombreDePages - 1),
        page: etat.nombreDePages,
        pagePrecedente: etat.nombreDePages - 1,
      };
    }
    case TypeActionPagination.PAGE_INDEX: {
      const etatCourant = { ...etat };
      delete etatCourant['pagePrecedente'];
      delete etatCourant['pageSuivante'];
      return {
        ...etatCourant,
        aidantsCourants: retourneLesAidantsCourants(
          action.indexPage - 1,
          action.indexPage
        ),
        page: action.indexPage,
        ...(action.indexPage > 1 && { pagePrecedente: action.indexPage - 1 }),
        ...(action.indexPage < etat.nombreDePages && {
          pageSuivante: action.indexPage + 1,
        }),
      };
    }
    case TypeActionPagination.PAGE_PRECEDENTE: {
      const page = etat.page - 1;
      const etatCourant = { ...etat };
      delete etatCourant['pagePrecedente'];
      return {
        ...etatCourant,
        aidantsCourants: retourneLesAidantsCourants(page - 1, page),
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
        aidantsCourants: retourneLesAidantsCourants(etat.page, page),
        pagePrecedente: page - 1,
        ...(page < etat.nombreDePages && { pageSuivante: page + 1 }),
        page,
      };
    }
    case TypeActionPagination.AIDANTS_CHARGE: {
      const nombreDePages = Math.ceil(
        action.aidants.length / etat.taillePagination
      );
      return {
        ...etat,
        aidantsInitiaux: action.aidants,
        aidantsCourants: action.aidants.slice(0, etat.taillePagination),
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

export const accedeALaPage = (indexPage: number): ActionPagination => ({
  type: TypeActionPagination.PAGE_INDEX,
  indexPage,
});

export const accedeALaDernierePage = (): ActionPagination => ({
  type: TypeActionPagination.DERNIERE_PAGE,
});

export const accedeALaPremierePage = (): ActionPagination => ({
  type: TypeActionPagination.PREMIERE_PAGE,
});

export const initialiseEtatPagination = (): EtatReducteurPagination => ({
  aidantsInitiaux: [],
  aidantsCourants: [],
  nombreDePages: 0,
  page: 0,
  taillePagination: TAILLE_PARTITION,
});
