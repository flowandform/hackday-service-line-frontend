import { attr, oneToOne, fk } from 'redux-orm';
import BaseModel from './BaseModel';

class User extends BaseModel {
  toString() {
    return `User: ${this.id}`;
  }
  // Declare any static or instance methods you need.
}
User.modelName = 'User';

User.fields = {
  type: attr(),
  id: attr(),
  email: attr(),
  role: attr(),
};

User.reverseFields = {};

export default User;
