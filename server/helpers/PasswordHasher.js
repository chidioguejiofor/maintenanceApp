import sha512 from 'sha512';

const salt = process.env.SALT;

/**
 * This helper function salts an unhashed password and returns the result
 * @param {string} password the new unsalted password to be salted
 * @returns a string containing the salted password
 */
function saltPassword(password) {
  return salt + password + salt;
}
/**
 * A passwordHasher contains logic for hashing a password and comparing an unhashed password
 * with a hashed password. The logic in this app should be used when creating a new user
 * be it client or engineer
 */
export default class PasswordHasher {
  /**
     * This method hashes the password passed in its argument using complex algorithm
     * and returns the hashed password
     * @param {string} password the new unhashed passsword
     *
     * @returns a string containing the hashed password
     */
  static hash(password) {
    return sha512(salt + saltPassword(password) + salt);
  }

  /**
   * This compares an unhashed password to a hashed password and returns a boolean of
   * the result of the comparison
   * @param {string} hashed
   * @param {string} unhashed
   * @returns a boolean that is true if the comparison passed
   */
  static compare(hashed, unhashed) {
    return sha512(saltPassword(unhashed)) === hashed;
  }
}
