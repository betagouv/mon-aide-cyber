import Button from '../../../../composants/atomes/Button/Button';
import './carte-aidant.scss';

export const CarteAidant = ({ nomPrenom }: { nomPrenom: string }) => {
  return (
    <div className="carte-aidant">
      <span>
        <b>{nomPrenom}</b>
      </span>
      <Button
        type="button"
        variant="link"
        style={{ display: 'flex', gap: '.5rem' }}
      >
        <span>Solliciter une aide</span>
        <i className="fr-icon-arrow-right-line"></i>
      </Button>
    </div>
  );
};
