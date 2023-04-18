/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.lobby = null;
    this.username = null;
    this.cards = null;
    this.bid = null;
    Object.assign(this, data);
  }
}
export default User;
