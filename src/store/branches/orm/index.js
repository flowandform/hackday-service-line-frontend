import ormLib from 'orm';

const reducers = [];

export function orm(dbState, action) {
  if (action.type === 'AUTH_LOG_OUT') {
    return ormLib.session().state;
  }

  const session = ormLib.session(dbState);

  reducers.forEach(reducer => {
    reducer(session, dbState, action);
  });

  return session.state;
}
