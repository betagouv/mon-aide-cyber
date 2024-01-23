import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { Restitution } from '../../../restitution/Restitution';
import { AggregatNonTrouve } from '../../../domaine/Aggregat';
import {
  QuestionDiagnostic,
  ReponseDonnee,
  ReponsesMultiples,
} from '../../../diagnostic/Diagnostic';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';
import { Valeur } from '../../../diagnostic/Indice';

class EntrepotRestitutionPostgres extends EntrepotPostgres<
  Restitution,
  RestitutionDTO
> {
  constructor(
    private readonly transcripteur: (
      dto: RestitutionDTO,
    ) => MappeurRestitutionDTO = (dto) => mappeurRestitution(dto),
  ) {
    super();
  }

  lis(identifiant: string): Promise<Restitution> {
    return this.knex
      .raw(
        `
            SELECT id,
                   donnees ->> 'dateCreation'                                                                                           AS dateCreation,
                   donnees ->> 'dateDerniereModification'                                                                               AS dateDerniereModification,
                   donnees -> 'restitution'                                                                                             AS restitution,
                   jsonb_path_query_first(donnees,
                                    '$.referentiel.contexte.questions[*] \\? (@.identifiant=="contexte-region-siege-social")')          as region,
                   jsonb_path_query_first(donnees,
                                    '$.referentiel.contexte.questions[*] \\? (@.identifiant=="contexte-departement-tom-siege-social")') as departement,
                   jsonb_path_query_first(donnees,
                                    '$.referentiel.contexte.questions[*] \\? (@.identifiant=="contexte-secteur-activite")')             as secteurActivite
            FROM diagnostics
            WHERE id = ?`,
        [identifiant],
      )
      .then(({ rows }: { rows: RestitutionDTO[] }) => {
        return rows[0] !== undefined
          ? this.deDTOAEntite(rows[0])
          : Promise.reject(new AggregatNonTrouve(this.typeAggregat()));
      });
  }

  typeAggregat(): string {
    return 'restitution';
  }

  protected champsAMettreAJour(_: RestitutionDTO): Partial<RestitutionDTO> {
    throw new Error('non implémenté');
  }

  protected deDTOAEntite(dto: RestitutionDTO): Restitution {
    const { zoneGeographique, secteurActivite } = this.transcripteur(dto);
    const restitutionDTO = dto.restitution;
    return {
      identifiant: dto.id,
      informations: {
        dateCreation: FournisseurHorloge.enDate(dto.datecreation),
        dateDerniereModification: FournisseurHorloge.enDate(
          dto.datedernieremodification,
        ),
        zoneGeographique,
        secteurActivite,
      },
      indicateurs: restitutionDTO !== null ? restitutionDTO.indicateurs : {},
      mesures: {
        mesuresPrioritaires:
          restitutionDTO !== null
            ? restitutionDTO.mesures.mesuresPrioritaires
            : [],
        autresMesures:
          restitutionDTO !== null ? restitutionDTO.mesures.autresMesures : [],
      },
    };
  }
  protected deEntiteADTO(_: Restitution): RestitutionDTO {
    throw new Error('');
  }

  protected nomTable(): string {
    return 'diagnostics';
  }
}

type RepresentationReponsesMultiples = Omit<ReponsesMultiples, 'reponses'> & {
  reponses: string[];
};

type ReponseDonneeDTO = Omit<ReponseDonnee, 'reponsesMultiples'> & {
  reponsesMultiples: RepresentationReponsesMultiples[];
};

type RepresentationQuestionDiagnostic = Omit<
  QuestionDiagnostic,
  'reponseDonnee'
> & {
  reponseDonnee: ReponseDonneeDTO;
};

type RepresentationIndicateurs = {
  [thematique: string]: { moyennePonderee: number };
};

export type RepresentationMesure = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};

export type RepresentationMesures = {
  mesuresPrioritaires: RepresentationMesure[];
  autresMesures: RepresentationMesure[];
};

type RestitutionDTO = DTO & {
  datecreation: string;
  datedernieremodification: string;
  region: RepresentationQuestionDiagnostic;
  departement: RepresentationQuestionDiagnostic;
  secteuractivite: RepresentationQuestionDiagnostic;
  restitution: {
    indicateurs: RepresentationIndicateurs;
    mesures: RepresentationMesures;
  };
};

type MappeurRestitutionDTO = {
  zoneGeographique: string;
  secteurActivite: string;
};

const mappeurRestitution = (dto: RestitutionDTO): MappeurRestitutionDTO => {
  const representeZoneGeographique = (
    questionRegion: RepresentationQuestionDiagnostic,
    questionDepartement: RepresentationQuestionDiagnostic,
  ) => {
    const region = trouveLibelleReponseUniqueDonnee(questionRegion);
    const departement = trouveLibelleReponseUniqueDonnee(questionDepartement);
    return ''
      .concat(!departement && !region ? 'non renseigné' : '')
      .concat(departement || '')
      .concat(departement && region ? ', '.concat(region || '') : region || '');
  };

  const trouveLibelleReponseUniqueDonnee = (
    question: RepresentationQuestionDiagnostic,
  ) =>
    question?.reponsesPossibles.find(
      (reponse) => reponse.identifiant === question.reponseDonnee.reponseUnique,
    )?.libelle;

  return {
    secteurActivite:
      trouveLibelleReponseUniqueDonnee(dto.secteuractivite) || 'non renseigné',
    zoneGeographique: representeZoneGeographique(dto.region, dto.departement),
  };
};

export { mappeurRestitution, EntrepotRestitutionPostgres };
