import { updateUserBadges } from '../api/users.api';

export const checkNewDay = (setNewBadges) => {
  setTimeout(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const lastConnection = localStorage.getItem('lastConnectionDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastConnection !== today) {
      localStorage.setItem('lastConnectionDate', today);

      try {
        const response = await updateUserBadges();
        const { badges } = response.data;

        if (badges && badges.length > 0) {
          setNewBadges(badges);
        }
      } catch (error) {
        console.error('Error al actualizar los badges:', error);
      }
    }
  }, 5000);
};
