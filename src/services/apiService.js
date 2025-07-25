import MOCK_USER_API from './mock/mockUser';
import BACK_USER_API from './back/userApi';
import MOCK_SUBSCRIPTION_API from './mock/mockSubscription.js';
import BACK_SUBSCRIPTION_API from './back/subscriptionApi.js';
import MOCK_EXPENSE_API from './mock/mockExpense.js';
import BACK_EXPENSE_API from './back/expenseApi.js';
import MOCK_DIARY_API from './mock/mockDiary.js';
import BACK_DIARY_API from './back/diaryApi.js';
import MOCK_CHALLENGE_API from './mock/mockChallenge';
import BACK_CHALLENGE_API from './back/challengeApi.js';
import MOCK_CATEGORY_API from './mock/mockCategory';
import BACK_CATEGORY_API from './back/categoryApi.js';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

if (USE_MOCK_API) {
  console.log('MOCK API 모드');
} else {
  console.log('실제 API 모드');
}

export const USER_API = USE_MOCK_API ? MOCK_USER_API : BACK_USER_API;

export const SUBSCRIPTION_API = USE_MOCK_API ? MOCK_SUBSCRIPTION_API : BACK_SUBSCRIPTION_API;

export const EXPENSE_API = USE_MOCK_API ? MOCK_EXPENSE_API : BACK_EXPENSE_API;

export const DIARY_API = USE_MOCK_API ? MOCK_DIARY_API : BACK_DIARY_API;

export const CHALLENGE_API = USE_MOCK_API ? MOCK_CHALLENGE_API : BACK_CHALLENGE_API;

export const CATEGORY_API = USE_MOCK_API ? MOCK_CATEGORY_API : BACK_CATEGORY_API;

export default {
  USER: USER_API,
  CATEGORY: CATEGORY_API,
  SUBSCRIPTION: SUBSCRIPTION_API,
  CHALLENGE: CHALLENGE_API,
  DIARY: DIARY_API,
  EXPENSE: EXPENSE_API,
};
