import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'traffic_violation_user_id';

export const getUserId = (): string | null => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(USER_ID_KEY, userId);
    }
    
    return userId;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};
