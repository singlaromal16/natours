import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const results = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (results.data.status === 'success') {
      showAlert('success', `${type.toLowerCase()} updated successfully!!`);
    }
    console.log(results);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data?.message);
  }
};
