export type Fonctionalite = 'ESPACE_AIDANT_ECRAN_MES_PREFERENCES';

export const useFeatureFlag = (fonctionalite: Fonctionalite) => {
  const valeurVariableEnv = import.meta.env[
    `VITE_FEATURE_FLAG_${fonctionalite}`
  ];

  return {
    estFonctionaliteActive: valeurVariableEnv === 'true',
  };
};
