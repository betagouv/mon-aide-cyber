import { describe, expect, it } from 'vitest';
import { fakerFR } from '@faker-js/faker';
import { Constructeur } from '../../../../../constructeurs/Constructeur.ts';
import { AidantAnnuaire } from '../../../../../../src/domaine/vitrine/ecran-annuaire/AidantAnnuaire.ts';
import { UUID } from '../../../../../../src/types/Types.ts';
import {
  accedeALaDernierePage,
  accedeALaPage,
  accedeALaPremierePage,
  accedePagePrecedente,
  accedePageSuivante,
  chargeAidants,
  EtatReducteurPagination,
  initialiseEtatPagination,
  reducteurPagination,
} from '../../../../../../src/domaine/vitrine/ecran-annuaire/composants/liste-aidants/reducteurPagination.ts';

class ConstructeurAnnuaireAidants implements Constructeur<AidantAnnuaire[]> {
  private nombreAidants: number = fakerFR.number.int();

  auNombreDe(nombreAidants: number) {
    this.nombreAidants = nombreAidants;
    return this;
  }
  construis(): AidantAnnuaire[] {
    const aidants: AidantAnnuaire[] = [];
    for (let i = 0; i < this.nombreAidants; i++) {
      aidants.push({
        identifiant: fakerFR.string.uuid() as UUID,
        nomPrenom: fakerFR.person.fullName(),
      });
    }
    return aidants;
  }
}

const unAnnuaireAidants = () => new ConstructeurAnnuaireAidants();
describe('Réducteur pagination', () => {
  const etatPaginationInitiale = {
    ...initialiseEtatPagination(),
    taillePagination: 12,
  };

  it('Charge les Aidants', () => {
    const aidants = unAnnuaireAidants().auNombreDe(8).construis();

    const etat = reducteurPagination(
      etatPaginationInitiale,
      chargeAidants(aidants)
    );

    expect(etat).toStrictEqual<EtatReducteurPagination>({
      aidantsInitiaux: aidants,
      aidantsCourants: aidants,
      page: 1,
      nombreDePages: 1,
      taillePagination: 12,
    });
  });

  it('Pagine sur 2 pages les Aidants', () => {
    const aidants = unAnnuaireAidants().auNombreDe(14).construis();

    const etat = reducteurPagination(
      etatPaginationInitiale,
      chargeAidants(aidants)
    );

    expect(etat).toStrictEqual<EtatReducteurPagination>({
      aidantsInitiaux: aidants,
      aidantsCourants: aidants.slice(0, 12),
      page: 1,
      nombreDePages: 2,
      pageSuivante: 2,
      taillePagination: 12,
    });
  });

  describe('Pour aller à la page suivante', () => {
    it('Accède à la seconde page sur 2 pages', () => {
      const aidants = unAnnuaireAidants().auNombreDe(14).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 1,
          nombreDePages: 2,
          pageSuivante: 2,
        },
        accedePageSuivante()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(12),
        page: 2,
        nombreDePages: 2,
        pagePrecedente: 1,
        taillePagination: 12,
      });
    });

    it('Accède à la seconde page sur 3 pages', () => {
      const aidants = unAnnuaireAidants().auNombreDe(26).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 1,
          nombreDePages: 3,
          pageSuivante: 2,
        },
        accedePageSuivante()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(12, 24),
        page: 2,
        nombreDePages: 3,
        pageSuivante: 3,
        pagePrecedente: 1,
        taillePagination: 12,
      });
    });

    it('Accède à la troisième page sur 3 pages', () => {
      const aidants = unAnnuaireAidants().auNombreDe(26).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 2,
          nombreDePages: 3,
          pageSuivante: 3,
        },
        accedePageSuivante()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(24),
        page: 3,
        nombreDePages: 3,
        pagePrecedente: 2,
        taillePagination: 12,
      });
    });
  });

  describe('Pour aller à la page précédente', () => {
    it('Retourne à la page 2 de 3', () => {
      const aidants = unAnnuaireAidants().auNombreDe(26).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 3,
          nombreDePages: 3,
          pagePrecedente: 2,
        },
        accedePagePrecedente()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(12, 24),
        page: 2,
        nombreDePages: 3,
        pagePrecedente: 1,
        pageSuivante: 3,
        taillePagination: 12,
      });
    });

    it('Retourne à la page 1 de 3', () => {
      const aidants = unAnnuaireAidants().auNombreDe(26).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 2,
          nombreDePages: 3,
          pagePrecedente: 1,
          pageSuivante: 3,
        },
        accedePagePrecedente()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(0, 12),
        page: 1,
        nombreDePages: 3,
        pageSuivante: 2,
        taillePagination: 12,
      });
    });

    it('Retourne à la page 3 de 4', () => {
      const aidants = unAnnuaireAidants().auNombreDe(46).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 4,
          nombreDePages: 4,
          pagePrecedente: 3,
        },
        accedePagePrecedente()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(24, 36),
        page: 3,
        nombreDePages: 4,
        pageSuivante: 4,
        pagePrecedente: 2,
        taillePagination: 12,
      });
    });
  });

  describe('Pour aller à l’index désiré', () => {
    it('Accède directement à la page 3', () => {
      const aidants = unAnnuaireAidants().auNombreDe(46).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 1,
          nombreDePages: 4,
        },
        accedeALaPage(3)
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(24, 36),
        page: 3,
        nombreDePages: 4,
        pageSuivante: 4,
        pagePrecedente: 2,
        taillePagination: 12,
      });
    });

    it('Accède directement à la page 4', () => {
      const aidants = unAnnuaireAidants().auNombreDe(46).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 1,
          nombreDePages: 4,
          pageSuivante: 2,
        },
        accedeALaPage(4)
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(36),
        page: 4,
        nombreDePages: 4,
        pagePrecedente: 3,
        taillePagination: 12,
      });
    });

    it('Accède directement à la page 1', () => {
      const aidants = unAnnuaireAidants().auNombreDe(46).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 3,
          nombreDePages: 4,
          pagePrecedente: 2,
          pageSuivante: 4,
        },
        accedeALaPage(1)
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(0, 12),
        page: 1,
        nombreDePages: 4,
        pageSuivante: 2,
        taillePagination: 12,
      });
    });
  });

  describe('Pour aller directement à la première ou dernière page', () => {
    it('Accède directement à la dernière page', () => {
      const aidants = unAnnuaireAidants().auNombreDe(46).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 2,
          nombreDePages: 4,
          pagePrecedente: 1,
          pageSuivante: 3,
        },
        accedeALaDernierePage()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(36),
        page: 4,
        nombreDePages: 4,
        pagePrecedente: 3,
        taillePagination: 12,
      });
    });

    it('Accède directement à la première page', () => {
      const aidants = unAnnuaireAidants().auNombreDe(46).construis();

      const etat = reducteurPagination(
        {
          ...etatPaginationInitiale,
          aidantsInitiaux: aidants,
          page: 4,
          nombreDePages: 4,
          pagePrecedente: 3,
        },
        accedeALaPremierePage()
      );

      expect(etat).toStrictEqual<EtatReducteurPagination>({
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(0, 12),
        page: 1,
        nombreDePages: 4,
        pageSuivante: 2,
        taillePagination: 12,
      });
    });
  });
});
