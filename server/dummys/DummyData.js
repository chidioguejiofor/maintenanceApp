import userService from '../services/userService';

export default class DummyData {
  static addUser(user) {
    userService.createUser(user);
  }
}
