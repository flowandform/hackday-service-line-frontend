import modelReducer from './model';

export default (session, state, action) => {
  const { User } = session;

  modelReducer(User, session, action);

  switch (action.type) {
    default:
      break;
  }
};
