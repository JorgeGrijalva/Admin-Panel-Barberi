import { RECAPTCHASITEKEY } from "configs/app-global";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onChange }) => {
  const handleRecaptchaChange = (value) => {
    // Pass the reCAPTCHA response value to the parent component
    onChange(value);
  };

  return (
    <ReCAPTCHA
      sitekey={RECAPTCHASITEKEY}
      onChange={handleRecaptchaChange}
    />
  );
};

export default Recaptcha;