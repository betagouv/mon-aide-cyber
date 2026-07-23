export const AutorisationPixelDeSuivi = (props: {
  onChange: () => void;
  estChecked: boolean;
}) => (
  <div className="fr-checkbox-group mac-radio-group">
    <input
      type="checkbox"
      id="pixel-de-suivi"
      name="pixel-de-suivi"
      onChange={props.onChange}
      checked={props.estChecked}
    />
    <label className="fr-label" htmlFor="pixel-de-suivi">
      J&apos;accepte que l&apos;ouverture des emails qui me sont adressés puisse
      être mesurée afin d&apos;en améliorer la pertinence.
    </label>
  </div>
);
