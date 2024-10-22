import { useParams } from 'react-router-dom';

export const EcranAidant = () => {
  const params = useParams();
  console.log({ params });
  return <div>{params?.aidant} sélectionné</div>;
};
