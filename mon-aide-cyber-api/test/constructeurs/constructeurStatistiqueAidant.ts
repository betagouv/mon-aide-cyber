import { Constructeur } from './constructeur';
import { StatistiquesAidant } from '../../src/statistiques/aidant/StastistiquesAidant';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import crypto, { UUID } from 'crypto';
import { EntrepotStatistiquesAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { EntrepotRelation } from '../../src/relation/EntrepotRelation';
import { unTupleAidantInitieDiagnostic } from '../../src/diagnostic/tuples';
import { gironde } from '../../src/gestion-demandes/departements';

export class ConstructeurStatistiqueAidant
  implements Constructeur<Promise<StatistiquesAidant>>
{
  private nombreDeDiagnostics = 0;
  private nomPrenom: string = fakerFR.person.fullName();
  private email: string = fakerFR.internet.email();
  private compteCree: Date = FournisseurHorloge.maintenant();
  private identifiant: crypto.UUID = crypto.randomUUID();
  private entite: string = fakerFR.company.name();

  constructor(
    private readonly entrepotAidant: EntrepotStatistiquesAidantMemoire,
    private readonly entrepotRelation: EntrepotRelation
  ) {}

  ayantFaitNDiagnostics(
    nombreDeDiagnostics: number
  ): ConstructeurStatistiqueAidant {
    this.nombreDeDiagnostics = nombreDeDiagnostics;
    return this;
  }

  avecUnNomPrenom(nomPrenom: string): ConstructeurStatistiqueAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  avecUnEmail(email: string): ConstructeurStatistiqueAidant {
    this.email = email;
    return this;
  }

  avecUnId(identifiant: UUID): ConstructeurStatistiqueAidant {
    this.identifiant = identifiant;
    return this;
  }

  async construis(): Promise<StatistiquesAidant> {
    const aidant: StatistiquesAidant = {
      email: this.email,
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
      compteCree: this.compteCree,
      entite: this.entite,
      departements: [gironde],
    };
    await this.entrepotAidant.persiste(aidant);
    for (let i = 0; i < this.nombreDeDiagnostics; i++) {
      await this.entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
      );
    }
    return aidant;
  }
}

export const uneStatistiqueAidant = (
  entrepotAidant: EntrepotStatistiquesAidantMemoire,
  entrepotRelation: EntrepotRelation
) => new ConstructeurStatistiqueAidant(entrepotAidant, entrepotRelation);
