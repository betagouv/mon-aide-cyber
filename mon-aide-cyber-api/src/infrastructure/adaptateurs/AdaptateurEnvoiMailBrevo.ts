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
  unConstructeurEnvoiDeMail,
  unConstructeurEnvoiDeMailAvecTemplate,
} from '../brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { isArray } from 'lodash';
import { AidantMisEnRelation } from '../../gestion-demandes/aide/MiseEnRelationParCriteres';
import { emailCOTDeLaRegion } from '../annuaireCOT/annuaireCOT';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
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

  async envoieMiseEnRelation(
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
    __pdfRestitution: Buffer,
    __emailEntiteAidee: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
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
