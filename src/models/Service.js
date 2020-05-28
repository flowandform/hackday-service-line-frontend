import { attr, oneToOne, fk } from 'redux-orm';
import BaseModel from './BaseModel';

class Service extends BaseModel {
  toString() {
    return `Service: ${this.id}`;
  }
  // Declare any static or instance methods you need.
}
Service.modelName = 'Service';

Service.fields = {
  type: attr(),
  id: attr(),
  category: attr(),
  description: attr(),
  duration: attr(),
  group_size: attr(),
  minimum_requirments: attr(),
  price: attr(),
  starts_at: attr(),
  title: attr(),
  createdAt: attr(),
  modifiedAt: attr(),
  owner: fk('User', 'service'),
};

Service.reverseFields = {};

export default Service;
