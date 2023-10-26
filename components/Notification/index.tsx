import React, { useEffect } from 'react';
import Image from 'next/image';

interface NotificationProps {
  type: string;
  message: string;
  onClose: Function;
}

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'warning';
  }
}

const getColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-100';
    case 'error':
      return 'bg-red-100';
    case 'warning':
      return 'bg-orange-100';
    default:
      return 'bg-orange-100';
  }
}

const Notification = (props: NotificationProps) => {
  const { type, message, onClose } = props;

  useEffect(() => {
    setTimeout(() => {
      onClose()
    }, 2000)
  }, [])

  return (
    <div className="absolute right-12 top-10 z-9999">
      <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 ${getColor(type)} rounded-lg dark:bg-green-800 dark:text-green-200`}>
          <Image src={`/admin/images/notification/${getIcon(type)}.svg`}
            alt={getIcon(type)}
            width={20}
            height={20} />
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <button onClick={() => {
          onClose();
        }} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
          <Image src={"/admin/images/notification/close.svg"}
            alt="close"
            width={12}
            height={12} />
        </button>
      </div>
    </div>

  );
};

export default Notification;
