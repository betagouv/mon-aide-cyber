import { Constructeur } from '../../../constructeurs/constructeur';
import { Aidant } from '../../../../src/administration/aidants/aidants-selon-nombre-diagnostics/Types';
import { EntrepotRelation } from '../../../../src/relation/EntrepotRelation';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { EntrepotAidantMemoire } from './extractionAidantSelonNombreDiagnostics.spec';
import { unTupleAidantInitieDiagnostic } from '../../../../src/diagnostic/tuples';
import crypto, { UUID } from 'crypto';

export class ConstructeurAidant implements Constructeur<Promise<Aidant>> {
  private nombreDeDiagnostics = 0;
  private nomPrenom: string = fakerFR.person.fullName();
  private email: string = fakerFR.internet.email();
  private compteCree: Date = FournisseurHorloge.maintenant();
  private identifiant: crypto.UUID = crypto.randomUUID();

  constructor(
    private readonly entrepotAidant: EntrepotAidantMemoire,
    private readonly entrepotRelation: EntrepotRelation
  ) {}

  ayantFaitNDiagnostics(nombreDeDiagnostics: number): ConstructeurAidant {
    this.nombreDeDiagnostics = nombreDeDiagnostics;
    return this;
  }

  avecUnNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  avecUnEmail(email: string): ConstructeurAidant {
    this.email = email;
    return this;
  }

  async construis(): Promise<Aidant> {
    const aidant = {
      email: this.email,
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
      compteCree: this.compteCree,
    };
    await this.entrepotAidant.persiste(aidant);
    for (let i = 0; i < this.nombreDeDiagnostics; i++) {
      await this.entrepotRelation.persiste(
        unTupleAidantInitieDiagnostic(aidant.identifiant, crypto.randomUUID())
      );
    }
    return aidant;
  }

  avecUnId(identifiant: UUID): ConstructeurAidant {
    this.identifiant = identifiant;
    return this;
  }
}

export const unAidant = (
  entrepotAidant: EntrepotAidantMemoire,
  entrepotRelation: EntrepotRelation
) => new ConstructeurAidant(entrepotAidant, entrepotRelation);
