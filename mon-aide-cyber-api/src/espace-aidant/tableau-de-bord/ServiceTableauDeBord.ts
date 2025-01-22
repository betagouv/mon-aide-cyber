import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import crypto, { UUID } from 'crypto';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { isAfter } from 'date-fns';
import {
  constructeurActionsHATEOAS,
  ReponseHATEOAS,
} from '../../api/hateoas/hateoas';
import {
  ProfilUtilisateurMAC,
  RechercheUtilisateursMAC,
} from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

export type Diagnostic = {
  dateCreation: string;
  identifiant: string;
  secteurActivite: string | 'non renseigné';
  secteurGeographique: string | 'non renseigné';
};

type TableauDeBord = {
  diagnostics: Diagnostic[];
  liens: ReponseHATEOAS;
};

export class ServiceTableauDeBord {
  private readonly profilsAidants: ProfilUtilisateurMAC[] = [
    'Aidant',
    'Gendarme',
  ];

  constructor(
    private readonly adaptateurRelation: AdaptateurRelations,
    private readonly serviceDiagnostic: ServiceDiagnostic,
    private readonly rechercheUtilisateurMAC: RechercheUtilisateursMAC,
    private readonly estProConnect: boolean
  ) {}

  async pour(identifiantUtilisateur: crypto.UUID): Promise<TableauDeBord> {
    const identifiantDiagnosticsLie =
      await this.adaptateurRelation.identifiantsObjetsLiesAUtilisateur(
        identifiantUtilisateur
      );

    const liensPourUtilisateur = async (
      diagnostics: Diagnostic[]
    ): Promise<ReponseHATEOAS> => {
      const utilisateur =
        await this.rechercheUtilisateurMAC.rechercheParIdentifiant(
          identifiantUtilisateur
        );
      if (utilisateur && this.profilsAidants.includes(utilisateur?.profil)) {
        return constructeurActionsHATEOAS()
          .pour({
            contexte: 'aidant:acceder-au-tableau-de-bord',
          })
          .pour({
            contexte: this.estProConnect
              ? 'se-deconnecter-avec-pro-connect'
              : 'se-deconnecter',
          })
          .afficherLesDiagnostics(diagnostics.map((d) => d.identifiant))
          .construis();
      }
      return constructeurActionsHATEOAS()
        .pour({
          contexte: 'utilisateur-inscrit:acceder-au-tableau-de-bord',
        })
        .pour({
          contexte: this.estProConnect
            ? 'se-deconnecter-avec-pro-connect'
            : 'se-deconnecter',
        })
        .afficherLesDiagnostics(diagnostics.map((d) => d.identifiant))
        .construis();
    };

    return this.recupereLesDiagnostics(identifiantDiagnosticsLie).then(
      (diagnostics) => {
        return liensPourUtilisateur(diagnostics).then((liens) => ({
          diagnostics,
          liens,
        }));
      }
    );
  }

  private recupereLesDiagnostics(
    identifiantDiagnosticsLie: string[]
  ): Promise<Diagnostic[]> {
    return this.serviceDiagnostic
      .contextes(identifiantDiagnosticsLie as UUID[])
      .then((diagnostics) => {
        const resultat: Diagnostic[] = [];
        const tousLesDiagnostics = Object.entries(diagnostics);
        tousLesDiagnostics.sort(([, contexte1], [, contexte2]) =>
          isAfter(contexte1.dateCreation, contexte2.dateCreation) ? -1 : 1
        );
        for (const [id, contexte] of tousLesDiagnostics) {
          resultat.push({
            dateCreation: FournisseurHorloge.formateDate(contexte.dateCreation)
              .date,
            identifiant: id,
            secteurActivite: contexte.secteurActivite || 'non renseigné',
            secteurGeographique: contexte.departement || 'non renseigné',
          } as Diagnostic);
        }
        return resultat;
      });
  }
}
