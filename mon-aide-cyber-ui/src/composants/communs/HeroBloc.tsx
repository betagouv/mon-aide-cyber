
type HeroBlocProprietes = {
    titre: string;
    description: string;
    lienIcone: string;
}

function HeroBloc({ titre, description, lienIcone }: HeroBlocProprietes) {
  return (
    <div className="mode-fonce accueil">
          <div id="presentation" className="fr-container">
            <div className="fr-grid-row fr-grid-row--middle fr-py-20v">
              <div id="corps" className="fr-col-md-6 fr-col-sm-12">
                <h1 className="fr-mb-5w">{titre}</h1>
                <p>
                    {description}
                </p>
              </div>
              <div id="illustration" className="fr-col-md-6 fr-col-sm-12">
                <img
                  src={lienIcone}
                  alt="scène d'un aidant et d'un aidé faisant un diagnostic"
                />
              </div>
            </div>
          </div>
        </div>
  )
}

export default HeroBloc