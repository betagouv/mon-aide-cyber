import { program } from 'commander';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import {
  DTO,
  EntrepotEcriturePostgres,
} from '../../../infrastructure/entrepots/postgres/EntrepotPostgres';
import { Aggregat } from '../../../domaine/Aggregat';
import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';

type CompteUtilisateur = Aggregat & {
  nomPrenom: string;
  email: string;
};

type CompteUtilisateurDTO = DTO & {
  nom_prenom: string;
  email: string;
};

class EntrepotCompteUtilisateur extends EntrepotEcriturePostgres<
  CompteUtilisateur,
  CompteUtilisateurDTO
> {
  constructor(private readonly serviceChiffrement: ServiceDeChiffrement) {
    super();
  }

  async tous(): Promise<CompteUtilisateur[]> {
    return this.knex
      .raw(
        `
            SELECT id, donnees ->> 'nomPrenom' as nom_prenom, donnees ->> 'identifiantConnexion' as email
            FROM utilisateurs
        `
      )
      .then(({ rows }: { rows: CompteUtilisateurDTO[] }) => {
        return rows;
      })
      .then((dtos) => {
        return dtos.map((dto) => this.deDTOAEntite(dto));
      });
  }

  protected champsAMettreAJour(_entiteDTO: DTO): Partial<DTO> {
    throw new Error('Method not implemented.');
  }

  protected nomTable(): string {
    return 'utilisateurs';
  }

  protected deEntiteADTO(_entite: Aggregat): CompteUtilisateurDTO {
    throw new Error('Method not implemented.');
  }

  protected deDTOAEntite(dto: CompteUtilisateurDTO): CompteUtilisateur {
    try {
      const email = this.serviceChiffrement.dechiffre(dto.email);
      const nomPrenom = this.serviceChiffrement.dechiffre(dto.nom_prenom);
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

program
  .description('Recherche les comptes utilisateurs')
  .option('-n, --nom <nom>', 'le nom ou partie du nom recherché')
  .option('-m, --mail <mail>', 'le mail ou partie du mail recherché')
  .action(async (options) => {
    console.log('Recherche des aidants en cours');
    const utilisateurs = await new EntrepotCompteUtilisateur(
      adaptateurServiceChiffrement()
    ).tous();

    const utilisateursTrouves = utilisateurs.filter((utilisateur) => {
      if (options.nom) {
        return utilisateur.nomPrenom
          .toLowerCase()
          .trim()
          .includes(options.nom.toLowerCase().trim());
      }
      if (options.mail) {
        return utilisateur.email
          .toLowerCase()
          .trim()
          .includes(options.mail.toLowerCase().trim());
      }
      return true;
    });
    console.log(
      `Il y a %s utilisateur(s) et %s trouvé(s)`,
      utilisateurs.length,
      utilisateursTrouves.length
    );
    console.log(JSON.stringify(utilisateursTrouves, undefined, 2));
    process.exit(0);
  });

program.parse();
