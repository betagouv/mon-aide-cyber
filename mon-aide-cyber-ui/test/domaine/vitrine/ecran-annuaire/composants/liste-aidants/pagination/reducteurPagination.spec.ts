import { describe, expect, it } from 'vitest';
import { fakerFR } from '@faker-js/faker';
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
} from '../../../../../../../src/domaine/vitrine/ecran-annuaire/composants/liste-aidants/pagination/reducteurPagination.ts';
import { Constructeur } from '../../../../../../constructeurs/Constructeur.ts';
import { AidantAnnuaire } from '../../../../../../../src/domaine/vitrine/ecran-annuaire/AidantAnnuaire.ts';
import { UUID } from '../../../../../../../src/types/Types.ts';

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
      indexation: [{ indexPage: 1, pageCourante: true }],
    });
  });

  it('Charge les Aidants filtrés', () => {
    const aidants = unAnnuaireAidants().auNombreDe(48).construis();
    const aidantsFiltres = aidants.slice(12, 42);

    const etat = reducteurPagination(
      {
        ...etatPaginationInitiale,
        aidantsInitiaux: aidants,
        aidantsCourants: aidants.slice(12, 24),
        nombreDePages: 4,
        indexation: [
          { indexPage: 1 },
          { indexPage: 2, pageCourante: true },
          { indexPage: 3 },
          { indexPage: 4 },
        ],
        page: 2,
        taillePagination: 12,
        pagePrecedente: 1,
      },
      chargeAidants(aidantsFiltres)
    );

    expect(etat).toStrictEqual<EtatReducteurPagination>({
      aidantsInitiaux: aidantsFiltres,
      aidantsCourants: aidantsFiltres.slice(0, 12),
      page: 1,
      nombreDePages: 3,
      pageSuivante: 2,
      taillePagination: 12,
      indexation: [
        { indexPage: 1, pageCourante: true },
        { indexPage: 2 },
        { indexPage: 3 },
      ],
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
      indexation: [{ indexPage: 1, pageCourante: true }, { indexPage: 2 }],
    });
  });

  describe('Crée les pages d’indexation', () => {
    it('Pour un nombre de pages supérieures à 6', () => {
      const aidants = unAnnuaireAidants().auNombreDe(74).construis();

      const etat = reducteurPagination(
        etatPaginationInitiale,
        chargeAidants(aidants)
      );

      expect(etat.indexation).toStrictEqual([
        { indexPage: 1, pageCourante: true },
        { indexPage: 2 },
        { indexPage: 3 },
        { indexPage: 4, pageIntermediaire: true },
        { indexPage: 5 },
        { indexPage: 6 },
        { indexPage: 7 },
      ]);
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
          indexation: [{ indexPage: 1, pageCourante: true }, { indexPage: 2 }],
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
        indexation: [{ indexPage: 1 }, { indexPage: 2, pageCourante: true }],
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
          indexation: [
            { indexPage: 1, pageCourante: true },
            { indexPage: 2 },
            { indexPage: 3 },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2, pageCourante: true },
          { indexPage: 3 },
        ],
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2, pageCourante: true },
            { indexPage: 3 },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3, pageCourante: true },
        ],
      });
    });

    describe('Lorsqu’il y a plus de 6 pages', () => {
      it('On passe d’une page intermédiaire à une autre page intermédiaire', () => {
        const aidants = unAnnuaireAidants().auNombreDe(96).construis();

        const etat = reducteurPagination(
          {
            ...etatPaginationInitiale,
            aidantsInitiaux: aidants,
            page: 4,
            nombreDePages: 8,
            pagePrecedente: 3,
            pageSuivante: 5,
            indexation: [
              { indexPage: 1 },
              { indexPage: 2 },
              { indexPage: 3 },
              { indexPage: 4, pageCourante: true, pageIntermediaire: true },
              { indexPage: 6 },
              { indexPage: 7 },
              { indexPage: 8 },
            ],
          },
          accedePageSuivante()
        );

        expect(etat.indexation).toStrictEqual([
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 5, pageCourante: true, pageIntermediaire: true },
          { indexPage: 6 },
          { indexPage: 7 },
          { indexPage: 8 },
        ]);
      });

      it('On passe d’une page intermédiaire à une page indexée', () => {
        const aidants = unAnnuaireAidants().auNombreDe(96).construis();

        const etat = reducteurPagination(
          {
            ...etatPaginationInitiale,
            aidantsInitiaux: aidants,
            page: 5,
            nombreDePages: 8,
            pagePrecedente: 4,
            pageSuivante: 6,
            indexation: [
              { indexPage: 1 },
              { indexPage: 2 },
              { indexPage: 3 },
              { indexPage: 5, pageCourante: true, pageIntermediaire: true },
              { indexPage: 6 },
              { indexPage: 7 },
              { indexPage: 8 },
            ],
          },
          accedePageSuivante()
        );

        expect(etat.indexation).toStrictEqual([
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 5, pageIntermediaire: true },
          { indexPage: 6, pageCourante: true },
          { indexPage: 7 },
          { indexPage: 8 },
        ]);
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2 },
            { indexPage: 3, pageCourante: true },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2, pageCourante: true },
          { indexPage: 3 },
        ],
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2, pageCourante: true },
            { indexPage: 3 },
          ],
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
        indexation: [
          { indexPage: 1, pageCourante: true },
          { indexPage: 2 },
          { indexPage: 3 },
        ],
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2 },
            { indexPage: 3 },
            { indexPage: 4, pageCourante: true },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3, pageCourante: true },
          { indexPage: 4 },
        ],
      });
    });

    describe('Lorsqu’il y a plus de 6 pages', () => {
      it('On passe d’une page intermédiaire à une autre page intermédiaire', () => {
        const aidants = unAnnuaireAidants().auNombreDe(96).construis();

        const etat = reducteurPagination(
          {
            ...etatPaginationInitiale,
            aidantsInitiaux: aidants,
            page: 5,
            nombreDePages: 8,
            pagePrecedente: 3,
            pageSuivante: 5,
            indexation: [
              { indexPage: 1 },
              { indexPage: 2 },
              { indexPage: 3 },
              { indexPage: 5, pageCourante: true, pageIntermediaire: true },
              { indexPage: 6 },
              { indexPage: 7 },
              { indexPage: 8 },
            ],
          },
          accedePagePrecedente()
        );

        expect(etat.indexation).toStrictEqual([
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 4, pageCourante: true, pageIntermediaire: true },
          { indexPage: 6 },
          { indexPage: 7 },
          { indexPage: 8 },
        ]);
      });

      it('On passe d’une page intermédiaire à une page indexée', () => {
        const aidants = unAnnuaireAidants().auNombreDe(96).construis();

        const etat = reducteurPagination(
          {
            ...etatPaginationInitiale,
            aidantsInitiaux: aidants,
            page: 4,
            nombreDePages: 8,
            pagePrecedente: 3,
            pageSuivante: 5,
            indexation: [
              { indexPage: 1 },
              { indexPage: 2 },
              { indexPage: 3 },
              { indexPage: 4, pageCourante: true, pageIntermediaire: true },
              { indexPage: 6 },
              { indexPage: 7 },
              { indexPage: 8 },
            ],
          },
          accedePagePrecedente()
        );

        expect(etat.indexation).toStrictEqual([
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3, pageCourante: true },
          { indexPage: 4, pageIntermediaire: true },
          { indexPage: 6 },
          { indexPage: 7 },
          { indexPage: 8 },
        ]);
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
          indexation: [
            { indexPage: 1, pageCourante: true },
            { indexPage: 2 },
            { indexPage: 3 },
            { indexPage: 4 },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3, pageCourante: true },
          { indexPage: 4 },
        ],
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
          indexation: [
            { indexPage: 1, pageCourante: true },
            { indexPage: 2 },
            { indexPage: 3 },
            { indexPage: 4 },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 4, pageCourante: true },
        ],
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2 },
            { indexPage: 3, pageCourante: true },
            { indexPage: 4 },
          ],
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
        indexation: [
          { indexPage: 1, pageCourante: true },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 4 },
        ],
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2, pageCourante: true },
            { indexPage: 3 },
            { indexPage: 4 },
          ],
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
        indexation: [
          { indexPage: 1 },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 4, pageCourante: true },
        ],
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
          indexation: [
            { indexPage: 1 },
            { indexPage: 2 },
            { indexPage: 3 },
            { indexPage: 4, pageCourante: true },
          ],
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
        indexation: [
          { indexPage: 1, pageCourante: true },
          { indexPage: 2 },
          { indexPage: 3 },
          { indexPage: 4 },
        ],
      });
    });
  });
});
