import userService from '../services/userService';
import requestService from '../services/requestService';
import Request from '../models/Request';

export default class DummyData {
  static addUser(user) {
    userService.createUser(user);
  }

  static getDummyRequestId() {
    const obj = new Request('Adannnanana', 'abcabcabcabcacb', 'locationsss', '121323njno3o2nnon', 'image.png');
    for (let i = 0; i < 100; i += 1) {
      requestService.makeRequest(obj);
    }
    return requestService.getAll().respObj.data[0].id;
  }
}
