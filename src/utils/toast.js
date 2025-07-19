import { toast } from 'react-toastify';

/**
 * Toast 중앙 집중식 설정 관리
 * App.jsx의 ToastContainer와 개별 toast 함수에서 모두 사용
 */

// 🔹 ToastContainer용 전역 설정 (App.jsx에서 사용)
export const TOAST_CONTAINER_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body',
  progressClassName: 'custom-toast-progress',
};

// 🔹 개별 toast 함수용 기본 설정
const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// 성공 메시지
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// 에러 메시지
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// 경고 메시지
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

// 정보 메시지
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// 로딩 toast (업데이트 가능)
export const showLoading = (message = '처리 중...', options = {}) => {
  return toast.loading(message, {
    ...defaultOptions,
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    ...options,
  });
};

// 로딩 toast 업데이트 (성공)
export const updateLoadingSuccess = (toastId, message, options = {}) => {
  return toast.update(toastId, {
    render: message,
    type: 'success',
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
    ...options,
  });
};

// 로딩 toast 업데이트 (에러)
export const updateLoadingError = (toastId, message, options = {}) => {
  return toast.update(toastId, {
    render: message,
    type: 'error',
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
    ...options,
  });
};

// 커스텀 jsx 내용의 toast
export const showCustom = (content, options = {}) => {
  return toast(content, {
    ...defaultOptions,
    ...options,
  });
};

// Promise toast (API 호출에 유용)
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      pending: messages.pending || '처리 중...',
      success: messages.success || '성공!',
      error: messages.error || '오류가 발생했습니다.',
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};

// 모든 toast 닫기
export const dismissAll = () => {
  toast.dismiss();
};

// 특정 toast 닫기
export const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * 🎯 사용 예시:
 *
 * // App.jsx에서
 * import { TOAST_CONTAINER_CONFIG } from '@utils/toast';
 * <ToastContainer {...TOAST_CONTAINER_CONFIG} />
 *
 * // 다른 컴포넌트에서
 * import { showSuccess, showError } from '@utils/toast';
 * showSuccess('저장되었습니다!');
 * showError('오류가 발생했습니다.');
 */
