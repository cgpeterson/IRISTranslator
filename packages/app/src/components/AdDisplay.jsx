import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * A React component to display a Google AdSense ad unit.
 * It uses useEffect to safely push the ad request,
 * which is necessary for Single Page Applications.
 */
const AdDisplay = ({ slot, adFormat = 'auto', responsive = true }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client="ca-pub-5152255877642409"
         data-ad-slot={slot}
         data-ad-format={adFormat}
         data-full-width-responsive={responsive.toString()}>
    </ins>
  );
};

AdDisplay.propTypes = {
  slot: PropTypes.string.isRequired,
  adFormat: PropTypes.string,
  responsive: PropTypes.bool,
};

export default AdDisplay;
