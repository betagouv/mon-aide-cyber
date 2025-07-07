import {
  AdaptateurEnvoiMail,
  ConfirmationDemandeAideAttribuee,
  Destinataire,
  Email,
  Expediteur,
  InformationEntitePourMiseEnRelation,
  UtilisateurMACEnRelation,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';
import {
  adaptateursRequeteBrevo,
  EnvoiMailBrevoAvecTemplate,
  ErreurRequeBrevo,
  RequeteBrevo,
} from './adaptateursRequeteBrevo';
import {
  ConstructeurBrevoEnvoiMailAvecTemplate,
  unConstructeurEnvoiDeMail,
  unConstructeurEnvoiDeMailAvecTemplate,
} from '../brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { isArray } from 'lodash';
import { AidantMisEnRelation } from '../../gestion-demandes/aide/MiseEnRelationParCriteres';
import { emailCOTDeLaRegion } from '../annuaireCOT/annuaireCOT';
import { enCadence } from './enCadence';
import { DemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  async envoieConfirmationUtilisateurInscritCree(utilisateurInscrit: {
    email: string;
    nomPrenom: string;
  }): Promise<void> {
    const destinataire: Destinataire = {
      email: utilisateurInscrit.email,
    };
    const constructeurEmailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        adaptateurEnvironnement
          .brevo()
          .templateConfirmationUtilisateurInscritCree()
      )
      .ayantPourDestinataires([[destinataire.email, destinataire.nom]])
      .ayantPourParametres({
        tableauDeBord: new URL(
          '/mon-espace/tableau-de-bord',
          adaptateurEnvironnement.mac().urlMAC()
        ).toString(),
        kitDeCommunication: new URL(
          '/promouvoir-communaute-aidants-cyber',
          adaptateurEnvironnement.mac().urlMAC()
        ).toString(),
        emailMonAideCyber: adaptateurEnvironnement.messagerie().emailMAC(),
        relaisAssociatifs: new URL(
          '/relais-associatifs',
          adaptateurEnvironnement.mac().urlMAC()
        ).toString(),
      });
    await this.envoieMailAvecTemplate(constructeurEmailBrevo.construis());
  }

  async envoieMailMiseAJourParticipationAUnAtelier(
    demandeDevenirAidant: DemandeDevenirAidant,
    emailCOT: string,
    emailMAC: string
  ): Promise<void> {
    const futurAidant: Destinataire = {
      email: demandeDevenirAidant.mail,
    };
    const cot: Destinataire = {
      email: emailCOT,
    };
    const mac: Destinataire = { email: emailMAC };

    const constructeurBrevoEnvoiMailAvecTemplate =
      unConstructeurEnvoiDeMailAvecTemplate().ayantPourTemplate(
        adaptateurEnvironnement
          .brevo()
          .templateMiseAJourParticipationAtelierAidant()
      );
    await this.envoieParticipationAtelierAidant(
      constructeurBrevoEnvoiMailAvecTemplate,
      futurAidant,
      cot,
      mac
    );
  }

  async envoieMailParticipationAUnAtelier(
    demande: DemandeDevenirAidant,
    emailCOT: string,
    emailMAC: string
  ): Promise<void> {
    const futurAidant: Destinataire = {
      email: demande.mail,
    };
    const cot: Destinataire = {
      email: emailCOT,
    };
    const mac: Destinataire = { email: emailMAC };

    const constructeurBrevoEnvoiMailAvecTemplate =
      unConstructeurEnvoiDeMailAvecTemplate().ayantPourTemplate(
        adaptateurEnvironnement.brevo().templateParticipationAtelierAidant()
      );
    await this.envoieParticipationAtelierAidant(
      constructeurBrevoEnvoiMailAvecTemplate,
      futurAidant,
      cot,
      mac
    );
  }

  private async envoieParticipationAtelierAidant(
    constructeurBrevoEnvoiMailAvecTemplate: ConstructeurBrevoEnvoiMailAvecTemplate,
    futurAidant: Destinataire,
    cot: Destinataire,
    mac: Destinataire
  ) {
    await this.envoieMailAvecTemplate(
      constructeurBrevoEnvoiMailAvecTemplate
        .ayantPourDestinataires([[futurAidant.email, futurAidant.nom]])
        .ayantPourDestinatairesEnCopie([[cot.email, cot.nom]])
        .ayantPourDestinatairesEnCopieInvisible([[mac.email, mac.nom]])
        .ayantPourParametres({
          urls: {
            connexion: new URL(
              '/connexion',
              adaptateurEnvironnement.mac().urlMAC()
            ).toString(),
            kitDeCommunication: new URL(
              '/promouvoir-communaute-aidants-cyber',
              adaptateurEnvironnement.mac().urlMAC()
            ).toString(),
            charteAidant: new URL(
              '/charte-aidant',
              adaptateurEnvironnement.mac().urlMAC()
            ).toString(),
          },
        })
        .construis()
    );
  }

  async envoieActivationCompteAidantFaite(email: string): Promise<void> {
    const destinataire: Destinataire = {
      email,
    };
    const constructeurEmailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        adaptateurEnvironnement.brevo().templateActivationCompteAidant()
      )
      .ayantPourDestinataires([[destinataire.email, destinataire.nom]])
      .ayantPourParametres({
        annuaireAidantsCyber: new URL(
          '/beneficier-du-dispositif/annuaire',
          adaptateurEnvironnement.mac().urlMAC()
        ).toString(),
      });
    await this.envoieMailAvecTemplate(constructeurEmailBrevo.construis());
  }

  async envoieConfirmationDemandeAide(
    email: string,
    utilisateurMACEnRelation: UtilisateurMACEnRelation | undefined
  ): Promise<void> {
    const destinataire: Destinataire = { email };
    let constructeurEmailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        utilisateurMACEnRelation
          ? adaptateurEnvironnement
              .brevo()
              .templateConfirmationAideEnRelationAvecUnUtilisateurMAC()
          : adaptateurEnvironnement.brevo().templateConfirmationAide()
      )
      .ayantPourDestinataires([[destinataire.email, destinataire.nom]]);
    if (utilisateurMACEnRelation) {
      constructeurEmailBrevo = constructeurEmailBrevo
        .ayantPourDestinatairesEnCopie([
          [utilisateurMACEnRelation.email, utilisateurMACEnRelation.nomPrenom],
        ])
        .ayantPourParametres({ prenom: utilisateurMACEnRelation.nomPrenom });
    }
    const emailBrevo = constructeurEmailBrevo.construis();
    await this.envoieMailAvecTemplate(emailBrevo);
  }

  async envoieConfirmationDemandeAideAttribuee(
    confirmation: ConfirmationDemandeAideAttribuee
  ): Promise<void> {
    const destinataire: Destinataire = {
      email: confirmation.emailAidant,
    };
    const constructeurEmailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        adaptateurEnvironnement.brevo().templateAidantDemandeAideAttribuee()
      )
      .ayantPourDestinataires([[destinataire.email, destinataire.nom]])
      .ayantPourDestinatairesEnCopie([
        [emailCOTDeLaRegion(confirmation.departement), ''],
      ])
      .ayantPourParametres({
        nomPrenom: confirmation.nomPrenomAidant,
        mail: confirmation.emailEntite,
        departement: confirmation.departement.nom,
        secteursActivite: confirmation.secteursActivite,
        typeEntite: confirmation.typeEntite,
      });
    await this.envoieMailAvecTemplate(constructeurEmailBrevo.construis());
  }

  async envoiToutesLesMisesEnRelation(
    matchingAidants: AidantMisEnRelation[],
    informations: InformationEntitePourMiseEnRelation
  ): Promise<void> {
    const etaleLesEnvois = async (
      i: InformationEntitePourMiseEnRelation,
      a: AidantMisEnRelation
    ) => {
      await enCadence(100, () => this.envoieUneMiseEnRelation(i, a));
    };

    const tousLesEnvois = matchingAidants.map((a) =>
      etaleLesEnvois(informations, a)
    );
    await Promise.all(tousLesEnvois);
  }

  private async envoieUneMiseEnRelation(
    informations: InformationEntitePourMiseEnRelation,
    aidant: AidantMisEnRelation
  ): Promise<void> {
    const destinataire: Destinataire = { email: aidant.email };
    const emailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        adaptateurEnvironnement.brevo().templateMiseEnRelation()
      )
      .ayantPourDestinataires([[destinataire.email, destinataire.nom]])
      .ayantPourParametres({
        nomPrenom: aidant.nomPrenom,
        epci: informations.epci,
        departement: informations.departement,
        typeEntite: informations.typeEntite,
        secteursActivite: informations.secteursActivite,
        lienPourPostuler: aidant.lienPourPostuler,
      })
      .construis();
    await this.envoieMailAvecTemplate(emailBrevo);
  }

  async envoieRestitutionEntiteAidee(
    pdfsRestitution: Buffer[],
    emailEntiteAidee: string
  ): Promise<void> {
    const emailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        adaptateurEnvironnement.brevo().templateRestitutionPDF()
      )
      .ayantPourDestinataires([[emailEntiteAidee, undefined]])
      .ayantPourParametres({
        mesServicesCyber: adaptateurEnvironnement
          .mesServicesCyber()
          .urlMesServicesCyber()
          .toString(),
      })
      .ayantEnPieceJointe({
        contenu: pdfsRestitution[0].toString('base64'),
        nom: 'Restitution.pdf',
      })
      .ayantEnPieceJointe({
        contenu: pdfsRestitution[1].toString('base64'),
        nom: 'Annexe.pdf',
      })
      .construis();
    await this.envoieMailAvecTemplate(emailBrevo);
  }

  private async envoieMailAvecTemplate<T extends EnvoiMailBrevoAvecTemplate>(
    requeteBrevo: RequeteBrevo<T>
  ) {
    try {
      await adaptateursRequeteBrevo().envoiMail().execute(requeteBrevo);
    } catch (reponse: unknown | ErreurRequeBrevo) {
      throw new ErreurEnvoiEmail(
        JSON.stringify((reponse as ErreurRequeBrevo).corps),
        { cause: reponse as ErreurRequeBrevo }
      );
    }
  }

  async envoie(
    message: Email,
    expediteur: Expediteur = 'MONAIDECYBER'
  ): Promise<void> {
    const envoiDeMail = unConstructeurEnvoiDeMail()
      .ayantPourExpediteur(
        'MonAideCyber',
        expediteur === 'MONAIDECYBER'
          ? adaptateurEnvironnement.messagerie().expediteurMAC()
          : adaptateurEnvironnement.messagerie().expediteurInfoMAC()
      )
      .ayantPourDestinataires(
        isArray(message.destinataire)
          ? message.destinataire.map((destinataire) => [
              destinataire.email,
              destinataire.nom,
            ])
          : [[message.destinataire.email, message.destinataire.nom]]
      )
      .ayantEnCopie(message.copie)
      .ayantEnCopieInvisible(message.copieInvisible)
      .ayantPourSujet(message.objet)
      .ayantPourContenu(message.corps)
      .ayantEnPieceJointe(message.pieceJointe)
      .construis();
    await adaptateursRequeteBrevo()
      .envoiMail()
      .execute(envoiDeMail)
      .catch(async (reponse: unknown | ErreurRequeBrevo) => {
        throw new ErreurEnvoiEmail(
          JSON.stringify((reponse as ErreurRequeBrevo).corps),
          { cause: reponse as ErreurRequeBrevo }
        );
      });
  }
}
