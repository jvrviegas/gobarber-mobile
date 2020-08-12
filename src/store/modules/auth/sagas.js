import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as Toast from '~/components/Toast';

import { signInSuccess, signFailure } from './actions';

import api from '~/services/api';

export function* signIn({ payload }) {
  try {
    Toast.loading(true);
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (user.provider) {
      Toast.loading(false);
      Toast.error('O usuário não pode ser um prestador de serviços');
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    Toast.loading(false);
    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch (error) {
    Toast.loading(false);
    Toast.error(error.response.data.error);
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    Toast.loading(true);
    const { name, email, password } = payload;

    yield call(api.post, 'users', {
      name,
      email,
      password,
    });
    Toast.loading(false);
    Toast.success('Cadastro realizado com sucesso');
    // history.push('/');
  } catch (error) {
    Toast.loading(false);
    Toast.error(error.response.data.error);

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
