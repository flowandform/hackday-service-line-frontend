import i from 'inflection';

function flatten(relationship) {
  if (!relationship.data) {
    return null;
  }

  if (Array.isArray(relationship.data)) {
    return relationship.data.map(d => d.id);
  }

  return relationship.data.id;
}

function flatRelationships(relationships) {
  return Object.entries(relationships)
    .map(([key, value]) => {
      return { [key]: flatten(value) };
    })
    .reduce(
      (acc, cur) => {
        return { ...acc, ...cur };
      },
      { relationshipNames: Object.keys(relationships) }
    );
}

function normalize(data) {
  if (!data) {
    return undefined;
  }

  if (Array.isArray(data)) {
    return data.map(d => normalize(d));
  }

  let attrAndRel = {};

  if (data.attributes) {
    attrAndRel = {
      ...attrAndRel,
      ...data.attributes,
      ...data.meta,
    };
  }

  if (data.relationships) {
    attrAndRel = {
      ...attrAndRel,
      ...flatRelationships(data.relationships),
    };
  }

  return {
    id: data.id,
    type: data.type,
    ...attrAndRel,
  };
}

export function deserialize(body) {
  const { links, meta, data, included } = body;

  const result = {
    links,
    meta,
    data: normalize(data),
    included: normalize(included),
  };

  return result;
}

function denormalize(data, Models) {
  const object = {
    type: i.camelize(data.type, true),
  };

  const shallow = { ...data };
  if (shallow.id || shallow.id === null) {
    delete shallow.id;
  }
  if (shallow.type) {
    delete shallow.type;
  }

  if (shallow.relationshipNames) {
    data.relationshipNames.forEach(name => {
      delete shallow[name];
    });
    delete shallow.relationshipNames;
  }

  object.attributes = shallow;
  if (data.id && data.id !== null) {
    object.id = data.id;
  }

  if (data.relationshipNames) {
    const Model = Models[i.camelize(data.type)];
    object.relationships = {};

    data.relationshipNames.forEach(name => {
      const type = Model.getRelationshipType(name);

      if (type.multiple) {
        if (data[name] && data[name] !== null) {
          object.relationships[name] = {
            data: data[name].map(id => {
              return {
                type: i.camelize(type.type, true),
                id,
              };
            }),
          };
        }
      } else if (data[name] && data[name] !== null) {
        object.relationships[name] = {
          data: {
            type: i.camelize(type.type, true),
            id: data[name],
          },
        };
      }
    });
  }

  return object;
}

export function serialize(model, Models) {
  const result = {
    data: denormalize(model, Models),
  };

  return result;
}
