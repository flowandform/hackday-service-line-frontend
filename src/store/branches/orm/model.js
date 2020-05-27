import i from 'inflection';

export default (Model, session, action) => {
  switch (action.type) {
    case `INDEX_${Model.modelName.toUpperCase()}`:
      if (action.payload.data?.length) {
        action.payload.data.forEach(p => {
          Model.upsert(p);
        });
      }

      if (action.payload.included?.length) {
        action.payload.included.forEach(p => {
          session[i.camelize(p.type)].upsert(p);
        });
      }
      break;
    case `UPSERT_${Model.modelName.toUpperCase()}`:
      if (action.payload.data) {
        Model.upsert(action.payload.data);
      }

      if (action.payload.included?.length) {
        action.payload.included.forEach(p => {
          session[i.camelize(p.type)].upsert(p);
        });
      }
      break;
    case `CREATE_${Model.modelName.toUpperCase()}`:
      if (action.payload.data) {
        Model.create(action.payload.data);
      }

      if (action.payload.included?.length) {
        action.payload.included.forEach(p => {
          session[i.camelize(p.type)].upsert(p);
        });
      }
      break;
    case `DELETE_${Model.modelName.toUpperCase()}`:
      if (action.payload.id) {
        Model.withId(action.payload.id).delete();
      }
      break;
    default:
      break;
  }
};
