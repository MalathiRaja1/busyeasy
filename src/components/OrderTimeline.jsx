import { useTranslation } from 'react-i18next';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

function OrderTimeline({ currentStatus }) {
  const { t } = useTranslation();
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  const statusKeyMap = {
    Pending: 'pending',
    Confirmed: 'confirmed',
    Shipped: 'shipped',
    Delivered: 'delivered',
  };

  return (
    <div className="order-timeline">
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="timeline-step">
            <div className="timeline-step-line-wrapper">
              {index > 0 && (
                <div className={`timeline-line ${index <= currentIndex ? 'completed' : ''}`} />
              )}
            </div>
            <div className={`timeline-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              {isCompleted ? '✓' : index + 1}
            </div>
            <span className={`timeline-label ${isCompleted ? 'completed' : ''}`}>
              {t(statusKeyMap[step])}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default OrderTimeline;