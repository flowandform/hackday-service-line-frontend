import modelReducer from './model';

export default (session, state, action) => {
  const { Service } = session;

  modelReducer(Service, session, action);

  switch (action.type) {
    default:
      break;
  }
};
