import './encart-diagnostic-cyber.scss';
import { TypographieH3 } from '../communs/typographie/TypographieH3/TypographieH3.tsx';
import { liensMesServicesCyber } from '../../infrastructure/mes-services-cyber/liens.ts';

export function EncartDiagnosticCyber() {
  return (
    <section className="encart-diagnostic-cyber">
      <div className="contenu">
        <div>
          <TypographieH3>
            Vous souhaitez vous protéger contre les cyberattaques mais ne savez
            pas comment vous y prendre&nbsp;?
          </TypographieH3>
          <p className="details">
            Prenez votre cyberdépart grâce à un{' '}
            <strong>diagnostic gratuit accompagné par un Aidant cyber</strong>.
            Pour cela, rendez-vous sur <strong>MesServicesCyber</strong>, la
            plateforme publique des services cyber pour vous aider&nbsp;!
          </p>
        </div>

        <img src="/images/illustration-dino-cyberdepart.svg" alt="" />

        <a
          role="button"
          className="action"
          href={liensMesServicesCyber().cyberDepartAvecTracking}
          target="_blank"
          rel="noreferrer"
        >
          Bénéficier du diagnostic cyber gratuit
        </a>

        <p className="disclaimer">
          Ce diagnostic proposé par l&apos;État n&apos;est pas adapté aux
          particuliers et micro-entreprises.
        </p>
      </div>
    </section>
  );
}
