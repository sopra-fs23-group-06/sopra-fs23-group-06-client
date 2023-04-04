/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.lobbyCode = null;
    this.players = null
    Object.assign(this, data);
  }
}
export default Lobby;
