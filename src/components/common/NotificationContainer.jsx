import Notification from './Notification';

export default function NotificationContainer({ notifications, onClose }) {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            show={notification.show}
            autoHide={notification.autoHide}
            duration={notification.duration}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
