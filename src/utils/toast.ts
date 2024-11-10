import toast from 'react-hot-toast';

// Show error toast
export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'bottom-center',
    style: {
      background: '#f87171',
      color: '#fff',
    },
  });
};

// Show success toast
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'bottom-center',
    style: {
      background: '#2ecc71',
      color: '#fff',
    },
  });
};
