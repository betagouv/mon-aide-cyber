import { Header } from '../composants/Header.tsx';
import { Footer } from '../composants/Footer.tsx';

export const CorpsCGU = () => {
  const telechargementCGU = (
    <a
      className="fr-link fr-link--download lien-mac"
      download
      href="/fichiers/CGU_MonAideCyber.pdf"
    >
      Télécharger les CGU
      <span className="fr-link__detail">PDF – 114 ko</span>
    </a>
  );

  return (
    <div id="haut">
      <h1>Conditions générales d’utilisation de MonAideCyber</h1>
      En vigueur à compter du 01/01/2024
      <hr />
      {telechargementCGU}
      <p>
        Le service MonAideCyber met en relation les entités de faible maturité
        cyber avec des aidants qui réalisent des diagnostics cyber de premier
        niveau grâce au portail MonAideCyber qui leur est mis à disposition par
        l’Agence nationale de la sécurité des systèmes d’information (ANSSI) et
        qui les aiguillent vers les dispositifs complémentaires existants. Le
        diagnostic, reposant sur la réponse par l’Entité aidée à des questions
        sur différents thèmes en matière de cybersécurité, est gratuit et
        recommande 6 mesures de sécurité prioritaires à mener sur 6 mois. Les
        informations légales de la plateforme MonAideCyber sont accessibles à
        l’adresse <a href="/cgu">https://www.monaidecyber.ssi.gouv.fr/cgu</a>{' '}
        depuis la page d’accueil du Site.
      </p>
      <div id="definitions">
        <h3>1. Définitions</h3>
        <p>
          Dans le cadre des présentes conditions générales d’utilisation, les
          termes précédés d’une majuscule sont définis comme suit :
          <ul>
            <li>
              <b>Aidant :</b> Personne bénévole ayant suivi la formation
              dispensée par l’ANSSI pour devenir Aidant MonAideCyber et qui a
              signé la Charte de l’Aidant
            </li>
            <li>
              <b>Conditions Générales d’Utilisation ou CGU :</b> le présent
              document
            </li>
            <li>
              <b>Entité aidée :</b> Entité publique ou privée, quelle que soit
              sa taille, ayant une faible maturité cyber et souhaitant s’engager
              dans une première démarche proportionnée et concrète de
              renforcement de sa cybersécurité
            </li>
            <li>
              <b>Site :</b> le portail MonAideCyber
            </li>
          </ul>
        </p>
      </div>
      <div id="objets-cgu">
        <h3>2. Objets des CGU</h3>
        Les CGU définissent les conditions selon lesquelles :
        <ul>
          <li>
            l’Aidant peut accéder au Site et l’utiliser afin d’établir un
            diagnostic pour une Entité aidée ;
          </li>
          <li>
            l’Entité aidée peut bénéficier des services du Site avec le soutien
            d’un Aidant.
          </li>
        </ul>
      </div>
      <div id="portail-monaidecyber">
        <h3>3. Le portail MonAideCyber</h3>
        <p>
          Le site a pour objet :
          <ul>
            <li>
              de permettre à un Aidant d’établir pour une Entité aidée un
              diagnostic de cybersécurité de premier niveau lors d’un entretien
              avec cette dernière ;
            </li>
            <li>
              de fournir une liste de 6 mesures de sécurité prioritaires que
              l’Entité aidée pourra mettre en œuvre sur une période de 6 mois.
            </li>
          </ul>
        </p>
      </div>
      <div id="acceptation-maj-cgu">
        <h3>4. Acceptation et mises à jour des CGU</h3>
        <h4>A. Acceptation</h4>
        <p>
          L’accès, l’utilisation et le recours aux services du Site sont
          conditionnés par le respect de la part de l’Aidant et de l&apos;Entité
          aidée des présentes CGU. Pour accéder aux services du Site, l’Aidant
          comme l’Entité aidée doivent avoir expressément accepté les présentes
          CGU.
        </p>
        <p>
          Les CGU sont acceptées sans restriction ni réserve. En cas de
          désaccord avec l&apos;un des termes de ces CGU, y compris après une
          mise à jour de ces dernières, l’Aidant ou l’Entité aidée est libre de
          cesser d&apos;utiliser à tout moment les services du Site.
        </p>
        <p>
          L’Aidant accepte les CGU avant de fournir un premier diagnostic à une
          Entité aidée.
        </p>
        <p>
          L’Entité aidée doit accepter les CGU avant l’intervention de l’Aidant.
          Pour ce faire, est communiquée à l’Aidant l’adresse de messagerie
          électronique d’une personne en capacité d’engager juridiquement
          l’Entité aidée sur laquelle un lien à usage unique la renvoyant vers
          les CGU lui permettra de les valider.
        </p>
        <h4>B. Mise à jour des Conditions Générales</h4>
        <p>
          L&apos;ANSSI est libre de modifier, à tout moment, les CGU, afin
          notamment de prendre en compte toute évolution législative,
          réglementaire, jurisprudentielle et technique. La version qui prévaut
          est celle qui est accessible en ligne à l&apos;adresse suivante :
          https://www.monaidecyber.ssi.gouv.fr/cgu.
        </p>
        <p>
          L’Aidant et l’Entité aidée seront informés en cas de modification des
          CGU. En cas d’opposition aux modifications apportées, l’Aidant ou
          l’Entité aidée est libre de cesser d&apos;utiliser les services du
          Site. Toute utilisation du Site ou des services du Site après la
          publication d&apos;un avis indiquant une évolution des CGU vaut
          acceptation des CGU mises à jour.
        </p>
      </div>
      <div id="obligations-aidant">
        <h3>5. Obligations de l’Aidant</h3>
        <h4>A. Accès au Site</h4>
        <p>
          Pour pouvoir accéder au Site, l’Aidant s’engage à :
          <ul>
            <li>Être dans une démarche bénévole et bienveillante</li>
            <li>Assister à une formation dispensée par l’ANSSI</li>
            <li>Prendre en main l’outil de diagnostic fourni par l’ANSSI</li>
            <li>Signer la Charte de l’Aidant ainsi que les CGU</li>
          </ul>
        </p>
        <h4>B. Utilisation du Site</h4>
        <p>
          Dans le cadre de l&apos;utilisation du Site, l&apos;Aidant
          s&apos;engage à :
          <ul>
            <li>
              se conformer aux stipulations décrites dans les CGU et dans la
              Charte de l’Aidant ainsi qu’aux dispositions des lois et
              règlements en vigueur, et à respecter les droits des tiers ;
            </li>
            <li>
              communiquer à l’ANSSI des informations le concernant conformes à
              la réalité, honnêtes et loyaux ; garder confidentiel le mot de
              passe fourni par l’ANSSI à l’issue de la formation afin d’accéder
              à l’outil de diagnostic du Site ;
            </li>
            <li>
              communiquer la Charte de l’Aidant à l’Entité aidée avant de
              commencer le diagnostic ;
            </li>
            <li>
              accompagner l’Entité aidée pour renseigner les informations sur le
              Site et retranscrire les informations que l’Entité aidée lui
              communique, de manière loyale et honnête ;
            </li>
            <li>
              ne pas fournir de données à caractère personnel ou d’informations
              contraires aux lois et règlements en vigueur dans les champs
              libres du Site ;
            </li>
            <li>
              fournir à l’Entité aidée les 6 recommandations issues du
              diagnostic ;
            </li>
            <li>
              remonter toute problématique et/ou écart de conduite de l’Entité
              aidée constaté via le mail suivant : monaidecyber [at] ssi.gouv.fr
            </li>
          </ul>
          En cas de manquement à une ou plusieurs de ces obligations,
          l&apo;ANSSI se réserve le droit de déréférencer l’Aidant, suspendre ou
          supprimer ses accès au Site.
        </p>
      </div>
      <div id="obligations-aide">
        <h3>6. Obligations de l’Entité aidée</h3>
        <p>
          Dans le cadre du recours aux services du Site, l&apos;Entité aidée
          s&apos;engage à :
          <ul>
            <li>
              se conformer aux stipulations décrites dans les CGU et aux
              dispositions des lois et règlements en vigueur, et à respecter les
              droits des tiers ;
            </li>
            <li>avoir un comportement respectueux envers l’Aidant ;</li>
            <li>
              prendre connaissance de la charte de l’Aidant que celui-ci lui
              aura mise à disposition ;
            </li>
            <li>
              ne communiquer à l’Aidant que des informations conformes à la
              réalité, honnêtes et loyaux ;
            </li>
            <li>ne pas publier le résultat de son diagnostic ;</li>
            <li>
              remonter toute problématique et/ou écart de conduite de l’Aidant
              constaté via le mail suivant : monaidecyber [at] ssi.gouv.fr.
            </li>
          </ul>{' '}
          En cas de manquement à une ou plusieurs de ces obligations,
          l&apos;Agence nationale de la sécurité des systèmes d’information
          (ANSSI) se réserve le droit de supprimer l’accès au diagnostic
          effectué.
        </p>
      </div>
      <div id="resultat-diagnostic-partage-statistiques">
        <h3>7. Résultat du diagnostic et partage de données statistiques</h3>
        <p>
          Le résultat du diagnostic établissant les 6 recommandations de
          cybersécurité prioritaires est calculé sur la base des informations
          relatives à l’Entité aidée renseignées par l’Aidant lors son entretien
          avec elle et selon des critères de priorité définis par l’ANSSI au
          regard de sa connaissance sur l’état de la menace cyber.
        </p>
        <p>
          Ces 6 recommandations sont fournies à l’Entité aidée à l’issue du
          diagnostic et sont disponibles en ligne à partir du lien envoyé sur
          l’adresse de messagerie électronique professionnelle renseignée pour
          l’Entité aidée.
        </p>
        <p>
          L’Aidant et l’Entité aidée acceptent que les données anonymisées des
          diagnostics soient agrégées afin de produire des statistiques sur la
          cybersécurité, publiables par région.
        </p>
      </div>
      <div id="convention-preuve">
        <h3>8. Convention sur la preuve</h3>
        <p>
          L’Aidant et l’Entité aidée acceptent que les dates générées ou
          inscrites électroniquement de toute information ou décision sur le
          Site soient admissibles devant les tribunaux et fassent preuve des
          données et des faits qu&apos;elles contiennent (ex : date de
          validation des CGU).
        </p>
        <p>La preuve contraire peut être rapportée.</p>
      </div>
      <div id="notifications-et-messages">
        <h3>9. Notifications et Messages</h3>
        <p>
          L&apos;Aidant et l’Entité aidée acceptent que des notifications et des
          messages liés à l’utilisation ou aux services du Site lui soient
          envoyés aux coordonnées qu’il ou elle a fournies (adresse de
          messagerie électronique, numéro de téléphone le cas échéant). Si ses
          coordonnées ne sont pas à jour, l&apos;Aidant et l’Entité aidée sont
          conscients que des notifications importantes sont susceptibles de ne
          pas lui parvenir. Par conséquent, l&apos;Aidant et l’Entité aidée
          s&apos;engagent à tenir à jour leurs coordonnées.
        </p>
      </div>
      <div id="donnees-caractere-personnel">
        <h3>10. Données à caractère personnel</h3>

        <p>
          La gestion du Site implique la mise en œuvre de deux traitements de
          données à caractère personnel, l’un concernant les Aidants et l’autre
          concernant la personne de l’Entité aidée validant les CGU.
        </p>
        <h5>
          Stipulations communes aux deux traitements de données à caractère
          personnel
        </h5>
        <h4>A. Identité et coordonnées du responsable des traitements</h4>
        <p>
          Le responsable des traitements des données à caractère personnel que
          l’Aidant ou la personne de l’Entité aidée validant les CGU
          transmettent pour l’accès et l’utilisation du Site est l&apos;ANSSI
          (51 boulevard de la Tour-Maubourg, 75700 Paris 07 SP).
        </p>
        <p>
          L&apos;ANSSI, en tant que responsable de traitement, s&apos;engage à
          ce que la collecte et le traitement des données à caractère personnel
          de l&apos;Aidant et la personne de l’Entité aidée validant les CGU
          soit effectués de manière licite, loyale et transparente, conformément
          au{' '}
          <a
            href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr"
            target="_blank"
            rel="noreferrer"
          >
            Règlement (UE) général sur la protection des données (« RGPD »)
          </a>{' '}
          et à la{' '}
          <a
            href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460"
            target="_blank"
            rel="noreferrer"
          >
            Loi informatique et libertés de 1978 modifiée (« LIL »)
          </a>
          .
        </p>
        <p>
          Cette collecte d&apos;informations se limite au nécessaire,
          conformément au principe de minimisation des données. Les définitions
          fournies à l&apos;article 4 du RGPD sont applicables aux présentes. En
          cas de mise à jour, l&apos;ANSSI n&apos;abaissera pas le niveau de
          confidentialité de manière substantielle sans l&apos;information
          préalable de l&apos;Aidant et la personne de l’Entité aidée validant
          les CGU.
        </p>
        <h4>B. Fondement juridique des traitements</h4>
        <p>
          Le fondement juridique des deux traitements est à l&apos;article 6.1.
          e) du RGPD, étant nécessaires à l’exécution des missions d’intérêt
          public dont l’ANSSI est investie au titre de l’article 3 du décret n°
          2009-834 du 7 juillet 2009 portant création d&apos;un service à
          compétence nationale dénommé « Agence nationale de la sécurité des
          systèmes d&apos;information »
        </p>
        <h4>C. Sécurité des données à caractère personnel</h4>
        <p>
          L&apos;ANSSI met en œuvre toutes les mesures techniques et
          organisationnelles afin d&apos;assurer la sécurité et la conformité
          des traitements de données à caractère personnel, ainsi que la
          confidentialité de ces données.
        </p>
        <p>
          À ce titre, l&apos;ANSSI prend toutes les précautions utiles sur le
          Site au regard de la nature des données et des risques présentés par
          le Site, afin de préserver la sécurité des données et, notamment,
          d&apos;empêcher qu&apos;elles soient déformées, endommagées, ou que
          des tiers non autorisées y aient accès.
        </p>
        <h4>
          D. Exercice des droits de la personne concernée par le traitement
        </h4>
        <p>
          Conformément à la réglementation européenne en vigueur, l&apos;Aidant
          et la personne de l’Entité aidée validant les CGU disposent des droits
          suivants :
        </p>
        <ul>
          <li>
            droit d&apos;accès (article 15 du{' '}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr"
              rel="noreferrer"
              target="_blank"
            >
              RGPD
            </a>
            ), de rectification, de mise à jour et de complétude de ses données
            (article 16 du RGPD) ;
          </li>
          <li>
            droit d&apos;effacement de ses données dans les conditions prévues à
            l&apos;article 17 du{' '}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr"
              target="_blank"
              rel="noreferrer"
            >
              RGPD
            </a>
            . L&apos;exercice du droit d&apos;effacement des données entraînera
            la suppression de son compte;
          </li>
          <li>
            droit à la limitation du traitement de ses données (article 18 du{' '}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr"
              target="_blank"
              rel="noreferrer"
            >
              RGPD
            </a>
            ) ;
          </li>
          <li>
            droit à la portabilité des données qu&apos;il a fournies (article 20
            du{' '}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr"
              target="_blank"
              rel="noreferrer"
            >
              RGPD
            </a>
            ).
          </li>
        </ul>
        <p>
          L&apos;Aidant ou la personne de l’Entité aidée validant les CGU peut
          exercer ses droits en contactant l&apos;ANSSI :
        </p>
        <ul>
          <li>
            par courriel à l&apos;adresse suivante : monaidecyber [at]
            ssi.gouv.fr
          </li>
          <li>
            par courrier postal à l&apos;adresse suivante : <br />
            Agence nationale de la sécurité des systèmes d&apos;information{' '}
            <br />À l&apos;attention de contact RGPD Mon aide cyber <br />
            51 boulevard de la Tour-Maubourg <br />
            75007 PARIS 07 SP
          </li>
        </ul>
        <p>
          Dans ce cas, l&apos;Aidant ou la personne de l’Entité aidée validant
          les CGU doit préciser quelles sont les données concernées par sa
          demande et justifier de son identité (fournir une copie d&apos;une
          pièce d&apos;identité). Par ailleurs, dès que l&apos;ANSSI a
          connaissance du décès d&apos;un Aidant ou de la personne de l’Entité
          aidée validant les CGU, elle s&apos;engage à détruire ses données,
          sauf si leur conservation s&apos;avère nécessaire afin de répondre à
          une obligation légale.
        </p>
        <p>
          Si l’Aidant ou la personne de l’Entité aidée validant les CGU estime
          après avoir contacté l&apos;ANSSI que les droits sur ses données
          n&apos;ont pas été respectés, il peut introduire une réclamation
          auprès de la CNIL.
        </p>
        <p>
          <a
            href="https://www.cnil.fr/fr/mes-demarches/les-droits-pour-maitriser-vos-donnees-personnelles"
            target="_blank"
            rel="noreferrer"
          >
            Voir le site de la CNIL pour plus d&apos;informations sur les droits
            de l&apos;Utilisateur.
          </a>
        </p>
        <h5>
          Stipulations propres au traitement des données à caractère personnel
          de l’Aidant
        </h5>
        <h4>A. Données collectées et finalités de la collecte</h4>
        <p>
          Les données collectées de l’Aidant sont :
          <ul>
            <li>Le nom et le prénom ;</li>
            <li>L’adresse de messagerie électronique ;</li>
            <li>Le numéro de téléphone ;</li>
            <li>La région dans laquelle il exerce ses prestations.</li>
          </ul>
        </p>
        <p>
          Elles ont pour finalités :
          <ul>
            <li>Le référencement des Aidants pour chaque région ;</li>
            <li>
              La gestion des Aidants pour la formation et l’accès au Site ;
            </li>
            <li>
              Les communications liées à l’utilisation du Site, ses évolutions
              et à l’animation de la communauté des Aidants.
            </li>
          </ul>
        </p>
        <h4>B. Durée de conservation des données collectées</h4>
        <p>
          Les données de l’Aidant sont conservées tant que l’Aidant souhaite
          être référencé par l’ANSSI et jusqu’à six mois après sa demande de ne
          plus être référencé.
        </p>
        <h4>C. Destinataires des données collectées</h4>
        <p>
          Les destinataires des données à caractère personnel de l’Aidant sont
          le personnel de l&apos;ANSSI impliqué dans l&apos;administration et la
          gestion du Site.
        </p>
        <h4>D. Sous-traitant et transfert des données à caractère personnel</h4>
        <p>
          Le numéro de téléphone peut être temporairement hébergé chez Brevo
          pour l’envoi d’informations permettant l’accès au Site.
        </p>
        <p>
          L&apos;ANSSI s&apos;engage à (i) ce que le sous-traitant présente des
          garanties contractuelles suffisantes et appropriées pour respecter les
          droits de l’Aidant, afin que le traitement réponde aux exigences du
          RGPD et (ii) à respecter les dispositions du RGPD applicables aux
          transferts des données.
        </p>
        <p>
          Par exception, les données à caractère personnel de l’Aidant pourront
          être divulguées en application d&apos;une loi, d&apos;un règlement ou
          en vertu d&apos;une décision d&apos;une autorité réglementaire ou
          judiciaire compétente.
        </p>
        <h5>
          Stipulations propres au traitement des données à caractère personnel
          de la personne de l’Entité aidée validant les CGU
        </h5>
        <h4>A. Données collectées et finalités de la collecte</h4>
        <p>
          Les données collectées sont les suivantes :
          <ul>
            <li>
              L’adresse de messagerie électronique professionnelle de la
              personne validant les CGU communiquée à l’Aidant ;
            </li>
            <li>Le numéro unique attribué au diagnostic.</li>
          </ul>
        </p>
        <p>
          Ces données sont collectées afin :
          <ul>
            <li>d’obtenir le lien de validation des CGU ;</li>
            <li>
              d’obtenir le lien vers les 6 recommandations de cybersécurité
              issues du diagnostic ;
            </li>
            <li>
              d’envoyer un message de rappel pour un point d’étape à six mois ;
            </li>
            <li>
              de pouvoir faire la preuve qu’un diagnostic a bien été effectué à
              la demande de l’Entité aidée grâce au lien entre le numéro unique
              du diagnostic et l’adresse de messagerie électronique associée
              (par ex : en cas de demande de justification pour qu’elle puisse
              obtenir une subvention).
            </li>
          </ul>
        </p>
        <h4>B. Durée de conservation des données collectées</h4>
        <p>
          L’adresse de messagerie professionnelle est conservée un an chez
          l’hébergeur Brevo.
        </p>
        <p>
          Elle est conservée sur un serveur sécurisé de l’ANSSI avec le numéro
          unique de diagnostic pendant trois ans à compter de la date de
          création de ce dernier. Le contenu du diagnostic n’est pas conservé
          dans cette base de correspondance entre numéro unique du diagnostic et
          adresse de messagerie électronique.
        </p>
        <h4>C. Destinataires des données collectées</h4>
        <p>
          Les destinataires des données à caractère personnel de la personne
          engageant l’Entité aidée sont le personnel de l&apos;ANSSI impliqué
          dans l&apos;administration et la gestion du Site.
        </p>
        <h4>D. Sous-traitant et transfert des données collectées</h4>
        <p>
          L’adresse de messagerie électronique professionnelle est hébergée chez
          Brevo.
        </p>
        <p>
          L&apos;ANSSI s&apos;engage à (i) ce que le sous-traitant présente des
          garanties contractuelles suffisantes et appropriées pour respecter les
          droits de la personne engageant l’Entité aidée, afin que le traitement
          réponde aux exigences du RGPD et (ii) à respecter les dispositions du
          RGPD applicables aux transferts des données.
        </p>
        <p>
          Par exception, les données à caractère personnel de la personne
          engageant l’Entité aidée pourront être divulguées en application
          d&apos;une loi, d&apos;un règlement ou en vertu d&apos;une décision
          d&apos;une autorité réglementaire ou judiciaire compétente.
        </p>
      </div>
      <div id="propriete-intellectuelle">
        <h3>11. Propriété intellectuelle</h3>
        <p>Contenus édités par le Site</p>
        <p>
          <b>Protection des contenus :</b> sauf mention expresse contraire, tous
          les contenus protégeables par le droit de la propriété intellectuelle
          ne peuvent être reproduits ou réutilisés sans l&apos;autorisation
          expresse de l&apos;ANSSI.
        </p>
        <p>
          <b>Demande d&apos;autorisation :</b> les demandes d&apos;autorisation
          de reproduction d&apos;un contenu doivent au préalable être adressées
          à l&apos;ANSSI, en écrivant à l&apos;adresse suivante : monaidecyber
          [at] ssi.gouv.fr
          <br />
          La demande devra préciser le contenu visé ainsi que le contexte
          d&apos;utilisation prévu (supports concernés, période, destinataires,
          etc.).
        </p>
        <p>
          Aucune stipulation des CGU ne peut être interprétée comme une cession
          de droits de propriété intellectuelle, que ce soit tacitement ou
          d&apos;une autre façon.
        </p>
      </div>
      <div id="responsabilite-garaties-accessibilite">
        <h3>12. Responsabilités, garanties et accessibilité au Site</h3>
        <h4>A. Le portail MonAideCyber</h4>
        <p>
          Le Site met en place les moyens nécessaires à son bon fonctionnement
          et en particulier au maintien de la continuité et de la qualité du
          service. Le service associé au Site est fourni à l&apos;Aidant et à
          l’Entité aidée « en l&apos;état » et est accessible sans garantie
          absolue de disponibilité et de régularité. L&apos;ANSSI
          s&apos;efforcera de rendre le Site accessible 24 heures sur 24, 7
          jours sur 7. Toutefois, l&apos;ANSSI ne pourra en aucun cas être tenue
          pour responsable en raison d&apos;une interruption du service quelle
          que soit la durée ou la fréquence de cette interruption et quelle
          qu&apos;en soit la cause, notamment en raison d&apos;une maintenance
          nécessaire au fonctionnement, de pannes éventuelles, d&apos;aléas
          techniques liés à la nature du réseau Internet, d&apos;actes de
          malveillance ou de toute atteinte portée au fonctionnement du Site.
        </p>
        <h4>B. Réseau Internet </h4>
        <p>
          L&apos;ANSSI ne peut être tenue responsable des perturbations du
          réseau Internet entraînant un dysfonctionnement ou une impossibilité
          d&apos;accéder au Site.
        </p>
        <p>
          L&apos;ANSSI ne peut également pas être tenue responsable de
          l&apos;installation et du fonctionnement des terminaux utilisés par
          l&apos;Aidant ou pour l’Entité aidée pour accéder aux services
          disponibles sur le Site.
        </p>
        <p>
          Les taux de transfert et les temps de réponse des informations
          circulant à partir du Site vers Internet ne sont pas garantis, ceux-ci
          dépendant exclusivement des réseaux de communication et des modalités
          de connexion utilisées par l&apos;Aidant ou l’Entité aidée.
        </p>
        <p>
          L&apos;ANSSI ne saurait en aucun cas être tenue de réparer
          d&apos;éventuels dommages indirects subis par l&apos;Aidant ou
          l’Entité aidée à l&apos;occasion de l&apos;utilisation du Site. Les
          dommages indirects sont ceux qui ne résultent pas exclusivement et
          directement de la défaillance du Site. En outre, la responsabilité de
          l&apos;ANSSI ne peut pas être recherchée pour des actes réalisés par
          l&apos;Aidant, l’Entité aidée ou un tiers utilisant le Site.
        </p>
        <h4>C. Liens hypertextes pointant vers des Sites Tiers</h4>
        <p>
          Le Site peut intégrer des liens hypertextes renvoyant vers des sites
          internet édités par des tiers (ci-après les « Sites Tiers ») sur
          lesquels l&apos;ANSSI n&apos;exerce aucune sorte de contrôle.
          L&apos;ANSSI n&apos;assume aucune responsabilité quant au contenu des
          Sites Tiers ou au contenu vers lequel les Sites Tiers peuvent
          renvoyer.
        </p>
        <p>
          La présence de liens hypertextes vers des Sites Tiers ne saurait
          signifier que l&apos;ANSSI approuve de quelque façon que ce soit les
          contenus des Sites Tiers. L&apos;ANSSI n&apos;est responsable
          d&apos;aucune modification ou mise à jour concernant les Sites Tiers.
          L&apos;ANSSI n&apos;est pas responsable de la transmission
          d&apos;informations à partir des Sites Tiers, ni du mauvais
          fonctionnement de ceux-ci.
        </p>
        <h4>D. Liens hypertextes pointant vers le Site</h4>
        <p>
          Les liens hypertextes renvoyant vers la page d&apos;accueil du Site ou
          l&apos;une de ses rubriques sont autorisés.
        </p>
        <p>
          Les pages du Site ne doivent pas être imbriquées à l&apos;intérieur
          des pages d&apos;un autre site (framing).
        </p>
        <p>
          En toute hypothèse, l&apos;établissement d&apos;un lien vers le Site
          ne constitue pas une approbation par l&apos;ANSSI du contenu du site
          établissant ce lien.
        </p>
      </div>
      <div id="stipulations-diverses">
        <h3>13. Stipulations diverses</h3>
        <p>
          Dans le cas où certaines stipulations des CGU seraient inapplicables
          pour quelque raison que ce soit, y compris en raison d&apos;une loi ou
          d&apos;une réglementation applicable, l&apos;Aidant et l’Entité aidée
          resteront liés par les autres stipulations des CGU. Le fait pour
          l&apos;ANSSI, l’Aidant ou l’Entité aidée de ne pas se prévaloir
          d&apos;une ou plusieurs stipulations des CGU ne pourra en aucun cas
          impliquer la renonciation par ceux-ci à s&apos;en prévaloir
          ultérieurement.
        </p>
      </div>
      <div id="droit-applicable-attribution-competence">
        <h3>14. Droit applicable et attribution de compétence</h3>
        <p>
          Les CGU sont régies par le droit français. Toute difficulté relative à
          la validité, l&apos;application ou l&apos;interprétation des CGU
          seront soumises, à défaut d&apos;accord amiable, à la compétence du
          Tribunal Administratif de Paris, auquel les parties attribuent
          compétence territoriale, quel que soit le lieu d&apos;exécution du
          Site ou le domicile du défendeur. Cette attribution de compétence
          s&apos;applique également en cas de procédure en référé, de pluralité
          de défendeurs ou d&apos;appel en garantie.
        </p>
      </div>
      <div id="contact">
        <h3>15. Contact</h3>
        <p>
          Pour toute question ou réclamation concernant le Site ou les CGU,
          l&apos;Aidant ou l’Entité aidée peut contacter l&apos;ANSSI aux
          coordonnées indiquées dans les{' '}
          <a href="/mentions-legales">Mentions légales</a>. Pour toute question
          ou réclamation relative aux cookies et données à caractère personnel,
          l&apos;Aidant ou l’Entité aidée peut contacter l&apos;ANSSI aux
          coordonnées indiquées au paragraphe{' '}
          <a href="#donnees-caractere-personnel">10</a> des CGU.
        </p>
      </div>
      <div className="fr-mt-8w">
        <a
          className="fr-link fr-icon-arrow-up-fill fr-link--icon-left lien-mac"
          href="#haut"
        >
          {' '}
          Haut de page
        </a>
      </div>
    </div>
  );
};

export const ComposantCGU = () => {
  return (
    <>
      <Header />
      <main role="main">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-8">
              <CorpsCGU />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
