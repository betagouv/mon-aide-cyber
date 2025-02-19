import { EntrepotUtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { EntrepotRelation } from '../../src/relation/EntrepotRelation';
import { fakerFR } from '@faker-js/faker';
import { Constructeur } from './constructeur';
import { StatistiquesUtilisateurInscrit } from '../../src/statistiques/utilisateur-inscrit/StatistiquesUtilisateurInscrit';
import { unTupleAidantInitieDiagnostic } from '../../src/diagnostic/tuples';
import crypto from 'crypto';

class ConstructeurStatistiqueUtilisateurInscrit
  implements Constructeur<Promise<StatistiquesUtilisateurInscrit>>
{
  private identifiant: crypto.UUID = crypto.randomUUID();
  private nombreDeDiagnostics = 0;
  private nomPrenom: string = fakerFR.person.fullName();
  private email: string = fakerFR.internet.email();

  constructor(
    private readonly entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
    private readonly entrepotRelation: EntrepotRelation
  ) {}

  ayantFaitNDiagnostics(
    nombreDeDiagnostics: number
  ): ConstructeurStatistiqueUtilisateurInscrit {
    this.nombreDeDiagnostics = nombreDeDiagnostics;
    return this;
  }

  async construis(): Promise<StatistiquesUtilisateurInscrit> {
    const utilisateurInscrit: StatistiquesUtilisateurInscrit = {
      email: this.email,
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
      nombreDiagnostics: 0,
    };
    await this.entrepotUtilisateurInscrit.persiste(utilisateurInscrit);
    for (let i = 0; i < this.nombreDeDiagnostics; i++) {
      await this.entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(
          utilisateurInscrit.identifiant,
          crypto.randomUUID()
        )
      );
    }
    return utilisateurInscrit;
  }
}

export const uneStatistiqueUtilisateurInscrit = (
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
  entrepotRelation: EntrepotRelation
) =>
  new ConstructeurStatistiqueUtilisateurInscrit(
    entrepotUtilisateurInscrit,
    entrepotRelation
  );
