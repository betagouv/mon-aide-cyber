import './top-aidants.scss';
import { useState } from 'react';

export const MiseEnAvantTopAidants = () => {
  const [cacheEncart, setCacheEncart] = useState<boolean>(false);

  return cacheEncart ? (
    <></>
  ) : (
    <section className="challenge">
      <div className="container">
        <div className="encart">
          <div className="gagnants">
            <div className="remerciements">
              <div className="titre">🎉 Fin du Challenge MonAideCyber</div>
              <div>
                Entre le 1er septembre et le 31 octobre, nous avons lancé un
                challenge visant à récompenser les Aidants cyber ayant réalisé
                le plus de diagnostics proactifs.{' '}
                <b>
                  Un énorme merci 🙏 aux 158 Aidants cyber qui se sont engagés
                  et un grand bravo 👏 aux 4 lauréats : Pierre Borie, Kim
                  Guerin, Benoît Lejeunes et Willy Robert.
                </b>
              </div>
            </div>
            <div className="visuels">
              <img src="/images/top_aidants/laurier_g.svg" alt="" />
              <img
                src="/images/top_aidants/pierre_borie.svg"
                alt="Top Aidant Pierre Borie"
              />
              <img
                src="/images/top_aidants/kim_guerin.svg"
                alt="Top Aidante Kim Guerin"
              />
              <img
                src="/images/top_aidants/benoit_lejeunes.svg"
                alt="Top Aidant Benoît Lejeunes"
              />
              <img
                src="/images/top_aidants/willy_robert.svg"
                alt="Top Aidant Willy Robert"
              />
              <img src="/images/top_aidants/laurier_d.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="fermeture">
          <button
            type="button"
            className="fr-btn fr-btn--close"
            onClick={() => setCacheEncart(true)}
          ></button>
        </div>
      </div>
    </section>
  );
};
