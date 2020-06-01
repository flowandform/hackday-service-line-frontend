import i from 'inflection';
import { generateResourceURL } from './utils';

export function index({ api, promise }, modelName, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'GET' };

  const modelNames = modelName.split('.');
  const [mName, related] = modelNames;

  return api.apiCall(
    {
      methodName: 'index',
      name: related || mName,
    },
    generateResourceURL(o.hostUrl, {
      resource: mName,
      id: o.id,
      includes: o?.includes,
      related,
      params: {
        [encodeURIComponent('page[size]')]: o?.perPage || o?.default?.perPage,
        [encodeURIComponent('page[number]')]: o?.page,
        ...o?.params,
      },
    }),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch({
          type: `INDEX_${mName.toUpperCase()}`,
          payload: body,
        });

        if (body?.data?.length) {
          promise.resolve(body);
        }
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}

export function get({ api, promise }, model, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'GET' };

  let m = model;
  let modelName;
  if (typeof model === 'string') {
    m = {
      id: o.id,
    };

    modelName = model;
  } else {
    modelName = i.camelize(model.type);
  }

  return api.apiCall(
    {
      methodName: 'get',
      name: modelName,
      id: m.id,
    },
    generateResourceURL(o.hostUrl, {
      resource: modelName,
      id: m.id,
      includes: o && o.includes,
      params: {
        ...o?.params,
      },
    }),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch({
          type: `UPSERT_${modelName.toUpperCase()}`,
          payload: body,
        });

        promise.resolve(body?.data?.id);
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}

export function create({ api, promise }, model, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'POST' };
  fo.body = api.serialize(model);

  return api.apiCall(
    {
      methodName: 'post',
      name: i.camelize(model.type),
    },
    generateResourceURL(o.hostUrl, {
      resource: i.camelize(model.type),
      includes: o?.includes,
      params: {
        ...o?.params,
      },
    }),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch({
          type: `CREATE_${model.type.toUpperCase()}`,
          payload: body,
        });

        promise.resolve(body?.data?.id);
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}

export function update({ api, promise }, model, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'PATCH' };
  fo.body = api.serialize(model);

  return api.apiCall(
    {
      methodName: 'post',
      name: i.camelize(model.type),
    },
    generateResourceURL(o.hostUrl, {
      resource: i.camelize(model.type),
      includes: o?.includes,
      id: model.id,
      params: {
        ...o?.params,
      },
    }),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch({
          type: `UPSERT_${model.type.toUpperCase()}`,
          payload: body,
        });

        promise.resolve(body?.data?.id);
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}

export function destroy({ api, promise }, model, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'DELETE' };

  let m = model;
  let modelName;
  if (typeof model === 'string') {
    m = {
      id: opts.id,
    };

    modelName = model;
  } else {
    modelName = i.camelize(model.type);
  }

  return api.apiCall(
    {
      methodName: 'delete',
      name: modelName,
      id: m.id,
    },
    generateResourceURL(o.hostUrl, {
      resource: modelName,
      includes: o?.includes,
      id: m.id,
      params: {
        ...o?.params,
      },
    }),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch({
          type: `DELETE_${modelName.toUpperCase()}`,
          payload: {
            id: m.id,
          },
        });

        promise.resolve(m.id);
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}
