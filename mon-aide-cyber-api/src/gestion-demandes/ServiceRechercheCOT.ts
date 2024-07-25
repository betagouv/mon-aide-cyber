import { listeDepartements } from '../infrastructure/departements/listeDepartements/listeDepartements';
import { annuaireCOT } from '../infrastructure/annuaireCOT/AnnuaireCOT';

export class ServiceRechercheCOT {
  chercheMailParDepartement(nomDepartement: string): string | undefined {
    const codeRegionDepartement = listeDepartements.find(
      ({ nom }) => nom === nomDepartement
    )?.codeRegion;

    return codeRegionDepartement
      ? annuaireCOT.find(({ codesRegions: codesRegionsCOT }) =>
          codesRegionsCOT.includes(codeRegionDepartement)
        )?.mail
      : undefined;
  }
}
