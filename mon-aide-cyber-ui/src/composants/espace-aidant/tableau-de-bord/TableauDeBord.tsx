import { TypographieH2 } from '../../communs/typographie/TypographieH2/TypographieH2';

export const TableauDeBord = () => {
  return (
    <section className="w-100">
      <div className="bandeau-violet-clair">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '3rem 4.25rem',
          }}
        >
          <TypographieH2>Bonjour Martin !</TypographieH2>
          <p>Bienvenue sur votre espace MonAideCyber</p>
          <div className="grille-premieres-tuiles">
            <div>
              <img
                style={{ width: '40%' }}
                src="/images/illustration-marelle.svg"
              />
            </div>
            <div className="tuile-tdb">Mes demandes</div>
            <div className="tuile-tdb">Statistiques</div>
            <div className="tuile-tdb">Mes diagnostics</div>
          </div>
        </div>
      </div>
    </section>
  );
};
