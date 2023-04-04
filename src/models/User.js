/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.lobby = null;
    this.username = null;
    Object.assign(this, data);
  }
}
export default User;
