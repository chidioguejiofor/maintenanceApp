import userService from '../services/userService';
import requestService from '../services/requestService';
import Request from '../models/Request';

export default class DummyData {
  static addUser(user) {
    userService.createUser(user);
  }

  static addDummyRequests() {
    const obj = new Request('Adannnanana', 'abcabcabcabcacb', 'locationsss', '121323njno3o2nnon');
    for (let i = 0; i < 100; i += 1) {
      requestService.makeRequest(obj);
    }
  }
}
