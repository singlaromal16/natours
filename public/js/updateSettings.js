import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const results = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (results.data.status === 'success') {
      showAlert('success', `${type.toLowerCase()} updated successfully!!`);
    }
  } catch (err) {
    showAlert('error', err.response.data?.message);
  }
};
