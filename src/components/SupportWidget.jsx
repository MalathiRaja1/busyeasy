import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function SupportWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="support-widget">
      {open && (
        <div className="support-panel">
          <div className="support-panel-header">
            <span>💬 {t('need_help')}</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="support-panel-body">
            <p>{t('support_message')}</p>
            <Link to="/contact-us" className="support-contact-btn" onClick={() => setOpen(false)}>
              {t('contact_us')}
            </Link>
            <p className="support-quick-info">📞 +91 90874 47567</p>
            <p className="support-quick-info">📧 support@buyeasy.com</p>
          </div>
        </div>
      )}
      <button className="support-fab" onClick={() => setOpen(!open)} aria-label={open ? 'Close support chat' : 'Open support chat'}>
  {open ? '✕' : '💬'}
</button>
    </div>
  );
}

export default SupportWidget;