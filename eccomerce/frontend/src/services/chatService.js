import API from './api';

export const sendShoppingMessage = async (message, history) => {
  const response = await API.post('/chat', { message, history });
  return response.data;
};
