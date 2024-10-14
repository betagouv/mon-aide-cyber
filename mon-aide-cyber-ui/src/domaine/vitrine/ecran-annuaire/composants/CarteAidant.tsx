import './carte-aidant.scss';

export const CarteAidant = ({ nomPrenom }: { nomPrenom: string }) => {
  return (
    <div className="carte-aidant">
      <i className="fr-icon-user-line"></i>
      <span>
        <b>{nomPrenom}</b>
      </span>
      {/* @todo : à décommenter lors du travail sur le CTA
      <Button
        type="button"
        variant="link"
        style={{ display: 'flex', gap: '.5rem' }}
      >
        <span>Solliciter une aide</span>
        <i className="fr-icon-arrow-right-line"></i>
      </Button>*/}
    </div>
  );
};
