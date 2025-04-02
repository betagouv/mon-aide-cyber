import { program } from 'commander';
import fs from 'fs';
import {
  DTO,
  EntrepotLecturePostgres,
} from '../../../infrastructure/entrepots/postgres/EntrepotPostgres';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { Aggregat } from '../../../domaine/Aggregat';
import crypto from 'crypto';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

type Aidant = Aggregat & {
  email: string;
  nomPrenom: string;
};

type AidantDTO = DTO & {
  donnees: {
    email: string;
    nomPrenom: string;
  };
};

type Diagnostic = Aggregat & {
  idAidant: crypto.UUID;
};

type DiagnosticDTO = DTO & {
  id_aidant: crypto.UUID;
};

class EntrepotDiagnostic extends EntrepotLecturePostgres<
  Diagnostic,
  DiagnosticDTO
> {
  constructor() {
    super();
  }

  async tous(): Promise<Diagnostic[]> {
    return this.knex
      .raw(
        `
            SELECT donnees -> 'objet' ->> 'identifiant' as id, donnees -> 'utilisateur' ->> 'identifiant' as id_aidant
            FROM relations, (
                SELECT DISTINCT id FROM diagnostics
                WHERE (donnees ->> 'dateCreation'):: timestamp with time zone
                BETWEEN '2025-03-01':: timestamp with time zone AND '2025-04-01':: timestamp with time zone
                AND jsonb_array_length(donnees -> 'restitution' -> 'mesures' -> 'mesuresPrioritaires') = 6) as diags_mars
            WHERE (diags_mars.id)::text = donnees -> 'objet' ->> 'identifiant'
              AND donnees -> 'utilisateur' ->> 'type' = 'aidant'
        `
      )
      .then(({ rows }: { rows: DiagnosticDTO[] }) => {
        return rows;
      })
      .then((dtos) => {
        return dtos.map((dto) => this.deDTOAEntite(dto));
      });
  }

  protected nomTable(): string {
    throw new Error('Method not implemented.');
  }

  protected deDTOAEntite(dto: DiagnosticDTO): Diagnostic {
    return { idAidant: dto.id_aidant, identifiant: dto.id };
  }
}

class EntrepotAidant extends EntrepotLecturePostgres<Aidant, AidantDTO> {
  constructor(private readonly serviceChiffrement: ServiceDeChiffrement) {
    super();
  }

  protected nomTable(): string {
    return 'utilisateurs_mac';
  }

  protected deEntiteADTO(_entite: Aggregat): AidantDTO {
    throw new Error('Method not implemented.');
  }

  protected deDTOAEntite(dto: AidantDTO): Aidant {
    try {
      const email = this.serviceChiffrement.dechiffre(dto.donnees.email);
      const nomPrenom = this.serviceChiffrement.dechiffre(
        dto.donnees.nomPrenom
      );
      return {
        identifiant: dto.id,
        email,
        nomPrenom,
      };
    } catch (erreur) {
      console.log('DTO', dto, erreur);
      return {
        identifiant: dto.id,
        email: 'inconnu',
        nomPrenom: 'inconnu',
      };
    }
  }
}

type Resultat = {
  email: string;
  nomPrenom: string;
  nombreDeDiags: number;
};

const command = program.description('Extrais le challenge de Mars 2025');

command.action(async () => {
  const diagnostics = await new EntrepotDiagnostic().tous();
  const entrepotAidant = new EntrepotAidant(adaptateurServiceChiffrement());

  const nombreDeDiagsParAidant = (dataArray: Diagnostic[]) =>
    dataArray.reduce(
      (acc, item) => {
        acc[item.idAidant] = (acc[item.idAidant] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  const diagsParAidant = nombreDeDiagsParAidant(diagnostics);
  const resultat: Resultat[] = await Promise.all(
    Object.entries(diagsParAidant).map(async ([aidant, nbDiags]) => {
      const aidantRecu = await entrepotAidant.lis(aidant);
      console.log(aidantRecu);
      return {
        email: aidantRecu.email,
        nomPrenom: aidantRecu.nomPrenom,
        nombreDeDiags: nbDiags,
      };
    })
  );

  const rapport: string[] = ['Nom;Email;Nombre de diagnostics;\n'];
  resultat.forEach((result) =>
    rapport.push(
      `${result.nomPrenom};${result.email};${result.nombreDeDiags};\n`
    )
  );

  fs.writeFileSync(`/tmp/rapport-challenge-mars.csv`, rapport.join(''), {
    encoding: 'utf-8',
  });
  process.exit(0);
});

program.parse();
