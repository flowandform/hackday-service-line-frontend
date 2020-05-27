import { ORM, createSelector } from 'redux-orm';
import * as Models from 'models';
import { useStore } from 'react-redux';
import i from 'inflection';

const orm = new ORM({
  stateSelector: state => state.orm,
});

orm.register(...Object.values(Models));

export default orm;

export const useOrm = () => {
  const store = useStore();
  return orm.session(store.getState().orm);
};

const getObjectLayout = splitFields => {
  return splitFields.reduce((result, fieldSet) => {
    const obj = {
      ...result,
    };

    let workObject = obj;
    fieldSet.forEach(field => {
      workObject[field] = {
        ...workObject[field],
      };

      workObject = workObject[field];
    });

    return obj;
  }, {});
};

const getObjectFromLayout = (session, modelItem, layout) => {
  return Object.entries(layout).reduce((result, [key, value]) => {
    if (!modelItem) {
      return result;
    }

    if (Object.keys(value).length === 0) {
      if (key === 'ref') {
        return {
          ...result,
          ...modelItem.ref,
        };
      }
      return {
        ...result,
        [key]: modelItem[key],
      };
    }

    const modelName = i.camelize(modelItem.type);

    if (session[modelName].getRelationshipType(key).multiple) {
      return {
        ...result,
        [key]: modelItem[key]
          .toModelArray()
          .map(innerItem => getObjectFromLayout(session, innerItem, value)),
      };
    }

    return {
      ...result,
      [key]: getObjectFromLayout(session, modelItem[key], value),
    };
  }, {});
};

const getObjectFromFields = (session, modelItem, fields) => {
  const splitFields = fields.map(f => f.split('.'));

  const layout = getObjectLayout(splitFields);

  return getObjectFromLayout(session, modelItem, layout);
};

// ref is used to paste the whole model reference, any other specific use will just get that field
// example use
// createSimpleSelector('serviceRequest', [
//   'ref',
//   'author.ref',
//   'author.person.ref',
//   'author.person.name',
//   'location.ref',
//   'company.ref',
//   'comments.ref',
//   'comments.author.person.name',
// ]);

export const createSimpleSelector = (modelName, fields) => {
  return createSelector(
    orm,
    (state, id) => {
      if (typeof id === 'undefined') {
        return null;
      }

      return id;
    },
    (state, id, order) => order,
    (session, idArg, orderArg) => {
      if (idArg === null || Array.isArray(idArg)) {
        let results = session[modelName]
          .all()
          .filter(modelItem => idArg === null || idArg.includes(modelItem.id));

        if (orderArg) {
          results = results.orderBy(
            orderArg.map(o => o.field),
            orderArg.map(o => o.asc)
          );
        }

        return results
          .toModelArray()
          .map(modelItem => getObjectFromFields(session, modelItem, fields));
      }

      const modelItem = session[modelName]
        .all()
        .filter(mItem => mItem.id === idArg)
        .first();

      if (modelItem) {
        return getObjectFromFields(session, modelItem, fields);
      }

      return null;
    }
  );
};

// Same as simple, but gets filtered by the field in the second row
// example use
// createFilteredSelector('Comment', 'serviceRequest', [
//   'ref',
//   'author.ref',
//   'author.person.ref',
//   'author.person.name',
//   'location.ref',
//   'company.ref',
//   'comments.ref',
//   'comments.author.person.name',
// ]);

export const createFilteredSelector = (modelName, filterField, fields) => {
  return createSelector(
    orm,
    (state, filterValue) => {
      if (typeof filterValue === 'undefined') {
        throw new Error(
          `Must have a value for ${filterField} as second argument`
        );
      }

      return filterValue;
    },
    (state, filterValue, order) => order,
    (session, filterValueArg, orderArg) => {
      let results = session[modelName]
        .all()
        .filter(modelItem =>
          Array.isArray(filterValueArg)
            ? filterValueArg.includes(modelItem[filterField])
            : modelItem[filterField] === filterValueArg
        );

      if (orderArg) {
        results = results.orderBy(
          orderArg.map(o => o.field),
          orderArg.map(o => o.asc)
        );
      }

      return results
        .toModelArray()
        .map(modelItem => getObjectFromFields(session, modelItem, fields));
    }
  );
};
