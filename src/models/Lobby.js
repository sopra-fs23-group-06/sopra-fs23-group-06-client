/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.lobbyCode = null;
    this.players = null
    Object.assign(this, data);
  }
}
export default Lobby;
