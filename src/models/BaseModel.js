import { Model, Attribute, ForeignKey, ManyToMany, OneToOne } from 'redux-orm';
import i from 'inflection';

class BaseModel extends Model {
  static getFormModel(model) {
    const formModel = {
      relationshipNames: [],
    };

    Object.entries(this.fields).forEach(([key, value]) => {
      const isKey =
        value instanceof ForeignKey ||
        value instanceof ManyToMany ||
        value instanceof OneToOne;
      if (isKey) {
        formModel.relationshipNames.push(key);
      }
      if (model) {
        if (isKey) {
          if (value instanceof ManyToMany) {
            formModel[key] = model[key].map(item => item.id);
          } else {
            formModel[key] = model[key].id;
          }
        } else {
          formModel[key] = model[key];
        }
      } else if (value.getDefault) {
        formModel[key] = value.getDefault();
      } else if (isKey && value instanceof ManyToMany) {
        formModel[key] = [];
      } else {
        formModel[key] = null;
      }
    });

    if (this.reverseFields) {
      Object.entries(this.reverseFields).forEach(([key, value]) => {
        formModel.relationshipNames.push(key);

        if (model) {
          if (value.multiple) {
            formModel[key] = model[key].map(item => item.id);
          } else {
            formModel[key] = model[key].id;
          }
        } else if (value.getDefault) {
          formModel[key] = value.getDefault();
        } else if (value.multiple) {
          formModel[key] = [];
        } else {
          formModel[key] = null;
        }
      });
    }

    formModel.type = i.camelize(this.modelName, false);

    return formModel;
  }

  static getRelationshipType(relationshipName) {
    const reverseFields = this.reverseFields || {};
    const relationships = Object.entries(this.fields)
      // eslint-disable-next-line no-unused-vars
      .filter(([key, value]) => !(value instanceof Attribute))
      .reduce((acc, [key, value]) => {
        const newVal = {
          type: value.toModelName,
        };

        if (value instanceof ManyToMany) {
          newVal.multiple = true;
        }

        return {
          ...acc,
          [key]: newVal,
        };
      }, reverseFields);

    return relationships[relationshipName];
  }
}

export default BaseModel;
