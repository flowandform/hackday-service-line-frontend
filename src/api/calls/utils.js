import i from 'inflection';
import buildURL from 'build-url';

export function generateFixedURL(baseUrl, fixedUrl) {
  return buildURL(baseUrl, {
    path: fixedUrl,
  });
}

export function generateResourceURL(
  baseUrl,
  { resource, id, params, hash, includes, related }
) {
  return buildURL(baseUrl, {
    path: `${i.tableize(resource)}${id ? `/${id}` : ''}${
      related ? `/${related}` : ''
    }`,
    hash,
    queryParams: {
      ...params,
      include: includes,
    },
  });
}
