// === Safe disc helpers (injected) ===
(function(){
  if (typeof window === 'undefined') return;
  if (!window.__discHelpersInjected) {
    window.__discHelpersInjected = true;

    window.ballDiscIndex = null;

    window.refreshDiscIndexes = function refreshDiscIndexes(){
      try {
        window.ballDiscIndex = null;
        const count = (room.getDiscCount && room.getDiscCount()) || 0;
        for (let i = 0; i < count; i++) {
          const p = room.getDiscProperties(i);
          if (p && Array.isArray(p.cGroup) && p.cGroup.indexOf("ball") !== -1) {
            window.ballDiscIndex = i;
            break;
          }
        }
      } catch (e) {
        // swallow
      }
    };

    window.getSafeDiscProps = function getSafeDiscProps(index){
      try {
        if (index == null) return null;
        const p = room.getDiscProperties(index);
        return p || null;
      } catch (e) {
        return null;
      }
    };

    window.ballR = function ballR(){
      let p = window.getSafeDiscProps(window.ballDiscIndex);
      if (!p) {
        window.refreshDiscIndexes();
        p = window.getSafeDiscProps(window.ballDiscIndex);
        if (!p) return 0;
      }
      return typeof p.radius === 'number' ? p.radius : 0;
    };

    // Hook stadium / game lifecycle to refresh indices safely
    try {
      const __orig_onStadiumChange = room.onStadiumChange;
      room.onStadiumChange = function(newName, byPlayer){
        if (typeof __orig_onStadiumChange === 'function') {
          try { __orig_onStadiumChange.call(room, newName, byPlayer); } catch (e) {}
        }
        setTimeout(window.refreshDiscIndexes, 50);
      };
    } catch (e) {}

    try {
      const __orig_onGameStart = room.onGameStart;
      room.onGameStart = function(byPlayer){
        if (typeof __orig_onGameStart === 'function') {
          try { __orig_onGameStart.call(room, byPlayer); } catch (e) {}
        }
        setTimeout(window.refreshDiscIndexes, 50);
      };
    } catch (e) {}

    try {
      const __orig_onGameStop = room.onGameStop;
      room.onGameStop = function(byPlayer){
        if (typeof __orig_onGameStop === 'function') {
          try { __orig_onGameStop.call(room, byPlayer); } catch (e) {}
        }
        window.ballDiscIndex = null;
      };
    } catch (e) {}

    // Initial refresh just in case
    setTimeout(window.refreshDiscIndexes, 100);
  }
})();
// === End safe disc helpers ===

// === Helper: ballProps() returns safe ball disc properties or null ===
(function(){
  if (typeof window !== 'undefined') {
    window.ballProps = function ballProps(){
      let p = window.getSafeDiscProps(window.ballDiscIndex);
      if (!p) {
        window.refreshDiscIndexes();
        p = window.getSafeDiscProps(window.ballDiscIndex);
      }
      if (!p) {
        // fallback to index 0 if engine still uses it as ball
        p = window.getSafeDiscProps(0);
      }
      return p || null;
    };
  }
})();
// === end helper ===

/* VARIABLES */

/* ROOM */

const roomName = '🏆⚽ |Futsal 3v3| Pod Sraczem | ⚽🏆';
const maxPlayers = 18;
const roomPublic = true;
const token = "thr1.AAAAAGjmUdI8BRNsGPSJoQ.ktgrlLoSdj0"; // Insert token here

var roomWebhook = 'https://discord.com/api/webhooks/1417845044651626566/vZdV_vQDAU1n4dcwJnTWKUYYVQZExQrRd0HoC8gvXgQkIupqHfZplwt_ZtYRzVfsNxmT'; // this webhook is used to send the details of the room (chat, join, leave) ; it should be in a private discord channel
var gameWebhook = 'https://discord.com/api/webhooks/1417844778112122973/eTZ_4hNdpMXgzUR68Brw9bQbyzhhptNj3oh-2SS8BPjQLlFmX5UPbzQqV4DaJgcxWjDx'; // this webhook is used to send the summary of the games ; it should be in a public discord channel
var fetchRecordingVariable = true;
var timeLimit = 3;
var scoreLimit = 3;

var gameConfig = {
    roomName: roomName,
    maxPlayers: maxPlayers,
    public: roomPublic,
    geo: { code: "PL", lat: 51.6650, lon: 19.4200 },
    noPlayer: true,
}

if (typeof token == 'string' && token.length == 39) {
    gameConfig.token = token;
}

var room = HBInit(gameConfig);

const trainingMap = '{"name":"8 Ball Pool edition Alf [\u029c\u1d00x\u1d0d\u1d0f\u1d05s.\u1d04\u1d0f\u1d0d]","width":380,"height":200,"canBeStored":true,"spawnDistance":330,"maxViewWidth":1200,"cameraFollow":"player","bg":{"type":"","color":"000000","width":0,"height":0,"kickOffRadius":0,"cornerRadius":0,"borderRadius":0},"vertexes":[{"x":-300,"y":129.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-300,"y":-129.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-323,"y":148,"bCoef":3,"cMask":["wall"],"color":"881717"},{"x":-323,"y":-148,"bCoef":-3,"cMask":["wall"],"color":"881717"},{"x":323,"y":148,"bCoef":-3,"cMask":["wall"],"color":"881717"},{"x":323,"y":-148,"bCoef":3,"cMask":["wall"],"color":"881717"},{"x":-12.5,"y":173,"bCoef":3,"cMask":["wall"],"color":"881717"},{"x":-12.5,"y":-173,"bCoef":-3,"cMask":["wall"],"color":"881717"},{"x":12.5,"y":173,"bCoef":-3,"cMask":["wall"],"color":"881717"},{"x":12.5,"y":-173,"bCoef":3,"cMask":["wall"],"color":"881717"},{"x":-298,"y":173,"bCoef":-3,"cMask":["wall"],"color":"881717"},{"x":-298,"y":-173,"bCoef":0,"cMask":["wall"],"color":"881717"},{"x":298,"y":173,"bCoef":3,"cMask":["wall"],"color":"881717"},{"x":298,"y":-173,"bCoef":-3,"cMask":["wall"],"color":"881717"},{"x":-306,"y":135.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-306,"y":-135.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-303,"y":132.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-303,"y":-132.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":0,"y":160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","radius":5.5},{"x":0,"y":-160,"bCoef":0,"cMask":["ball"],"color":"A9BA9C","radius":5.5},{"x":-323,"y":160.5,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":-323,"y":-160.5,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":323,"y":160.5,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":323,"y":-160.5,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":-310.5,"y":173,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":-310.5,"y":-173,"bCoef":3,"cMask":["wall"],"color":"881717","vis":true},{"x":310.5,"y":173,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":310.5,"y":-173,"bCoef":0,"cMask":["wall"],"color":"881717","vis":true},{"x":-309,"y":173,"bCoef":1,"cMask":["wall"],"color":"3E6B34"},{"x":-309,"y":-173,"bCoef":1,"cMask":["wall"],"color":"3E6B34"},{"x":-312,"y":173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":-312,"y":-173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":-315,"y":173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":-315,"y":-173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":-318,"y":171,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":-318,"y":-171,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":-321,"y":168,"bCoef":1,"cMask":["wall"],"color":"882828"},{"x":-321,"y":-168,"bCoef":1,"cMask":["wall"],"color":"882828"},{"x":309,"y":173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":309,"y":-173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":312,"y":173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":312,"y":-173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":315,"y":173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":315,"y":-173,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":318,"y":171,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":318,"y":-171,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":321,"y":168,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":321,"y":-168,"bCoef":1,"cMask":["wall"],"color":"881717"},{"x":320,"y":159,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":159,"bCoef":1,"cMask":["wall"]},{"x":320,"y":162,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":162,"bCoef":1,"cMask":["wall"]},{"x":320,"y":165,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":165,"bCoef":1,"cMask":["wall"]},{"x":320,"y":168,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":168,"bCoef":1,"cMask":["wall"]},{"x":310,"y":171,"bCoef":1,"cMask":["wall"]},{"x":-316,"y":171,"bCoef":1,"cMask":["wall"]},{"x":320,"y":-159,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":-159,"bCoef":1,"cMask":["wall"]},{"x":320,"y":-162,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":-162,"bCoef":1,"cMask":["wall"]},{"x":320,"y":-165,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":-165,"bCoef":1,"cMask":["wall"]},{"x":320,"y":-168,"bCoef":1,"cMask":["wall"]},{"x":-320,"y":-168,"bCoef":1,"cMask":["wall"]},{"x":315,"y":-171,"bCoef":1,"cMask":["wall"]},{"x":-316,"y":-171,"bCoef":1,"cMask":["wall"]},{"x":-279.5,"y":-150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-282.5,"y":-153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-285.5,"y":-156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-19.5,"y":-150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-16.5,"y":-153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-13.5,"y":-156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":19.5,"y":-150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":16.5,"y":-153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":13.5,"y":-156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":279.5,"y":-150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":282.5,"y":-153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":285.5,"y":-156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":279.5,"y":150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34","curve":0},{"x":282.5,"y":153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":285.5,"y":156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":19.5,"y":150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":16.5,"y":153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":13.5,"y":156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34","radius":5.5},{"x":-19.5,"y":150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34","curve":0},{"x":-16.5,"y":153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-13.5,"y":156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34","radius":5.5},{"x":-279.5,"y":150,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-282.5,"y":153,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-285.5,"y":156,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":300,"y":-129.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":300,"y":129.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":306,"y":-135.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":306,"y":135.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":303,"y":-132.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":303,"y":132.5,"bCoef":0.33,"cMask":["wall"],"color":"3E6B34"},{"x":-300,"y":-75,"bCoef":0.63,"cMask":[""],"color":"3E6B34"},{"x":-300,"y":75,"bCoef":0.63,"cMask":[""],"color":"3E6B34"},{"x":-225,"y":-150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":-75,"y":-150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":75,"y":-150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":225,"y":-150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":300,"y":-75,"bCoef":0.63,"cMask":[""],"color":"3E6B34"},{"x":300,"y":75,"bCoef":0.63,"cMask":[""],"color":"3E6B34"},{"x":225,"y":150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":75,"y":150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":-75,"y":150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":-225,"y":150,"bCoef":0.63,"cMask":[""],"color":"3E6B34","curve":0},{"x":-310,"y":-75,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":310,"y":-75,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":310,"y":0,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":-310,"y":75,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":310,"y":75,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":-225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-225,"y":160,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":-75,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-75,"y":160,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":75,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":75,"y":160,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":150,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":150,"y":160,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":225,"y":160,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":75,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-150,"y":160,"bCoef":0,"cMask":["ball"],"color":"ebebe0"},{"x":-150,"y":-148,"bCoef":1.6,"cMask":["wall"],"cGroup":["c0"],"color":"080808"},{"x":-150,"y":148,"bCoef":1.6,"cMask":["wall"],"cGroup":["c0"],"color":"080808"},{"x":370,"y":-200,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"vis":false,"bias":25},{"x":370,"y":200,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"vis":false,"bias":25},{"x":75,"y":-165.5,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":75,"y":-165.4,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":150,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":150,"y":-165.5,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":150,"y":-165.4,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":225,"y":-165.5,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":225,"y":-165.4,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-75,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-75,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-75,"y":-165.5,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-75,"y":-165.4,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-150,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-150,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-150,"y":-165.5,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-150,"y":-165.4,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-225,"y":-160,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-225,"y":-165.5,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-225,"y":-165.4,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":225,"y":166,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":225,"y":166.1,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":150,"y":166,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":150,"y":166.1,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-150,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-150,"y":166,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-150,"y":166.1,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-75,"y":166,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-75,"y":166.1,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":75,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":75,"y":166,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":75,"y":166.1,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-225,"y":171.5,"bCoef":0,"cMask":["ball"],"color":"3E6B34","curve":330},{"x":-225,"y":166,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-225,"y":166.1,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-316.4,"y":0,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-316.5,"y":0,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-316.4,"y":90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-316.5,"y":90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-310,"y":-75,"bCoef":0,"cMask":["ball"],"color":"3E6B34"},{"x":-316.4,"y":-90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-316.5,"y":-90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":315.1,"y":0,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":315,"y":0,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":315.1,"y":90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":315,"y":90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":315.1,"y":-90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":315,"y":-90,"bCoef":0,"cGroup":["c0"],"curve":330,"color":"ffffff"},{"x":-320,"y":-173,"bCoef":0,"cMask":["c3"],"cGroup":["c2"]},{"x":320,"y":-173,"bCoef":0,"cMask":["c3"],"cGroup":["c2"]},{"x":-320,"y":173,"bCoef":0,"cMask":["c3"],"cGroup":["c2"]},{"x":320,"y":173,"bCoef":0,"cMask":["c3"],"cGroup":["c2"]},{"x":-370,"y":-200,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"vis":false,"bias":714},{"x":-370,"y":200,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"vis":false,"bias":-714},{"x":-370,"y":178,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":-714},{"x":-370,"y":-200,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"vis":false,"bias":714},{"x":-370,"y":-178,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":714},{"x":370,"y":-200,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"vis":false,"bias":-714},{"x":370,"y":-178,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":-714},{"x":370,"y":200,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"vis":false,"bias":714},{"x":370,"y":178,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":714},{"x":370.5,"y":0,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":200},{"x":381.5,"y":0,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":200},{"x":-381.5,"y":0,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":200},{"x":-370,"y":0,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":200},{"x":-53.19057229924854,"y":27.076190476190476,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":53.03595417776855,"y":27.076190476190476,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":-0.07730906073998672,"y":-50.15026455026454,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":-22.207835410118527,"y":11.127248677248677,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":9.737431593726562,"y":-34.83253968253968,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":-22.207835410118527,"y":11.127248677248677,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":42.49061059080684,"y":11.127248677248677,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":17.62711201876286,"y":11.127248677248677,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":-3.08706064425547,"y":-17.580846560846553,"cMask":["score"],"cGroup":["kick"],"curve":0,"color":"090909"},{"x":-8.044298546516263,"y":-9.018783068783074,"cMask":["score"],"cGroup":["kick"],"color":"090909"},{"x":7.004459371061145,"y":11.127248677248677,"cMask":["score"],"cGroup":["kick"],"color":"090909"},{"x":-220,"y":-10,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"080808","curve":-180},{"x":-220,"y":10,"bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"080808","curve":-180}],"segments":[{"v0":2,"v1":3,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"],"x":-330},{"v0":11,"v1":7,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"],"y":-182},{"v0":9,"v1":13,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"],"y":-182},{"v0":5,"v1":4,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"],"x":330},{"v0":12,"v1":8,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"],"y":182},{"v0":6,"v1":10,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"],"y":182},{"v0":14,"v1":15,"curve":0,"vis":true,"color":"3E6B34","bCoef":1,"cMask":["wall"],"x":-313},{"v0":1,"v1":15,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":0,"v1":14,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":16,"v1":17,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"],"x":-310},{"v0":24,"v1":20,"curve":90,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":21,"v1":25,"curve":90,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":27,"v1":23,"curve":90,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":22,"v1":26,"curve":90,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":20,"v1":2,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":24,"v1":10,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":3,"v1":21,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":25,"v1":11,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":7,"v1":9,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":13,"v1":27,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":23,"v1":5,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":4,"v1":22,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":26,"v1":12,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":8,"v1":6,"curve":0,"vis":true,"color":"882020","bCoef":0,"cMask":["wall"]},{"v0":28,"v1":29,"curve":0,"vis":true,"color":"3E6B34","bCoef":1,"cMask":["wall"],"x":-163},{"v0":30,"v1":31,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":-166},{"v0":32,"v1":33,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":-169},{"v0":34,"v1":35,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":-172},{"v0":36,"v1":37,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":-175},{"v0":39,"v1":38,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":469},{"v0":41,"v1":40,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":472},{"v0":43,"v1":42,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":475},{"v0":45,"v1":44,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":478},{"v0":47,"v1":46,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"x":481},{"v0":49,"v1":48,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":168},{"v0":51,"v1":50,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":171},{"v0":53,"v1":52,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":174},{"v0":55,"v1":54,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":177},{"v0":57,"v1":56,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":180},{"v0":59,"v1":58,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":-168},{"v0":61,"v1":60,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":-171},{"v0":63,"v1":62,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":-174},{"v0":65,"v1":64,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":-177},{"v0":67,"v1":66,"curve":0,"vis":true,"color":"882020","bCoef":1,"cMask":["wall"],"y":-180},{"v0":72,"v1":69,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"]},{"v0":73,"v1":70,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"],"y":165},{"v0":70,"v1":68,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":73,"v1":71,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":78,"v1":75,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"]},{"v0":79,"v1":76,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"],"y":165},{"v0":76,"v1":74,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":79,"v1":77,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":84,"v1":81,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"]},{"v0":85,"v1":82,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"],"y":165},{"v0":82,"v1":80,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":85,"v1":83,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":90,"v1":87,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"]},{"v0":91,"v1":88,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"],"y":165},{"v0":88,"v1":86,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":91,"v1":89,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":94,"v1":95,"curve":0,"vis":true,"color":"3E6B34","bCoef":1,"cMask":["wall"],"x":-313},{"v0":93,"v1":95,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":92,"v1":94,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.33,"cMask":["wall"]},{"v0":96,"v1":97,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.5,"cMask":["wall"],"x":-310},{"v0":1,"v1":98,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"x":-290},{"v0":98,"v1":99,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"x":-290},{"v0":99,"v1":0,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"x":-290},{"v0":68,"v1":100,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":-155},{"v0":100,"v1":101,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":-155},{"v0":101,"v1":71,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":-155},{"v0":74,"v1":102,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":-155},{"v0":102,"v1":103,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":-155},{"v0":103,"v1":77,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":-155},{"v0":92,"v1":104,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"x":290},{"v0":104,"v1":105,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"x":290},{"v0":105,"v1":93,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"x":290},{"v0":80,"v1":106,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":155},{"v0":106,"v1":107,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":155},{"v0":107,"v1":83,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":155},{"v0":86,"v1":108,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":155},{"v0":108,"v1":109,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":155},{"v0":109,"v1":89,"curve":0,"vis":true,"color":"3E6B34","bCoef":0.63,"cMask":["wall"],"y":155},{"v0":127,"v1":128,"curve":0,"color":"080808","bCoef":1.6,"cMask":["c1"],"cGroup":["c0"],"x":-150},{"v0":129,"v1":130,"vis":false,"color":"000000","bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":25,"x":370},{"v0":131,"v1":132,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":75},{"v0":134,"v1":135,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":150},{"v0":138,"v1":139,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":225},{"v0":142,"v1":143,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":-75},{"v0":146,"v1":147,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":-150},{"v0":151,"v1":152,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":-225},{"v0":157,"v1":158,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":225},{"v0":163,"v1":164,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":150},{"v0":169,"v1":170,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":-150},{"v0":175,"v1":176,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":-75},{"v0":181,"v1":182,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":75},{"v0":187,"v1":188,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":-225},{"v0":189,"v1":190,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":0},{"v0":191,"v1":192,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":90,"x":0},{"v0":194,"v1":195,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":-90,"x":0},{"v0":196,"v1":197,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":0,"x":0},{"v0":198,"v1":199,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":90,"x":0},{"v0":200,"v1":201,"curve":330,"vis":true,"color":"ffffff","bCoef":0,"cGroup":["c0"],"y":-90,"x":0},{"v0":206,"v1":207,"vis":false,"color":"000000","bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":-25,"x":-370},{"v0":208,"v1":207,"vis":false,"color":"000000","bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":-714,"x":-370},{"v0":210,"v1":209,"vis":false,"color":"000000","bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":714,"x":-370},{"v0":212,"v1":211,"vis":false,"color":"000000","bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":-714,"x":370},{"v0":214,"v1":213,"vis":false,"color":"000000","bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":714,"x":370},{"v0":215,"v1":216,"vis":false,"color":"000000","bCoef":0,"cMask":["c1"],"cGroup":["wall"],"bias":200,"y":0},{"v0":217,"v1":218,"vis":false,"color":"000000","bCoef":0,"cMask":["c2"],"cGroup":["wall"],"bias":200,"y":0},{"v0":219,"v1":220,"curve":0,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"],"y":15},{"v0":219,"v1":221,"curve":0,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"]},{"v0":220,"v1":221,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"]},{"v0":222,"v1":223,"curve":0,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"]},{"v0":224,"v1":225,"curve":0,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"],"y":15},{"v0":226,"v1":227,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"]},{"v0":228,"v1":229,"vis":true,"color":"090909","cMask":["score"],"cGroup":["kick"]},{"v0":230,"v1":231,"curve":-180,"vis":true,"color":"080808","bCoef":0,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"goals":[{"p0":[-323,192],"p1":[-323,-192],"team":"red"},{"p0":[323,-192],"p1":[323,192],"team":"red","vis":false},{"p0":[340,178],"p1":[-340,178],"team":"red"},{"p0":[-340,-178],"p1":[340,-178],"team":"red"}],"discs":[{"radius":9,"invMass":0.01,"pos":[-150,0],"color":"F5E1CE","bCoef":0.9,"cMask":["wall","red","blue","c3"],"cGroup":["wall","kick","score"],"damping":0.988},{"radius":5.5,"invMass":0,"pos":[-300,150],"color":"3E6B34","bCoef":-100,"cMask":["wall"],"cGroup":["wall"]},{"radius":5.5,"invMass":0,"pos":[-300,-150],"color":"171717","bCoef":-100,"cMask":["wall"],"cGroup":["wall"]},{"radius":5.5,"invMass":0,"pos":[0,158],"color":"3E6B34","bCoef":-100,"cMask":["wall"],"cGroup":["wall"]},{"radius":5.5,"invMass":0,"pos":[0,-158],"color":"171717","bCoef":-100,"cMask":["wall"],"cGroup":["wall"]},{"radius":5.5,"invMass":0,"pos":[300,150],"color":"3E6B34","bCoef":-100,"cMask":["wall"],"cGroup":["wall"]},{"radius":5.5,"invMass":0,"pos":[300,-150],"color":"3E6B34","bCoef":-100,"cMask":["wall"],"cGroup":["wall"]},{"radius":14,"pos":[0,-155],"color":"000000","cMask":["ball"],"cGroup":["ball"]},{"radius":14,"pos":[0,155],"color":"000000","cMask":["ball"],"cGroup":["ball"]},{"radius":14.5,"pos":[-299,-149],"color":"000000","cMask":["ball"],"cGroup":["ball"]},{"radius":14.5,"pos":[299,-149],"color":"000000","cMask":["ball"],"cGroup":["ball"]},{"radius":14.5,"pos":[-299,149],"color":"000000","cMask":["ball"],"cGroup":["ball"]},{"radius":14.5,"pos":[299,149],"color":"000000","cMask":["ball"],"cGroup":["ball"]},{"radius":9,"invMass":0.01,"pos":[211.95,10],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[194,0],"color":"ffffff","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","score"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[229,-20],"color":"91008D","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[177.3,-10],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[211.95,-10],"color":"B00606","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[229,20],"color":"0034C4","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99,"x":199.7653718},{"radius":9,"invMass":0.01,"pos":[194.65,-20],"color":"EBEB07","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[194.65,20],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[211.95,30],"color":"007A04","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99,"x":199.7653718},{"radius":9,"invMass":0.01,"pos":[211.95,-30],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[229,0],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99,"x":199.7653718},{"radius":9,"invMass":0.01,"pos":[229,-40],"color":"F07000","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[160,0],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[229,40],"color":"F5E1CE","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c2"],"damping":0.99},{"radius":9,"invMass":0.01,"pos":[177.3,10],"color":"5E3A34","bCoef":0.82,"cMask":["wall"],"cGroup":["wall","c1"],"damping":0.99},{"radius":6,"pos":[211.95,10],"color":"0034C4","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":6,"pos":[177.3,-10],"color":"91008D","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":6,"pos":[211.95,-30],"color":"007A04","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":6,"pos":[229,0],"color":"F07000","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99,"x":199.7653718},{"radius":6,"pos":[160,0],"color":"EBEB07","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":6,"pos":[229,40],"color":"B00606","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":6,"pos":[194.65,20],"color":"5E3A34","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":60,"invMass":65000,"pos":[-150,0],"color":"transparent","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"],"damping":0},{"radius":6.4,"pos":[194,0],"color":"000000","bCoef":0.82,"cMask":["c0"],"cGroup":["all"],"damping":0.99},{"radius":300,"invMass":1,"pos":[250,0],"color":"transparent","bCoef":-180,"cMask":["wall"],"cGroup":["c3"],"damping":1000000}],"planes":[{"normal":[-1,0],"dist":-400,"cMask":["red","blue","ball"],"_data":{"extremes":{"normal":[-1,0],"dist":-400,"canvas_rect":[-795,-300,796,300],"a":[400,-300],"b":[400,300]}}},{"normal":[0,1],"dist":-240,"cMask":["red","blue","ball"],"_data":{"extremes":{"normal":[0,1],"dist":-240,"canvas_rect":[-795,-300,796,300],"a":[-795,-240],"b":[796,-240]}}},{"normal":[1,0],"dist":-400,"cMask":["red","blue","ball"],"_data":{"extremes":{"normal":[1,0],"dist":-400,"canvas_rect":[-795,-300,796,300],"a":[-400,-300],"b":[-400,300]}}},{"normal":[0,-1],"dist":-240,"cMask":["red","blue","ball"],"_data":{"extremes":{"normal":[0,-1],"dist":-240,"canvas_rect":[-795,-300,796,300],"a":[-795,240],"b":[796,240]}}},{"normal":[0,1],"dist":-200,"bCoef":1.0e-5,"cMask":["c1"],"cGroup":["wall"],"_data":{"extremes":{"normal":[0,1],"dist":-200,"canvas_rect":[-795,-300,796,300],"a":[-795,-200],"b":[796,-200]}}},{"normal":[0,-1],"dist":-200,"bCoef":0.001,"cMask":["c1"],"cGroup":["wall"],"_data":{"extremes":{"normal":[0,-1],"dist":-200,"canvas_rect":[-795,-300,796,300],"a":[-795,200],"b":[796,200]}}},{"normal":[-1,0],"dist":-380,"bCoef":0,"cMask":["c1"],"cGroup":["wall"],"_data":{"extremes":{"normal":[-1,0],"dist":-380,"canvas_rect":[-795,-300,796,300],"a":[380,-300],"b":[380,300]}}},{"normal":[1,0],"dist":-326,"bCoef":1000000,"cMask":["c1"],"cGroup":["wall"],"_data":{"extremes":{"normal":[1,0],"dist":-326,"canvas_rect":[-795,-300,796,300],"a":[-326,-300],"b":[-326,300]}}},{"normal":[0,1],"dist":-200,"bCoef":1.0e-5,"cMask":["c2"],"cGroup":["wall"],"_data":{"extremes":{"normal":[0,1],"dist":-200,"canvas_rect":[-795,-300,796,300],"a":[-795,-200],"b":[796,-200]}}},{"normal":[0,-1],"dist":-200,"bCoef":0.001,"cMask":["c2"],"cGroup":["wall"],"_data":{"extremes":{"normal":[0,-1],"dist":-200,"canvas_rect":[-795,-300,796,300],"a":[-795,200],"b":[796,200]}}},{"normal":[1,0],"dist":-380,"bCoef":0,"cMask":["c2"],"cGroup":["wall"],"_data":{"extremes":{"normal":[1,0],"dist":-380,"canvas_rect":[-795,-300,796,300],"a":[-380,-300],"b":[-380,300]}}},{"normal":[-1,0],"dist":-326,"bCoef":1000000,"cMask":["c2"],"cGroup":["wall"],"_data":{"extremes":{"normal":[-1,0],"dist":-326,"canvas_rect":[-795,-300,796,300],"a":[326,-300],"b":[326,300]}}}],"joints":[{"d0":22,"d1":30,"strength":"rigid","color":"transparent","length":null,"bCoef":0.88,"radius":9},{"d0":23,"d1":31,"strength":"rigid","color":"transparent","length":null,"bCoef":0.88,"pos":[211.95,-30],"radius":9},{"d0":16,"d1":29,"strength":"rigid","color":"transparent","length":null,"bCoef":0.88,"radius":9},{"d0":26,"d1":33,"strength":"rigid","color":"transparent","length":null,"bCoef":0.88,"radius":9},{"d0":25,"d1":32,"strength":"rigid","color":"transparent","length":null,"bCoef":0.88,"radius":9},{"d0":20,"d1":34,"strength":"rigid","color":"transparent","length":null,"bCoef":0.88,"radius":9},{"d0":13,"d1":28,"strength":"rigid","color":"transparent","length":null},{"d0":35,"d1":0,"_length":-1.0e-59,"strength":4.9e-6,"color":"ffffff","length":-1.0e-59,"pos":[-160,0]},{"d0":14,"d1":36,"strength":"rigid","color":"transparent","length":null}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"line":{"cMask":[""],"color":"FFFFFF"},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"ballPhysics":"disc0","playerPhysics":{"kickStrength":780,"bCoef":0.15,"kickingAcceleration":0.38,"kickingDamping":0.9,"damping":0.8,"acceleration":0.1,"invMass":20,"radius":12},"redSpawnPoints":[],"blueSpawnPoints":[]}'
const classicMap = '{"name":"Vehax x2. x1 [\u029c\u1d00x\u1d0d\u1d0f\u1d05s.\u1d04\u1d0f\u1d0d]","width":510,"height":230,"cameraWidth":0,"cameraHeight":0,"maxViewWidth":0,"cameraFollow":"ball","spawnDistance":150,"redSpawnPoints":[[-250,0]],"blueSpawnPoints":[[250,0]],"canBeStored":true,"kickOffReset":"full","bg":{"color":"425370","height":200,"width":400},"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"vertexes":[{"x":-400,"y":-200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":-10},{"x":400,"y":-200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":-10},{"x":-400,"y":200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":10,"curve":0},{"x":400,"y":200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":10,"curve":0},{"x":-400,"y":70,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":10,"pos":[-400,70]},{"x":-400,"y":200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":10},{"x":400,"y":70,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":-10,"pos":[600,85]},{"x":400,"y":200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":-10},{"x":-400,"y":-200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":10},{"x":-400,"y":-70,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":10,"pos":[-400,-70]},{"x":400,"y":-200,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":-10},{"x":400,"y":-70,"bCoef":1,"cMask":["ball"],"color":"717F98","bias":-10},{"x":-435,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"717F98"},{"x":-400,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"717F98","pos":[-400,-70]},{"x":-435,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"717F98"},{"x":-400,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"717F98","pos":[-400,70]},{"x":-435,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"717F98","curve":-35},{"x":-435,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"717F98","curve":-35},{"x":435,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"717F98","curve":35},{"x":435,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"717F98","curve":35},{"x":435,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"717F98"},{"x":400,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"717F98"},{"x":435,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"717F98","curve":0},{"x":400,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"717F98","pos":[600,85],"curve":0},{"x":-400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"757FD0","pos":[-400,-70]},{"x":-400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"757FD0","pos":[-400,70]},{"x":400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"757FD0"},{"x":400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"757FD0","pos":[600,85]},{"x":0,"y":-225,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":false,"_data":{"mirror":[]}},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":false,"color":"0A1524"},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"333945"},{"x":0,"y":225,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"_data":{"mirror":[]}},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["blueKO"],"color":"333945"},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["blueKO"],"color":"0A1524"},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["redKO"],"color":"0A1524"},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO"],"color":"333945"},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"333945","vis":true},{"x":8.696301939869894,"y":-21.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":26.088905819609685,"y":-18.91483033464221,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":0,"y":31.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-26.088905819609685,"y":-18.91483033464221,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-8.696301939869894,"y":-21.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":46.307434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-44.833333333333336,"y":-33.666666666666664,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":100,"color":"333945"},{"x":44.833333333333336,"y":-33.666666666666664,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":100,"color":"333945"},{"x":-34,"y":-31,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":90,"color":"333945"},{"x":34,"y":-31,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":90,"color":"333945"},{"x":-2.5,"y":53.807434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-2,"y":55.807434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":43.32891343843404,"y":-24.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-0.5,"y":58.807434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":46.32891343843404,"y":-26.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0.5,"y":50.807434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-39.82891343843404,"y":-22.76298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-3,"y":51.807434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-45.82891343843404,"y":-25.76298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-1,"y":51.307434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-42.82891343843404,"y":-24.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-36.5,"y":-32,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":95,"color":"333945"},{"x":36,"y":-32.5,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":95,"color":"333945"},{"x":-38.5,"y":-33,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":100,"color":"333945"},{"x":37.5,"y":-33,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":100,"color":"333945"},{"x":40.5,"y":-34,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":95,"color":"333945"},{"x":8.696301939869894,"y":-21.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":68.0918947430112,"y":-42.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":79.3533815858876,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-8.696301939869894,"y":-21.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-68.70078532497217,"y":-42.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":78.9185664888941,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":46.307434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":61.52596260915432,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-50.0906991736506,"y":-27.61113227451211,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-37.82891343843404,"y":-23.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":40.82891343843404,"y":-23.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":46.307434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":0,"y":61.52596260915432,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-50.0906991736506,"y":-27.61113227451211,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-37.82891343843404,"y":-23.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-0.8333333333333335,"y":51.807434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":39.9955801051007,"y":-22.262981304577156,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":0,"y":46.307434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":37.82891343843404,"y":-23.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":50.0037361542519,"y":-27.61113227451211,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":37.82891343843404,"y":-23.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":50.0037361542519,"y":-27.61113227451211,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":37.82891343843404,"y":-23.26298130457716,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":0,"y":61.52596260915432,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":46.307434214382,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":64.09189474301121,"y":-40.49632733595109,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-0.6666666666666667,"y":75.68671491922093,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":61.0918947430112,"y":-38.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-2.333333333333333,"y":72.68671491922093,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":59.0918947430112,"y":-39.496327335951094,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-4.333333333333333,"y":72.02004825255426,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-65.03411865830552,"y":-40.829660669284415,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":2,"y":76.58523315556077,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-61.70078532497219,"y":-39.829660669284415,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":3.666666666666667,"y":74.25189982222744,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-58.70078532497219,"y":-38.49632733595109,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":4.666666666666666,"y":72.58523315556077,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":26.088905819609685,"y":-18.91483033464221,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":0,"y":31.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":33.75557248627636,"y":-27.581497001308875,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-2.666666666666667,"y":39.75557248627636,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":35.75557248627634,"y":-28.248163667975554,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-1.3333333333333337,"y":41.75557248627635,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":37.08890581960969,"y":-26.581497001308886,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-2.220446049250313e-16,"y":44.75557248627635,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-0.3333333333333286,"y":54.666666666666664,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-8.333333333333343,"y":41.333333333333336,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":35.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-34.75557248627635,"y":-29.248163667975547,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-1.3333333333333335,"y":38.42223915294302,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-38.088905819609685,"y":-31.248163667975547,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-6,"y":32.75557248627635,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-40.42223915294303,"y":-32.91483033464221,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945","curve":0},{"x":-15.029635273203224,"y":-20.75557248627635,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-66.36745199163884,"y":-39.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-20.362968606536562,"y":-19.42223915294302,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-64.36745199163884,"y":-36.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-25.029635273203226,"y":-18.42223915294302,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-62.70078532497217,"y":-33.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":15.36296860653656,"y":-20.75557248627635,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":66.0918947430112,"y":-39.49632733595109,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":20.36296860653656,"y":-19.755572486276353,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":65.75856140967787,"y":-36.82966066928442,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":24.696301939869894,"y":-19.755572486276353,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":61.425228076344524,"y":-34.16299400261776,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":25.029635273203226,"y":-18.755572486276353,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":59.75856140967787,"y":-32.49632733595108,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-18.029635273203226,"y":-21.088905819609685,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-63.70078532497217,"y":-36.49632733595109,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":-400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","pos":[-400,-70]},{"x":-400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","pos":[-400,70]},{"x":-400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","curve":0,"pos":[-400,-70]},{"x":-400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","curve":0,"pos":[-400,70]},{"x":0,"y":-200,"cMask":["wall"],"cGroup":["wall"],"color":"454866"},{"x":0,"y":-80,"cMask":["wall"],"cGroup":["wall"],"color":"454866"},{"x":0,"y":80,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":200,"cMask":["wall"],"cGroup":["wall"],"color":"454866"},{"x":0,"y":-81,"cMask":["wall"],"cGroup":["wall"],"color":"454866"},{"x":0,"y":81,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":81,"cMask":["wall"],"cGroup":["wall"],"color":"333945"},{"x":0,"y":-81,"cMask":["wall"],"cGroup":["wall"],"color":"454866"},{"x":-400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","vis":true,"pos":[-400,-70]},{"x":-400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","vis":true,"pos":[-400,70]},{"x":-400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","vis":true,"pos":[-400,-70]},{"x":-400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","vis":true,"pos":[-400,70]},{"x":400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332"},{"x":400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332"},{"x":400,"y":-70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","curve":0},{"x":400,"y":70,"cMask":["wall"],"cGroup":["wall"],"color":"1B2332","curve":0}],"segments":[{"v0":0,"v1":1,"color":"717F98","bCoef":1,"cMask":["ball"],"bias":-10,"y":-320},{"v0":2,"v1":3,"curve":0,"color":"717F98","bCoef":1,"cMask":["ball"],"bias":10,"y":320},{"v0":4,"v1":5,"color":"717F98","bCoef":1,"cMask":["ball"],"bias":10,"x":-700},{"v0":6,"v1":7,"color":"717F98","bCoef":1,"cMask":["ball"],"bias":-10,"x":700},{"v0":8,"v1":9,"color":"717F98","bCoef":1,"cMask":["ball"],"bias":10,"x":-700},{"v0":10,"v1":11,"color":"717F98","bCoef":1,"cMask":["ball"],"bias":-10,"x":700},{"v0":12,"v1":13,"color":"717F98","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"y":-85},{"v0":14,"v1":15,"color":"717F98","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"y":85},{"v0":16,"v1":17,"curve":-35,"color":"717F98","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"x":-735},{"v0":18,"v1":19,"curve":35,"color":"717F98","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"x":735},{"v0":20,"v1":21,"color":"717F98","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"v0":22,"v1":23,"curve":0,"color":"717F98","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"y":70},{"v0":24,"v1":25,"color":"757FD0","cMask":["wall"],"cGroup":["wall"],"x":-700},{"v0":26,"v1":27,"color":"757FD0","cMask":["wall"],"cGroup":["wall"],"x":400},{"v0":28,"v1":29,"vis":false,"color":"a3a3a3","cMask":["red","blue"],"cGroup":["redKO","blueKO"],"x":0},{"v0":30,"v1":31,"vis":false,"color":"a3a3a3","cMask":["red","blue"],"cGroup":["redKO","blueKO"],"x":0},{"v0":32,"v1":33,"curve":180,"vis":false,"color":"0A1524","cMask":["red","blue"],"cGroup":["blueKO"],"x":0},{"v0":34,"v1":35,"curve":180,"vis":false,"color":"0A1524","cMask":["red","blue"],"cGroup":["redKO"],"x":0},{"v0":37,"v1":38,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":38,"v1":39,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":39,"v1":40,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":40,"v1":41,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":48,"v1":49,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":50,"v1":51,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":53,"v1":52,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":55,"v1":54,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":57,"v1":56,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":63,"v1":64,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":64,"v1":65,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":66,"v1":67,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":67,"v1":68,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":71,"v1":72,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":75,"v1":76,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":77,"v1":74,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":78,"v1":79,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":81,"v1":82,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":84,"v1":86,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":87,"v1":85,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":88,"v1":89,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":90,"v1":91,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":92,"v1":93,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":94,"v1":95,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":96,"v1":97,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":98,"v1":99,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":100,"v1":101,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":102,"v1":103,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":104,"v1":105,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":106,"v1":107,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":108,"v1":109,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":110,"v1":111,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":112,"v1":113,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":114,"v1":115,"curve":0,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":116,"v1":117,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":118,"v1":119,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":120,"v1":121,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":122,"v1":123,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":124,"v1":125,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":126,"v1":127,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":128,"v1":129,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":130,"v1":131,"vis":true,"color":"333945","bCoef":1,"cMask":["wall"],"cGroup":["wall"]},{"v0":136,"v1":137,"color":"454866","cMask":["wall"],"cGroup":["wall"],"x":0},{"v0":138,"v1":139,"color":"454866","cMask":["wall"],"cGroup":["wall"],"x":0},{"v0":140,"v1":141,"curve":180,"color":"454866","cMask":["wall"],"cGroup":["wall"]},{"v0":142,"v1":143,"curve":180,"color":"454866","cMask":["wall"],"cGroup":["wall"]}],"goals":[{"p0":[-408.79999999999995,-86],"p1":[-408.79999999999995,84],"team":"red"},{"p0":[408.79999999999995,-88],"p1":[408.79999999999995,82],"team":"blue"}],"discs":[{"radius":5,"invMass":0,"pos":[-400,-70],"color":"8198A3","bCoef":1,"cMask":["all"],"cGroup":["all"]},{"radius":5,"invMass":0,"pos":[-400,70],"color":"8198A3","bCoef":1,"cMask":["all"],"cGroup":["all"]},{"radius":5,"invMass":0,"pos":[400,70],"color":"8198A3","bCoef":1,"cMask":["all"],"cGroup":["all"],"x":400},{"radius":5,"invMass":0,"pos":[400,-70],"color":"8198A3","bCoef":1,"cMask":["all"],"cGroup":["all"],"x":400}],"planes":[{"normal":[0,1],"dist":-300,"cMask":["red","blue"],"_data":{"extremes":{"normal":[0,1],"dist":-300,"canvas_rect":[-955,-334,955,334],"a":[-955,-300],"b":[955,-300]}}},{"normal":[0,-1],"dist":-300,"cMask":["red","blue"],"_data":{"extremes":{"normal":[0,-1],"dist":-300,"canvas_rect":[-955,-334,955,334],"a":[-955,300],"b":[955,300]}}},{"normal":[-1,0],"dist":-705,"cMask":["red","blue"],"_data":{"extremes":{"normal":[-1,0],"dist":-705,"canvas_rect":[-955,-334,955,334],"a":[705,-334],"b":[705,334]}}},{"normal":[0,0],"dist":-705,"cMask":["red","blue"],"_data":{"extremes":{"normal":[0,0],"dist":-705,"canvas_rect":[-955,-334,955,334],"a":[-705,-334],"b":[-705,334]}}},{"normal":[1,0],"dist":-695,"bCoef":0,"cMask":["c0"],"_data":{"extremes":{"normal":[1,0],"dist":-695,"canvas_rect":[-955,-334,955,334],"a":[-695,-334],"b":[-695,334]}}},{"normal":[-1,0],"dist":-700,"bCoef":0,"cMask":["c1"],"_data":{"extremes":{"normal":[-1,0],"dist":-700,"canvas_rect":[-955,-334,955,334],"a":[700,-334],"b":[700,334]}}}],"joints":[],"playerPhysics":{"radius":15,"bCoef":0,"invMass":0.5,"damping":0.96,"cGroup":["red","blue"],"acceleration":0.11,"gravity":[0,0],"kickingAcceleration":0.083,"kickingDamping":0.96,"kickStrength":4.2,"kickback":0},"ballPhysics":{"radius":5.8,"bCoef":0.412,"cMask":["all"],"damping":0.99,"invMass":1.5,"gravity":[0,0],"color":"FFA500","cGroup":["ball"]}}';
const bigMap = '{"name":"buycoffee.to/futsal 3 Vehax","width":710,"height":300,"bg":{"width":600,"height":270,"color":"425370"},"vertexes":[{"x":-600,"y":-270,"cMask":["ball"]},{"x":600,"y":-270,"cMask":["ball"]},{"x":-600,"y":270,"cMask":["ball"]},{"x":600,"y":270,"cMask":["ball"]},{"x":-600,"y":85,"cMask":["ball"]},{"x":-600,"y":270,"cMask":["ball"]},{"x":600,"y":85,"cMask":["ball"]},{"x":600,"y":270,"cMask":["ball"]},{"x":-600,"y":-270,"cMask":["ball"]},{"x":-600,"y":-85,"cMask":["ball"]},{"x":600,"y":-270,"cMask":["ball"]},{"x":600,"y":-85,"cMask":["ball"]},{"x":-640,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-600,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-640,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-600,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-640,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-640,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":640,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":640,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":640,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":600,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":640,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":600,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-600,"y":-85,"cMask":["wall"]},{"x":-600,"y":85,"cMask":["wall"]},{"x":600,"y":-85,"cMask":["wall"]},{"x":600,"y":85,"cMask":["wall"]},{"x":-450,"y":-80,"cMask":["wall"]},{"x":-450,"y":80,"cMask":["wall"]},{"x":0,"y":-300,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":300,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["redKO"]},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO"]},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":8.696301939869894,"y":-21.088905819609685,"cMask":["wall"]},{"x":26.088905819609685,"y":-18.91483033464221,"cMask":["wall"]},{"x":0,"y":31.088905819609685,"cMask":["wall"]},{"x":-26.088905819609685,"y":-18.91483033464221,"cMask":["wall"]},{"x":-8.696301939869894,"y":-21.088905819609685,"cMask":["wall"]},{"x":0,"y":46.307434214382,"cMask":["wall"]},{"x":-44.833333333333336,"y":-33.666666666666664,"cMask":["wall"]},{"x":44.833333333333336,"y":-33.666666666666664,"cMask":["wall"]},{"x":-34,"y":-31,"cMask":["wall"]},{"x":34,"y":-31,"cMask":["wall"]},{"x":-2.5,"y":53.807434214382,"cMask":["wall"]},{"x":-2,"y":55.807434214382,"cMask":["wall"]},{"x":43.32891343843404,"y":-24.26298130457716,"cMask":["wall"]},{"x":-0.5,"y":58.807434214382,"cMask":["wall"]},{"x":46.32891343843404,"y":-26.26298130457716,"cMask":["wall"]},{"x":0.5,"y":50.807434214382,"cMask":["wall"]},{"x":-39.82891343843404,"y":-22.76298130457716,"cMask":["wall"]},{"x":-3,"y":51.807434214382,"cMask":["wall"]},{"x":-45.82891343843404,"y":-25.76298130457716,"cMask":["wall"]},{"x":-1,"y":51.307434214382,"cMask":["wall"]},{"x":-42.82891343843404,"y":-24.26298130457716,"cMask":["wall"]},{"x":-36.5,"y":-32,"cMask":["wall"]},{"x":36,"y":-32.5,"cMask":["wall"]},{"x":-38.5,"y":-33,"cMask":["wall"]},{"x":37.5,"y":-33,"cMask":["wall"]},{"x":40.5,"y":-34,"cMask":["wall"]},{"x":8.696301939869894,"y":-21.088905819609685,"cMask":["wall"]},{"x":68.0918947430112,"y":-42.82966066928442,"cMask":["wall"]},{"x":0,"y":79.3533815858876,"cMask":["wall"]},{"x":-8.696301939869894,"y":-21.088905819609685,"cMask":["wall"]},{"x":-68.70078532497217,"y":-42.82966066928442,"cMask":["wall"]},{"x":0,"y":78.9185664888941,"cMask":["wall"]},{"x":0,"y":46.307434214382,"cMask":["wall"]},{"x":0,"y":61.52596260915432,"cMask":["wall"]},{"x":-50.0906991736506,"y":-27.61113227451211,"cMask":["wall"]},{"x":-37.82891343843404,"y":-23.26298130457716,"cMask":["wall"]},{"x":40.82891343843404,"y":-23.26298130457716,"cMask":["wall"]},{"x":0,"y":46.307434214382,"cMask":["wall"]},{"x":0,"y":61.52596260915432,"cMask":["wall"]},{"x":-50.0906991736506,"y":-27.61113227451211,"cMask":["wall"]},{"x":-37.82891343843404,"y":-23.26298130457716,"cMask":["wall"]},{"x":-0.8333333333333335,"y":51.807434214382,"cMask":["wall"]},{"x":39.9955801051007,"y":-22.262981304577156,"cMask":["wall"]},{"x":0,"y":46.307434214382,"cMask":["wall"]},{"x":37.82891343843404,"y":-23.26298130457716,"cMask":["wall"]},{"x":50.0037361542519,"y":-27.61113227451211,"cMask":["wall"]},{"x":37.82891343843404,"y":-23.26298130457716,"cMask":["wall"]},{"x":50.0037361542519,"y":-27.61113227451211,"cMask":["wall"]},{"x":37.82891343843404,"y":-23.26298130457716,"cMask":["wall"]},{"x":0,"y":61.52596260915432,"cMask":["wall"]},{"x":0,"y":46.307434214382,"cMask":["wall"]},{"x":64.09189474301121,"y":-40.49632733595109,"cMask":["wall"]},{"x":-0.6666666666666667,"y":75.68671491922093,"cMask":["wall"]},{"x":61.0918947430112,"y":-38.82966066928442,"cMask":["wall"]},{"x":-2.333333333333333,"y":72.68671491922093,"cMask":["wall"]},{"x":59.0918947430112,"y":-39.496327335951094,"cMask":["wall"]},{"x":-4.333333333333333,"y":72.02004825255426,"cMask":["wall"]},{"x":-65.03411865830552,"y":-40.829660669284415,"cMask":["wall"]},{"x":2,"y":76.58523315556077,"cMask":["wall"]},{"x":-61.70078532497219,"y":-39.829660669284415,"cMask":["wall"]},{"x":3.666666666666667,"y":74.25189982222744,"cMask":["wall"]},{"x":-58.70078532497219,"y":-38.49632733595109,"cMask":["wall"]},{"x":4.666666666666666,"y":72.58523315556077,"cMask":["wall"]},{"x":26.088905819609685,"y":-18.91483033464221,"cMask":["wall"]},{"x":0,"y":31.088905819609685,"cMask":["wall"]},{"x":33.75557248627636,"y":-27.581497001308875,"cMask":["wall"]},{"x":-2.666666666666667,"y":39.75557248627636,"cMask":["wall"]},{"x":35.75557248627634,"y":-28.248163667975554,"cMask":["wall"]},{"x":-1.3333333333333337,"y":41.75557248627635,"cMask":["wall"]},{"x":37.08890581960969,"y":-26.581497001308886,"cMask":["wall"]},{"x":-2.220446049250313e-16,"y":44.75557248627635,"cMask":["wall"]},{"x":-0.3333333333333286,"y":54.666666666666664,"cMask":["wall"]},{"x":-8.333333333333343,"y":41.333333333333336,"cMask":["wall"]},{"x":0,"y":35.088905819609685,"cMask":["wall"]},{"x":-34.75557248627635,"y":-29.248163667975547,"cMask":["wall"]},{"x":-1.3333333333333335,"y":38.42223915294302,"cMask":["wall"]},{"x":-38.088905819609685,"y":-31.248163667975547,"cMask":["wall"]},{"x":-6,"y":32.75557248627635,"cMask":["wall"]},{"x":-40.42223915294303,"y":-32.91483033464221,"cMask":["wall"]},{"x":-15.029635273203224,"y":-20.75557248627635,"cMask":["wall"]},{"x":-66.36745199163884,"y":-39.82966066928442,"cMask":["wall"]},{"x":-20.362968606536562,"y":-19.42223915294302,"cMask":["wall"]},{"x":-64.36745199163884,"y":-36.82966066928442,"cMask":["wall"]},{"x":-25.029635273203226,"y":-18.42223915294302,"cMask":["wall"]},{"x":-62.70078532497217,"y":-33.82966066928442,"cMask":["wall"]},{"x":15.36296860653656,"y":-20.75557248627635,"cMask":["wall"]},{"x":66.0918947430112,"y":-39.49632733595109,"cMask":["wall"]},{"x":20.36296860653656,"y":-19.755572486276353,"cMask":["wall"]},{"x":65.75856140967787,"y":-36.82966066928442,"cMask":["wall"]},{"x":24.696301939869894,"y":-19.755572486276353,"cMask":["wall"]},{"x":61.425228076344524,"y":-34.16299400261776,"cMask":["wall"]},{"x":25.029635273203226,"y":-18.755572486276353,"cMask":["wall"]},{"x":59.75856140967787,"y":-32.49632733595108,"cMask":["wall"]},{"x":-18.029635273203226,"y":-21.088905819609685,"cMask":["wall"]},{"x":-63.70078532497217,"y":-36.49632733595109,"cMask":["wall"]},{"x":-600,"y":-85,"cMask":["wall"]},{"x":-600,"y":85,"cMask":["wall"]},{"x":-600,"y":-85,"cMask":["wall"]},{"x":-600,"y":85,"cMask":["wall"]},{"x":0,"y":-295,"cMask":["wall"]},{"x":0,"y":-80,"cMask":["wall"]},{"x":0,"y":80,"cMask":["wall"]},{"x":0,"y":290,"cMask":["wall"]},{"x":0,"y":-81,"cMask":["wall"]},{"x":0,"y":81,"cMask":["wall"]},{"x":0,"y":81,"cMask":["wall"]},{"x":0,"y":-81,"cMask":["wall"]},{"x":-598,"y":-85,"cMask":["wall"]},{"x":-598,"y":85,"cMask":["wall"]},{"x":-602,"y":-85,"cMask":["wall"]},{"x":-602,"y":85,"cMask":["wall"]},{"x":602,"y":-85,"cMask":["wall"]},{"x":602,"y":85,"cMask":["wall"]},{"x":598,"y":-85,"cMask":["wall"]},{"x":598,"y":85,"cMask":["wall"]},{"x":-600,"y":-235,"cMask":["wall"]},{"x":-450,"y":-80,"cMask":["wall"]},{"x":-450,"y":80,"cMask":["wall"]},{"x":-600,"y":235,"cMask":["wall"]},{"x":450,"y":-80,"cMask":["wall"]},{"x":450,"y":90,"cMask":["wall"]},{"x":600,"y":-235,"cMask":["wall"]},{"x":450,"y":-80,"cMask":["wall"]},{"x":450,"y":90,"cMask":["wall"]},{"x":600,"y":235,"cMask":["wall"]},{"x":-150,"y":-285,"cMask":[]},{"x":150,"y":-285,"cMask":[]}],"segments":[{"v0":0,"v1":1,"bias":-10,"cMask":["ball"],"color":"717F98"},{"v0":2,"v1":3,"bias":10,"cMask":["ball"],"color":"717F98"},{"v0":4,"v1":5,"bias":10,"cMask":["ball"],"color":"717F98"},{"v0":6,"v1":7,"bias":-10,"cMask":["ball"],"color":"717F98"},{"v0":8,"v1":9,"bias":10,"cMask":["ball"],"color":"717F98"},{"v0":10,"v1":11,"bias":-10,"cMask":["ball"],"color":"717F98"},{"v0":12,"v1":13,"bias":-10,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"717F98"},{"v0":14,"v1":15,"bias":10,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"717F98"},{"v0":17,"v1":16,"bias":-10,"bCoef":0.2,"curve":35,"curveF":3.1715948023632126,"cMask":["ball"],"cGroup":["ball"],"color":"717F98"},{"v0":18,"v1":19,"bias":-10,"bCoef":0.2,"curve":35,"curveF":3.1715948023632126,"cMask":["ball"],"cGroup":["ball"],"color":"717F98"},{"v0":20,"v1":21,"bias":10,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"717F98"},{"v0":22,"v1":23,"bias":-10,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"717F98"},{"v0":24,"v1":25,"cMask":["wall"],"color":"757FD0"},{"v0":26,"v1":27,"cMask":["wall"],"color":"757FD0"},{"v0":28,"v1":29,"cMask":["wall"],"color":"2B3548"},{"v0":30,"v1":31,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"A3A3A3"},{"v0":32,"v1":33,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"A3A3A3"},{"v0":34,"v1":35,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"],"color":"A1524"},{"v0":36,"v1":37,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"],"color":"A1524"},{"v0":39,"v1":40,"cMask":["wall"],"color":"333945"},{"v0":40,"v1":41,"cMask":["wall"],"color":"333945"},{"v0":41,"v1":42,"cMask":["wall"],"color":"333945"},{"v0":42,"v1":43,"cMask":["wall"],"color":"333945"},{"v0":50,"v1":51,"cMask":["wall"],"color":"333945"},{"v0":52,"v1":53,"cMask":["wall"],"color":"333945"},{"v0":55,"v1":54,"cMask":["wall"],"color":"333945"},{"v0":57,"v1":56,"cMask":["wall"],"color":"333945"},{"v0":59,"v1":58,"cMask":["wall"],"color":"333945"},{"v0":65,"v1":66,"cMask":["wall"],"color":"333945"},{"v0":66,"v1":67,"cMask":["wall"],"color":"333945"},{"v0":68,"v1":69,"cMask":["wall"],"color":"333945"},{"v0":69,"v1":70,"cMask":["wall"],"color":"333945"},{"v0":73,"v1":74,"cMask":["wall"],"color":"333945"},{"v0":77,"v1":78,"cMask":["wall"],"color":"333945"},{"v0":79,"v1":76,"cMask":["wall"],"color":"333945"},{"v0":80,"v1":81,"cMask":["wall"],"color":"333945"},{"v0":83,"v1":84,"cMask":["wall"],"color":"333945"},{"v0":86,"v1":88,"cMask":["wall"],"color":"333945"},{"v0":89,"v1":87,"cMask":["wall"],"color":"333945"},{"v0":90,"v1":91,"cMask":["wall"],"color":"333945"},{"v0":92,"v1":93,"cMask":["wall"],"color":"333945"},{"v0":94,"v1":95,"cMask":["wall"],"color":"333945"},{"v0":96,"v1":97,"cMask":["wall"],"color":"333945"},{"v0":98,"v1":99,"cMask":["wall"],"color":"333945"},{"v0":100,"v1":101,"cMask":["wall"],"color":"333945"},{"v0":102,"v1":103,"cMask":["wall"],"color":"333945"},{"v0":104,"v1":105,"cMask":["wall"],"color":"333945"},{"v0":106,"v1":107,"cMask":["wall"],"color":"333945"},{"v0":108,"v1":109,"cMask":["wall"],"color":"333945"},{"v0":110,"v1":111,"cMask":["wall"],"color":"333945"},{"v0":112,"v1":113,"cMask":["wall"],"color":"333945"},{"v0":114,"v1":115,"cMask":["wall"],"color":"333945"},{"v0":116,"v1":117,"cMask":["wall"],"color":"333945"},{"v0":118,"v1":119,"cMask":["wall"],"color":"333945"},{"v0":120,"v1":121,"cMask":["wall"],"color":"333945"},{"v0":122,"v1":123,"cMask":["wall"],"color":"333945"},{"v0":124,"v1":125,"cMask":["wall"],"color":"333945"},{"v0":126,"v1":127,"cMask":["wall"],"color":"333945"},{"v0":128,"v1":129,"cMask":["wall"],"color":"333945"},{"v0":130,"v1":131,"cMask":["wall"],"color":"333945"},{"v0":132,"v1":133,"cMask":["wall"],"color":"333945"},{"v0":138,"v1":139,"cMask":["wall"],"color":"454866"},{"v0":140,"v1":141,"cMask":["wall"],"color":"454866"},{"v0":142,"v1":143,"curve":180,"curveF":6.123233995736766e-17,"cMask":["wall"],"color":"454866"},{"v0":144,"v1":145,"curve":180,"curveF":6.123233995736766e-17,"cMask":["wall"],"color":"454866"},{"v0":146,"v1":147,"cMask":["wall"],"color":"1B2332"},{"v0":148,"v1":149,"cMask":["wall"],"color":"1B2332"},{"v0":150,"v1":151,"cMask":["wall"],"color":"1B2332"},{"v0":152,"v1":153,"cMask":["wall"],"color":"1B2332"},{"v0":154,"v1":155,"curve":80.00000000000001,"curveF":1.19175359259421,"cMask":["wall"],"color":"2B3548"},{"v0":156,"v1":157,"curve":80.00000000000001,"curveF":1.19175359259421,"cMask":["wall"],"color":"2B3548"},{"v0":158,"v1":159,"cMask":["wall"],"color":"2B3548"},{"v0":161,"v1":160,"curve":80.00000000000001,"curveF":1.19175359259421,"cMask":["wall"],"color":"2B3548"},{"v0":163,"v1":162,"curve":80.00000000000001,"curveF":1.19175359259421,"cMask":["wall"],"color":"2B3548"},{"v0":164,"v1":165,"cMask":[],"color":"404040"}],"planes":[{"normal":[0,1],"dist":-300,"cMask":["red","blue"]},{"normal":[0,-1],"dist":-300,"cMask":["red","blue"]},{"normal":[-1,0],"dist":-705,"cMask":["red","blue"]},{"normal":[1,0],"dist":-705,"cMask":["red","blue"]} ,{"normal":[1,0],"dist":-695,"bCoef":0,"cMask":["c0"]},{"normal":[-1,0],"dist":-700,"bCoef":0,"cMask":["c1"]}],"goals":[{"p0":[-608.8,-85],"p1":[-608.8,85],"team":"red"},{"p0":[608.8,-85],"p1":[608.8,85],"team":"blue"}],"discs":[{"pos":[-600,-85],"radius":5,"bCoef":1,"invMass":0,"color":"FF8080"},{"pos":[-600,85],"radius":5,"bCoef":1,"invMass":0,"color":"FF8080"},{"pos":[600,85],"radius":5,"bCoef":1,"invMass":0,"color":"80BFFF"},{"pos":[600,-85],"radius":5,"bCoef":1,"invMass":0,"color":"80BFFF"},{"pos":[0,-285],"radius":7,"color":"424242","cGroup":[]},{"pos":[0,-285],"radius":5,"color":"202020","cGroup":[]},{"pos":[1000,-285],"radius":9,"color":"DEDEDE","cGroup":[]}],"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":4.545},"ballPhysics": {   "radius": 5.8,   "bCoef": 0.412,   "damping": 0.99,   "invMass": 1.5,   "gravity": [0, 0],   "color": "FFA500",   "cMask": ["all"],   "cGroup": ["ball"] } ,"spawnDistance":150,"redSpawnPoints":[[-200,0],[-250,100],[-250,-100],[-300,200],[-300,-200]],"blueSpawnPoints":[[200,0],[250,100],[250,-100],[300,200],[300,-200]],"kickOffReset":"full"}';
var currentStadium = 'classic';
var bigMapObj = JSON.parse(trainingMap);

room.setScoreLimit(scoreLimit);
room.setTimeLimit(timeLimit);
room.setTeamsLock(true);
room.setKickRateLimit(6, 0, 0);

var masterPassword = "sra";
var roomPassword = '';

/* OPTIONS */

var drawTimeLimit = 1;
var teamSize = 3;
var maxAdmins = 0;
var disableBans = false;
var debugMode = false;
var afkLimit = debugMode ? Infinity : 12;

var defaultSlowMode = 0.5;
var chooseModeSlowMode = 1;
var slowMode = defaultSlowMode;
var SMSet = new Set();

var hideClaimMessage = true;
var mentionPlayersUnpause = true;

/* OBJECTS */

class Goal {
    constructor(time, team, striker, assist) {
        this.time = time;
        this.team = team;
        this.striker = striker;
        this.assist = assist;
    }
}

class Game {
    constructor() {
        this.date = Date.now();
        this.scores = room.getScores();
        this.playerComp = getStartingLineups();
        this.goals = [];
        this.rec = room.startRecording();
        this.touchArray = [];
    }
}

class PlayerComposition {
    constructor(player, auth, timeEntry, timeExit) {
        this.player = player;
        this.auth = auth;
        this.timeEntry = timeEntry;
        this.timeExit = timeExit;
        this.inactivityTicks = 0;
        this.GKTicks = 0;
    }
}

class MutePlayer {
    constructor(name, id, auth) {
        this.id = MutePlayer.incrementId();
        this.name = name;
        this.playerId = id;
        this.auth = auth;
        this.unmuteTimeout = null;
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }

    setDuration(minutes) {
        this.unmuteTimeout = setTimeout(() => {
            room.sendAnnouncement(
                `Możesz gadać.`,
                this.playerId,
                announcementColor,
                "bold",
                HaxNotification.CHAT
            );
            this.remove();
        }, minutes * 60 * 1000);
        muteArray.add(this);
    }

    remove() {
        this.unmuteTimeout = null;
        muteArray.removeById(this.id);
    }
}

class MuteList {
    constructor() {
        this.list = [];
    }

    add(mutePlayer) {
        this.list.push(mutePlayer);
        return mutePlayer;
    }

    getById(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    getByPlayerId(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.playerId === id);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    getByAuth(auth) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    removeById(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }

    removeByAuth(auth) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }
}

class BallTouch {
    constructor(player, time, goal, position) {
        this.player = player;
        this.time = time;
        this.goal = goal;
        this.position = position;
    }
}

class HaxStatistics {
    constructor(playerName = '') {
        this.playerName = playerName;
        this.games = 0;
        this.wins = 0;
        this.winrate = '0.00%';
        this.playtime = 0;
        this.goals = 0;
        this.assists = 0;
        this.CS = 0;
        this.ownGoals = 0;
    }
}

/* PLAYERS */
let elo = {}; // elo[player.name] = rating
const baseElo = 1000;
const eloK = 25;

const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
const State = { PLAY: 0, PAUSE: 1, STOP: 2 };
const Role = { PLAYER: 0, ADMIN_TEMP: 1, ADMIN_PERM: 2, MASTER: 3 };
const HaxNotification = { NONE: 0, CHAT: 1, MENTION: 2 };
const Situation = { STOP: 0, KICKOFF: 1, PLAY: 2, GOAL: 3 };

var gameState = State.STOP;
var playSituation = Situation.STOP;
var goldenGoal = false;

var playersAll = [];
var players = [];
var teamRed = [];
var teamBlue = [];
var teamSpec = [];

var teamRedStats = [];
var teamBlueStats = [];

var banList = [];

/* STATS */

var possession = [0, 0];
var actionZoneHalf = [0, 0];
var lastWinner = Team.SPECTATORS;
var streak = 0;

/* AUTH */

var authArray = [];
var adminList = [
];
var masterList = [
    "DBEZhwUpxg8jglAm671LfH94dohHntBTMiCtHHaEsNo", //sracz
    "n3khbiT-Uiux98dA5cz8sKX-9-8Ao7E-s9EsC5OWXpc", //delta
    "I6JXKX_DfKIGl-Ri4JFgLyOJntIsOz6TgkzOQRYj2Io", //"Tajmoł 😈"
    "6kyUssUkv9zdcLiDu5_yE5jq_scOEtANFO_nTSy-8gA", //ave
    "RMZkvZIED6AgBlbf8v8XfjVIm7jJrrSznsIOn2ni22E", //rapid
    "HpANpsOf-VZkeoZYCGvMZGn8G8xiT4BnYhcj0agvfFQ", //cwel
];

/* COMMANDS */

var help = {
    help: {
        aliases: ['komendy'],
        roles: Role.PLAYER,
        desc: `
	Ta komenda pokazuje listę wszystkich dostępnych komend. Możesz zobaczyć też detale jakiejś komendy.
dla przykładu: \'!help bb\' pomoże Ci zrozumieć komendę \'bb\' .`,
        function: helpCommand,
    },

    slogin: {
        aliases: ['l'],
        roles: Role.PLAYER,
        desc: false,
        function: masterCommand,
    },
    afk: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        Idziesz AFK.`,
        function: afkCommand,
    },
    afks: {
        aliases: ['afklist'],
        roles: Role.PLAYER,
        desc: `
        Lista afków.`,
        function: afkListCommand,
    },
    bb: {
        aliases: ['bye', 'gn', 'cya', 'cz'],
        roles: Role.PLAYER,
        desc: `
	    Dostajesz admina!`,
        function: leaveCommand,
    },
    
    rename: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        Zmiana nazwy na tabeli liderów`,
        function: renameCommand,
    },

    games: {
        aliases: ['gry'],
        roles: Role.PLAYER,
        desc: `Top 5 graczy z największą liczbą gier`,
        function: statsLeaderboardCommand,
    },

    wins: {
        aliases: ['wygrane'],
        roles: Role.PLAYER,
        desc: `
        5 graczy mających najwięcej wygranych gier`,
        function: statsLeaderboardCommand,
    },
    goals: {
        aliases: ['gole', 'bramki'],
        roles: Role.PLAYER,
        desc: `
        5 graczy mających najwięcej strzelonych bramek`,
        function: statsLeaderboardCommand,
    },

    test: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `Twoje statystyki: Games, Wins, Winrate, Playtime, Goals, Assists, CS, Own Goals`,
        function: statsCommand,
    },

    assists: {
        aliases: ['asysty'],
        roles: Role.PLAYER,
        desc: `
        5 graczy mających najwięcej asyst`,
        function: statsLeaderboardCommand,
    },
    cs: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        5 graczy mających najwięcej czystych kont`,
        function: statsLeaderboardCommand,
    },
    playtime: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        5 graczy mających najwięcej przegranych godzin`,
        function: statsLeaderboardCommand,
    },
    training: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        Komenda ładuje mapkę do treningu`,
        function: stadiumCommand,
    },
    classic: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        Komenda ładuje mapkę do 1v1`,
        function: stadiumCommand,
    },
    big: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        komenda ładuje mapkaę do 3v3`,
        function: stadiumCommand,
    },
    rr: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
    Komenda restartuje mapkę`,
        function: restartCommand,
    },
    rrs: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
    Odwraca drużyny, i restartuje grę`,
        function: restartSwapCommand,
    },
    swap: {
        aliases: ['s'],
        roles: Role.ADMIN_TEMP,
        desc: `
    Odwraca drużyny, gdy gra jest zatrzymana`,
        function: swapCommand,
    },
    kickred: {
        aliases: ['kickr'],
        roles: Role.ADMIN_TEMP,
        desc: `
    Wyrzuca wszystkich, razem z używającym. Możesz wpisac powód afektu`,
        function: kickTeamCommand,
    },
    kickblue: {
        aliases: ['kickb'],
        roles: Role.ADMIN_TEMP,
        desc: `
    Wyrzuca wszystkich z blue, razem z używającym. Możesz wpisac powód afektu`,
        function: kickTeamCommand,
    },
    kickspec: {
        aliases: ['kicks'],
        roles: Role.ADMIN_TEMP,
        desc: `
    Wyrzuca wszystkich ze speca, razem z używającym. Możesz wpisac powód afektu`,
        function: kickTeamCommand,
    },
    mute: {
        aliases: ['m'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Komenda pozwala wyciszyć gracza. Nie będzie mógł gadać. Może zostać przywrócony do głosu przez adminów.
    Składa się z 2 argumentow:
    Argument 1: #<id> gdzie <id> to cel. Nie zadziała gdy cel jest adminem.
    Argument 2 (opcjonalny): <czas> gdzie <czas> jest w minutach. Jak nie wpiszesz zostanie wyciszony na  ${muteDuration} minut.
    Przykład: !mute #3 20 wyciszy gracza z id 3 na  20 minut.`,
        function: muteCommand,
    },
    unmute: {
        aliases: ['um'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Przywraca do głosu.
    Tylko 1 argument:
    Argument 1: #<id> gdzie <id> to cel.
    lub
    Argument 1: <number> gdzie <number> jest numerem z listy wyciszonych; 'muteList' komenda.
    Przykład: !unmute #300 odciszy gracza o id 300,
             !unmute 8 odciszy gracza z numerkiem 8 na liscie wyciszonych z komendy 'muteList'.`,
        function: unmuteCommand,
    },
    mutes: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        Lista wszystkich wyciczonych`,
        function: muteListCommand,
    },
    clearbans: {
        aliases: [],
        roles: Role.MASTER,
        desc: `
	Usuwa bany wszystkich. Można odbanować jednego szczegolnego gracza,dodając jego ID do argumentów`,
        function: clearbansCommand,
    },
    bans: {
        aliases: ['banlist'],
        roles: Role.MASTER,
        desc: `
    Pokazuje wszystkich zbanowanych wraz z ich ID.`,
        function: banListCommand,
    },
    admins: {
        aliases: ['adminlist'],
        roles: Role.MASTER,
        desc: `
    Pokazuje wszystkich Perm adminów`,
        function: adminListCommand,
    },
    setadmin: {
        aliases: ['admin'],
        roles: Role.MASTER,
        desc: `
    This command allows to set someone as admin. He will be able to connect as admin, and can be removed at any time by masters.
It takes 1 argument:
Argument 1: #<id> where <id> is the id of the player targeted.
Example: !setadmin #3 will give admin to the player with id 3.`,
        function: setAdminCommand,
    },
    removeadmin: {
        aliases: ['unadmin'],
        roles: Role.MASTER,
        desc: `
	This command allows to remove someone as admin.
It takes 1 argument:
Argument 1: #<id> where <id> is the id of the player targeted.
OR
Argument 1: <number> where <number> is the number associated with the admin given by the 'admins' command.
Example: !removeadmin #300 will remove admin to the player with id 300,
         !removeadmin 2 will remove the admin n°2 according to the 'admins' command.`,
        function: removeAdminCommand,
    },
    password: {
        aliases: [],
        roles: Role.MASTER,
        desc: `
        This command allows to add a password to the room.
    It takes 1 argument:
    Argument 1: <password> where <password> is the password you want for the room.
    
    To remove the room password, simply enter '!password'.`,
        function: passwordCommand,
    },
    discord: {
        aliases: ['dc'],
        roles: Role.PLAYER,
        desc: `
        wrzuca link do discorda`,
        function: discordCommand,
    },


    rangi: {
        aliases: ['ranks'],
        roles: Role.PLAYER,
        desc: `Tabela progów ELO z nazwami i emoji.`,
        function: rangiCommand,
    },

    stats: { aliases: ['me', 'stat', 'mystats', 'staty'], roles: Role.PLAYER, desc: `Twoje statystyki (łącznie z ELO).`, function: unifiedStatsCommand },
};

// Bridge: expose help as commands for router
var commands = help;

// === Discord command (two-line invite; no emojis) ===
function discordCommand(player, message) {
    try {
        room.sendAnnouncement(
            "Zapraszamy na Discorda!",
            player.id,
            defaultColor,
            "bold",
            HaxNotification.CHAT
        );
        room.sendAnnouncement(
            "Link: https://discord.gg/HBabx8b93k",
            player.id,
            defaultColor,
            "bold",
            HaxNotification.CHAT
        );
    } catch (e) {
        try { room.sendAnnouncement("Link: https://discord.gg/HBabx8b93k", player.id); } catch(_) {}
    }
}

/* GAME */

var lastTouches = Array(2).fill(null);
var lastTeamTouched;

var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
var ballSpeed = 0;
var playerRadius = 15;
var ballRadius = 10;
var triggerDistance = playerRadius + ballRadius + 0.01;

/* COLORS */

var welcomeColor = 0xEDD093;
var announcementColor = 0xffefd6;
var infoColor = 0xbebebe;
var privateMessageColor = 0xffc933;
var redColor = 0xff4c4c;
var blueColor = 0x62cbff;
var warningColor = 0xffa135;
var errorColor = 0xa40000;
var successColor = 0x75ff75;
var defaultColor = null;

/* AUXILIARY */

var checkTimeVariable = false;
var checkStadiumVariable = true;
var endGameVariable = false;
var cancelGameVariable = false;
var kickFetchVariable = false;

var chooseMode = false;
var timeOutCap;
var capLeft = false;
var redCaptainChoice = '';
var blueCaptainChoice = '';
var chooseTime = 20;

var AFKSet = new Set();
var AFKMinSet = new Set();
var AFKCooldownSet = new Set();
var minAFKDuration = 0;
var maxAFKDuration = 30;
var AFKCooldown = 0;

var muteArray = new MuteList();
var muteDuration = 5;

var removingPlayers = false;
var insertingPlayers = false;

var stopTimeout;
var startTimeout;
var unpauseTimeout;
var removingTimeout;
var insertingTimeout;

var emptyPlayer = {
    id: 0,
};
stadiumCommand(emptyPlayer, "!training");

var game = new Game();

/* FUNCTIONS */

/* AUXILIARY FUNCTIONS */

if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
}

function getDate() {
    let d = new Date();
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

/* MATH FUNCTIONS */

function getRandomInt(max) {
    // returns a random number between 0 and max-1
    return Math.floor(Math.random() * Math.floor(max));
}

function pointDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/* TIME FUNCTIONS */

function getHoursStats(time) {
    return Math.floor(time / 3600);
}

function getMinutesGame(time) {
    var t = Math.floor(time / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getMinutesReport(time) {
    return Math.floor(Math.round(time) / 60);
}

function getMinutesEmbed(time) {
    var t = Math.floor(Math.round(time) / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getMinutesStats(time) {
    return Math.floor(time / 60) - getHoursStats(time) * 60;
}

function getSecondsGame(time) {
    var t = Math.floor(time - Math.floor(time / 60) * 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getSecondsReport(time) {
    var t = Math.round(time);
    return Math.floor(t - getMinutesReport(t) * 60);
}

function getSecondsEmbed(time) {
    var t = Math.round(time);
    var t2 = Math.floor(t - Math.floor(t / 60) * 60);
    return `${Math.floor(t2 / 10)}${Math.floor(t2 % 10)}`;
}

function getTimeGame(time) {
    return `[${getMinutesGame(time)}:${getSecondsGame(time)}]`;
}

function getTimeEmbed(time) {
    return `[${getMinutesEmbed(time)}:${getSecondsEmbed(time)}]`;
}

function getTimeStats(time) {
    if (getHoursStats(time) > 0) {
        return `${getHoursStats(time)}h${getMinutesStats(time)}m`;
    } else {
        return `${getMinutesStats(time)}m`;
    }
}

function getGoalGame() {
    return game.scores.red + game.scores.blue;
}

/* REPORT FUNCTIONS */

function findFirstNumberCharString(str) {
    let str_number = str[str.search(/[0-9]/g)];
    return str_number === undefined ? "0" : str_number;
}

function getIdReport() {
    var d = new Date();
    return `${d.getFullYear() % 100}${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}${d.getDate() < 10 ? '0' : ''}${d.getDate()}${d.getHours() < 10 ? '0' : ''}${d.getHours()}${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}${d.getSeconds() < 10 ? '0' : ''}${d.getSeconds()}${findFirstNumberCharString(roomName)}`;
}

function getRecordingName(game) {
    let d = new Date();
    let redCap = game.playerComp[0][0] != undefined ? game.playerComp[0][0].player.name : 'Red';
    let blueCap = game.playerComp[1][0] != undefined ? game.playerComp[1][0].player.name : 'Blue';
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let month = d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let year = d.getFullYear() % 100 < 10 ? '0' + (d.getFullYear() % 100) : (d.getFullYear() % 100);
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    return `${day}-${month}-${year}-${hour}h${minute}-${redCap}vs${blueCap}.hbr2`;
}

function fetchRecording(game) {
    if (gameWebhook != "") {
        let form = new FormData();
        form.append(null, new File([game.rec], getRecordingName(game), { "type": "text/plain" }));
        form.append("payload_json", JSON.stringify({
            "username": roomName
        }));

        fetch(gameWebhook, {
            method: 'POST',
            body: form,
        }).then((res) => res);
    }
}

/* FEATURE FUNCTIONS */

function getCommand(commandStr) {
    if (commands.hasOwnProperty(commandStr)) return commandStr;
    for (const [key, value] of Object.entries(commands)) {
        for (let alias of value.aliases) {
            if (alias == commandStr) return key;
        }
    }
    return false;
}

function getPlayerComp(player) {
    if (player == null || player.id == 0) return null;
    var comp = game.playerComp;
    var index = comp[0].findIndex((c) => c.auth == authArray[player.id][0]);
    if (index != -1) return comp[0][index];
    index = comp[1].findIndex((c) => c.auth == authArray[player.id][0]);
    if (index != -1) return comp[1][index];
    return null;
}

function getTeamArray(team, includeAFK = true) {
    if (team == Team.RED) return teamRed;
    if (team == Team.BLUE) return teamBlue;
    if (includeAFK) {
      return playersAll.filter((p) => p.team === Team.SPECTATORS);
    }
    return teamSpec;
}

function sendAnnouncementTeam(message, team, color, style, mention) {
    for (let player of team) {
        room.sendAnnouncement(message, player.id, color, style, mention);
    }
}

function teamChat(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    var emoji = player.team == Team.RED ? '🔴' : player.team == Team.BLUE ? '🔵' : '⚪';
    var message = `${emoji} [TEAM] ${player.name}: ${msgArray.join(' ')}`;
    var team = getTeamArray(player.team, true);
    var color = player.team == Team.RED ? redColor : player.team == Team.BLUE ? blueColor : null;
    var style = 'bold';
    var mention = HaxNotification.CHAT;
    sendAnnouncementTeam(message, team, color, style, mention);
}

function playerChat(player, message) {
    var msgArray = message.split(/ +/);
    var playerTargetIndex = playersAll.findIndex(
        (p) => p.name.replaceAll(' ', '_') == msgArray[0].substring(2)
    );
    if (playerTargetIndex == -1) {
        room.sendAnnouncement(
            `Nie ma takiego numeru`,
            player.id,
            errorColor,
            'bold',
            null
        );
        return false;
    }
    var playerTarget = playersAll[playerTargetIndex];
    if (player.id == playerTarget.id) {
        room.sendAnnouncement(
            `Matce powiedz zeby do ciebie napisala`,
            player.id,
            errorColor,
            'bold',
            null
        );
        return false;
    }
    var messageFrom = `📝 [wiadomość prywatna do ${playerTarget.name}] ${player.name}: ${msgArray.slice(1).join(' ')}`

    var messageTo = `📝 [Wiadomość prywatna od ${player.name}] ${player.name}: ${msgArray.slice(1).join(' ')}`

    room.sendAnnouncement(
        messageFrom,
        player.id,
        privateMessageColor,
        'bold',
        HaxNotification.CHAT
    );
    room.sendAnnouncement(
        messageTo,
        playerTarget.id,
        privateMessageColor,
        'bold',
        HaxNotification.CHAT
    );
}

/* PHYSICS FUNCTIONS */

function calculateStadiumVariables() {
    if (checkStadiumVariable && teamRed.length + teamBlue.length > 0) {
        checkStadiumVariable = false;
        setTimeout(() => {
            // Safe fetch of ball & player disc
            let ballDisc = ballProps();
            const firstPlayer = teamRed.concat(teamBlue)[0];
            let playerDisc = firstPlayer ? room.getPlayerDiscProperties(firstPlayer.id) : null;

            if (!ballDisc) {
                if (typeof refreshDiscIndexes === "function") refreshDiscIndexes();
                ballDisc = ballProps();
            }
            if (!ballDisc || !playerDisc) {
                // Unable to compute yet; try again shortly and exit gracefully.
                setTimeout(calculateStadiumVariables, 50);
                return;
            }

            const bR = typeof ballDisc.radius === "number" ? ballDisc.radius : 0;
            const pR = typeof playerDisc.radius === "number" ? playerDisc.radius : 0;
            const invM = typeof ballDisc.invMass === "number" ? ballDisc.invMass : 1;
            const damp = typeof ballDisc.damping === "number" ? ballDisc.damping : 0;

            ballRadius = bR;
            playerRadius = pR;
            triggerDistance = bR + pR + 0.01;
            speedCoefficient = 100 / (5 * invM * (Math.pow(damp, 60) + 1));
        }, 1);
    }
}

function checkGoalKickTouch(array, index, goal) {
    if (array != null && array.length >= index + 1) {
        var obj = array[index];
        if (obj != null && obj.goal != null && obj.goal == goal) return obj;
    }
    return null;
}

/* BUTTONS */

function topButton() {
    if (teamSpec.length > 0) {
        if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
            room.setPlayerTeam(teamSpec[0].id, Team.RED);
            room.setPlayerTeam(teamSpec[1].id, Team.BLUE);
        } else if (teamRed.length < teamBlue.length)
            room.setPlayerTeam(teamSpec[0].id, Team.RED);
        else room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
    }
}

function randomButton() {
    if (teamSpec.length > 0) {
        if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
            var r = getRandomInt(teamSpec.length);
            room.setPlayerTeam(teamSpec[r].id, Team.RED);
            teamSpec = teamSpec.filter((spec) => spec.id != teamSpec[r].id);
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
        } else if (teamRed.length < teamBlue.length)
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.RED);
        else
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
    }
}

function blueToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamBlue.length; i++) {
        room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
    }
}

function redToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamRed.length; i++) {
        room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
    }
}

function resetButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (let i = 0; i < Math.max(teamRed.length, teamBlue.length); i++) {
        if (Math.max(teamRed.length, teamBlue.length) - teamRed.length - i > 0)
            room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
        else if (Math.max(teamRed.length, teamBlue.length) - teamBlue.length - i > 0)
            room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
        else break;
    }
    for (let i = 0; i < Math.min(teamRed.length, teamBlue.length); i++) {
        room.setPlayerTeam(
            teamBlue[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
            Team.SPECTATORS
        );
        room.setPlayerTeam(
            teamRed[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
            Team.SPECTATORS
        );
    }
}

function swapButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (let player of teamBlue) {
        room.setPlayerTeam(player.id, Team.RED);
    }
    for (let player of teamRed) {
        room.setPlayerTeam(player.id, Team.BLUE);
    }
}

/* COMMAND FUNCTIONS */

/* PLAYER COMMANDS */

function leaveCommand(player, message) {
    room.kickPlayer(player.id, 'Bywaj', false);
}
function helpCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
        var commandString = 'Komendy gracza:';
        for (const [key, value] of Object.entries(commands)) {
            if (value.desc && value.roles == Role.PLAYER) commandString += ` !${key},`;
        }
        commandString = commandString.substring(0, commandString.length - 1) + '.\n';
        if (getRole(player) >= Role.ADMIN_TEMP) {
            commandString += `Komendy admina:`;
            for (const [key, value] of Object.entries(commands)) {
                if (value.desc && value.roles == Role.ADMIN_TEMP) commandString += ` !${key},`;
            }
            if (commandString.slice(commandString.length - 1) == ':')
                commandString += ` None,`;
            commandString = commandString.substring(0, commandString.length - 1) + '.\n';
        }
        if (getRole(player) >= Role.MASTER) {
            commandString += `Komendy pana:`;
            for (const [key, value] of Object.entries(commands)) {
                if (value.desc && value.roles == Role.MASTER) commandString += ` !${key},`;
            }
            if (commandString.slice(commandString.length - 1) == ':') commandString += ` None,`;
            commandString = commandString.substring(0, commandString.length - 1) + '.\n';
        }
        commandString += "\nMożesz dowiedzieć się, co robi komenda pisząć: ''!help <command name>'.";
        room.sendAnnouncement(
            commandString,
            player.id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    } else if (msgArray.length >= 1) {
        var commandName = getCommand(msgArray[0].toLowerCase());
        if (commandName != false && commands[commandName].desc != false)
            room.sendAnnouncement(
                `\'${commandName}\' command :\n${commands[commandName].desc}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
        else
            room.sendAnnouncement(
                `Nie ma takiej komendy`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
    }
}

function globalStatsCommand(player, message) {
    var stats = new HaxStatistics(player.name);
    if (localStorage.getItem(authArray[player.id][0])) {
        stats = JSON.parse(localStorage.getItem(authArray[player.id][0]));
    }
    var statsString = printPlayerStats(stats);
    room.sendAnnouncement(
        statsString,
        player.id,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
}

function renameCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (localStorage.getItem(authArray[player.id][0])) {
        var stats = JSON.parse(localStorage.getItem(authArray[player.id][0]));
        if (msgArray.length == 0) {
            stats.playerName = player.name;
        } else {
            stats.playerName = msgArray.join(' ');
        }
        localStorage.setItem(authArray[player.id][0], JSON.stringify(stats));
        room.sendAnnouncement(
            `Przechrzciłeś się skutecznie ${stats.playerName} !`,
            player.id,
            successColor,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        room.sendAnnouncement(
            `Jeszcze tu nie grałeś`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function statsLeaderboardCommand(player, message) {
    var key = message.split(/ +/)[0].substring(1).toLowerCase();
    // Mapuj polskie aliasy (i kanoniczne) na klucz statystyki
    // Nie tworzymy nowych helperów – wszystko inline
    var map = {
        'gry': 'games',
        'games': 'games',
        'zwyciestwa': 'wins',
        'wygrane': 'wins',
        'wins': 'wins',
        'gole': 'goals',
        'bramki': 'goals',
        'goals': 'goals',
        'asysty': 'assists',
        'assists': 'assists',
        'cs': 'cs',
        'czystokonto': 'cs',
        'czas': 'playtime',
        'playtime': 'playtime'
    };
    key = map[key] || key;
    printRankings(key, player.id);
}

function statsCommand(player, message) {
    try {
        const auth = getAuthIdByPlayer(player);
        if (!auth) {
            room.sendAnnouncement(`Nie rozpoznano Twojego ID.`, player.id, errorColor, 'bold', HaxNotification.CHAT);
            return;
        }
        let stats = localStorage.getItem(auth);
        if (stats) stats = JSON.parse(stats);
        else stats = new HaxStatistics(player.name);

        const games = Number(stats.games) || 0;
        const wins = Number(stats.wins) || 0;
        const winrate = (typeof stats.winrate === 'string') ? stats.winrate : ((100 * wins) / (games || 1)).toFixed(2) + '%';
        const playtimeMin = Math.floor((Number(stats.playtime) || 0) / 60);
        const goals = Number(stats.goals) || 0;
        const assists = Number(stats.assists) || 0;
        const cs = Number(stats.CS) || 0;
        const ownGoals = Number(stats.ownGoals) || 0;

        const msg = `Games: ${games}, Wins: ${wins}, Winrate: ${winrate}, Playtime: ${playtimeMin}m, Goals: ${goals}, Assists: ${assists}, CS: ${cs}, Own Goals: ${ownGoals}`;
        room.sendAnnouncement(msg, player.id, announcementColor, 'bold', HaxNotification.CHAT);
    } catch (e) {
        room.sendAnnouncement(`Błąd przy odczycie statystyk.`, player.id, errorColor, 'bold', HaxNotification.CHAT);
    }
}

function afkCommand(player, message) {
    if (AFKSet.has(player.id)) {

        AFKSet.delete(player.id);
        room.sendAnnouncement(
            `🌅 ${player.name} Nie jest już AFK!`,
            player.id,
            announcementColor,
            'bold',
            null
        );
        updateTeams();
        handlePlayersJoin();

    } else {
        AFKSet.add(player.id);
        room.setPlayerTeam(player.id, Team.SPECTATORS);
        room.sendAnnouncement(
            `😴 ${player.name} Jest afk`,
            player.id,
            announcementColor,
            'bold',
            null
        );
        updateTeams();
        handlePlayersLeave();
        balanceTeams();
    }
}

function afkListCommand(player, message) {
    if (AFKSet.size == 0) {
        room.sendAnnouncement(
            "😴 Nik nie jest afk!",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return;
    }
    var cstm = '😴 AFK list : ';
    AFKSet.forEach((_, value) => {
        var p = room.getPlayer(value);
        if (p != null) cstm += p.name + `, `;
    });
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null);
}

function masterCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    var isInMasterRole = masterList.includes(authArray[player.id][0]);
    var isInAdminRole = adminList.find(a => a[0] == authArray[player.id][0]);
    if (msgArray[0] == masterPassword && (isInMasterRole || isInAdminRole)) {
        if (!player.admin) {
            
            room.setPlayerAdmin(player.id, true);
            room.sendAnnouncement(
                `${player.name} jest ${isInMasterRole ? 'adminem' : 'adminem'}.`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `Jesteś juz adminem !`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
}

/* ADMIN COMMANDS */

function restartCommand(player, message) {
    instantRestart();
}

function restartSwapCommand(player, message) {
    room.stopGame();
    swapButton();
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 10);
}

function swapCommand(player, message) {
    if (playSituation == Situation.STOP) {
        swapButton();
        room.sendAnnouncement(
            '✔️ Drużyny przerzucone!',
            player.id,
            announcementColor,
            'bold',
            null
        );
    } else {
        room.sendAnnouncement(
            `Zatrzymaj grę, przed przerzucankiem`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function kickTeamCommand(player, message) {
    var msgArray = message.split(/ +/);
    var reasonString = `Druzyna wyjebana dzięki ${player.name}!`;
    if (msgArray.length > 1) {
        reasonString = msgArray.slice(1).join(' ');
    }
    if (['!kickred', '!kickr'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamRed.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamRed[0].id, reasonString, false);
            }, i * 20)
        }
    } else if (['!kickblue', '!kickb'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamBlue.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamBlue[0].id, reasonString, false);
            }, i * 20)
        }
    } else if (['!kickspec', '!kicks'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamSpec.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamSpec[0].id, reasonString, false);
            }, i * 20)
        }
    }
}

function stadiumCommand(player, message) {
    var msgArray = message.split(/ +/);
    if (gameState == State.STOP) {
        if (['!classic'].includes(msgArray[0].toLowerCase())) {
            if (JSON.parse(classicMap).name == 'Classic') {
                room.setDefaultStadium('Classic');
            } else {
                room.setCustomStadium(classicMap);
            }
            currentStadium = 'classic';
        } else if (['!big'].includes(msgArray[0].toLowerCase())) {
            if (JSON.parse(bigMap).name == 'Big') {
                room.setDefaultStadium('Big');
            } else {
                room.setCustomStadium(bigMap);
            }
            currentStadium = 'big';
        } else if (['!training'].includes(msgArray[0].toLowerCase())) {
            room.setCustomStadium(trainingMap);
            currentStadium = 'training';
        } else {
            room.sendAnnouncement(
                `Stadium not recognized.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Zatrzymaj grę, zanim użyjesz tej komendy`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function muteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerMute = room.getPlayer(parseInt(msgArray[0]));
                var minutesMute = muteDuration;
                if (msgArray.length > 1 && parseInt(msgArray[1]) > 0) {
                    minutesMute = parseInt(msgArray[1]);
                }
                if (!playerMute.admin) {
                    var muteObj = new MutePlayer(playerMute.name, playerMute.id, authArray[playerMute.id][0]);
                    muteObj.setDuration(minutesMute);
                    room.sendAnnouncement(
                        `${playerMute.name} został wyciszony na ${minutesMute} minut.`,
                        player.id,
                        announcementColor,
                        'bold',
                        null
                    );
                } else {
                    room.sendAnnouncement(
                        `Nie wyciszysz admina`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `Nie ma takiego numeru`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `zły format dla twojego argumentu. Wpisz "!help mute" po wiecej informacji.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Zła liczba argumentów. Wpisz "!help mute" po wiecej informacji.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function unmuteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerUnmute = room.getPlayer(parseInt(msgArray[0]));
                if (muteArray.getByPlayerId(playerUnmute.id) != null) {
                    var muteObj = muteArray.getByPlayerId(playerUnmute.id);
                    muteObj.remove()
                    room.sendAnnouncement(
                        `${playerUnmute.name} może gadać!`,
                        player.id,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.sendAnnouncement(
                        `Nie jest wyciszony`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `Nie ma takiego ID na roomie. Wpisz "!help unmute" po wiecej informacji.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) > 0 && muteArray.getById(parseInt(msgArray[0])) != null) {
            var playerUnmute = muteArray.getById(parseInt(msgArray[0]));
            playerUnmute.remove();
            room.sendAnnouncement(
                `${playerUnmute.name} może gadać`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `Zły format dla twojego argumentu. Wpisz "!help unmute" po wiecej informacji.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Zła liczba argumentów. Wpisz "!help unmute" po wiecej informacji.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function muteListCommand(player, message) {
    if (muteArray.list.length == 0) {
        room.sendAnnouncement(
            "🔇 Nikt nie jest wyciszony.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '🔇 Lista wyciszonych: ';
    for (let mute of muteArray.list) {
        cstm += mute.name + `[${mute.id}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

/* MASTER COMMANDS */

function clearbansCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
        room.clearBans();
        room.sendAnnouncement(
            '✔️ Bany usunięte!',
            player.id,
            announcementColor,
            'bold',
            null
        );
        banList = [];
    } else if (msgArray.length == 1) {
        if (parseInt(msgArray[0]) > 0) {
            var ID = parseInt(msgArray[0]);
            room.clearBan(ID);
            if (banList.length != banList.filter((p) => p[1] != ID).length) {
                room.sendAnnouncement(
                    `✔️ ${banList.filter((p) => p[1] == ID)[0][0]} Został odbanowany!`,
                    player.id,
                    announcementColor,
                    'bold',
                    null
                );
            } else {
                room.sendAnnouncement(
                    `To ID nie ma bana. Wpisz "!help clearbans" po instrukcje.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            banList = banList.filter((p) => p[1] != ID);
        } else {
            room.sendAnnouncement(
                `Złe ID. Wpisz "!help clearbans" po instrukcje.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Zła liczba argumentów. Wpisz "!help clearbans" po instrukcje.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function banListCommand(player, message) {
    if (banList.length == 0) {
        room.sendAnnouncement(
            "📢 Nie ma nikogo na ban liście",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '📢 Ban lista : ';
    for (let ban of banList) {
        cstm += ban[0] + `[${ban[1]}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

function adminListCommand(player, message) {
    if (adminList.length == 0) {
        room.sendAnnouncement(
            "📢 Nie ma nikogo na liście adminów",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '📢 Admin lista : ';
    for (let i = 0; i < adminList.length; i++) {
        cstm += adminList[i][1] + `[${i}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

function setAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                if (!adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])) {
                    if (!masterList.includes(authArray[playerAdmin.id][0])) {
                        room.setPlayerAdmin(playerAdmin.id, true);
                        adminList.push([authArray[playerAdmin.id][0], playerAdmin.name]);
                        room.sendAnnouncement(
                            `${playerAdmin.name} Jest teraz room adminem!`,
                            player.id,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.sendAnnouncement(
                            `Jest już adminem!`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `Gracz jest już wiecznym adminem!`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `Nie ma gracza o takim ID. Wpisz `,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Zły format dla twojego argumentu. Wpisz "!help setadmin" po instrukcje.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Zła liczba argumentów. Wpisz "!help setadmin" po instrukcje.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function removeAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                if (adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])) {
                    room.setPlayerAdmin(playerAdmin.id, false);
                    adminList = adminList.filter((a) => a[0] != authArray[playerAdmin.id][0]);
                    room.sendAnnouncement(
                        `${playerAdmin.name} Nie jest room adminem już!`,
                        player.id,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.sendAnnouncement(
                        `Nie jest wiecznym adminem!`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `Nie ma gracza o takim ID na roomie. Wpisz "!help removeadmin" po wiecej informacji.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) < adminList.length) {
            var index = parseInt(msgArray[0]);
            var playerAdmin = adminList[index];
            if (playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]) != -1) {
                // check if there is the removed admin in the room
                var indexRem = playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]);
                room.setPlayerAdmin(playersAll[indexRem].id, false);
            }
            adminList.splice(index);
            room.sendAnnouncement(
                `${playerAdmin[1]} już nie jest rooom adminem!`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `Zły format dla twojego argumentu. Wpisz "!help removeadmin" po więcej informacji`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Zła liczba argumentów. Wpisz "!help removeadmin" Po więcej informacji`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function passwordCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray.length == 1 && msgArray[0] == '') {
            roomPassword = '';
            room.setPassword(null);
            room.sendAnnouncement(
                `Hasło rooma usunięte`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
        roomPassword = msgArray.join(' ');
        room.setPassword(roomPassword);
        room.sendAnnouncement(
            `Hasło rooma ustawione na:  ${roomPassword}`,
            player.id,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        if (roomPassword != '') {
            roomPassword = '';
            room.setPassword(null);
            room.sendAnnouncement(
                `Hasło rooma usunięte`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `Room nie ma hasła.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
}

/* GAME FUNCTIONS */

function checkTime() {
  const scores = room.getScores();
  if (game !== undefined) game.scores = scores;

  // --- KONIEC CZASU REGULAMINOWEGO ---
  if (
    scores.timeLimit !== 0 &&
    playSituation === Situation.PLAY &&
    Math.abs(scores.time - scores.timeLimit) <= 0.01
  ) {
    if (!checkTimeVariable) {
      checkTimeVariable = true;
      setTimeout(() => { checkTimeVariable = false; }, 3000);

      if (scores.red > scores.blue) {
        endGame(Team.RED);
      } else if (scores.red < scores.blue) {
        endGame(Team.BLUE);
      } else {
        // REMIS
        if (drawTimeLimit && drawTimeLimit !== 0) {
          // włączamy złotego gola (dogrywka)
          goldenGoal = true;
          room.sendAnnouncement(
            '⚽ Złoty gol!',
            null,                 // DO WSZYSTKICH – nie ma tu player.id
            announcementColor,
            'bold',
            HaxNotification.CHAT
          );
          return; // gramy dalej do złotego gola
        } else {
          // brak dogrywki -> remis
          endGame(Team.SPECTATORS);
        }
      }

      // zatrzymanie gry po ogłoszeniu wyniku (wygrana/przegrana lub remis bez dogrywki)
      stopTimeout = setTimeout(() => {
        try { room.stopGame(); } catch(_) {}
      }, 2000);
    }
    return;
  }

  // --- KONIEC DOGRYWKI (ZŁOTY GOL NIE PADŁ) ---
  // Uwaga: drawTimeLimit to minuty -> *60 w sekundach czasu meczu
  if (
    goldenGoal &&
    scores.timeLimit !== 0 &&
    Math.abs(scores.time - (scores.timeLimit + drawTimeLimit * 60)) <= 0.01
  ) {
    if (!checkTimeVariable) {
      checkTimeVariable = true;
      setTimeout(() => { checkTimeVariable = false; }, 10);
      endGame(Team.SPECTATORS); // remis
      try { room.stopGame(); } catch(_) {}
      goldenGoal = false;
    }
    return;
  }
}


function instantRestart() {
    room.stopGame();
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 10);
}

function resumeGame() {
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 1000);
    setTimeout(() => {
        room.pauseGame(false);
    }, 500);
}

function endGame(winner) {
    if (players.length >= 2 * teamSize - 1) activateChooseMode();
    const scores = room.getScores();
    game.scores = scores;
    lastWinner = winner;
    endGameVariable = true;
    if (winner == Team.RED) {
        streak++;
        room.sendAnnouncement(
            `✨ Czerwoni wygrali. ${scores.red} - ${scores.blue} ! To: ${streak} wygrana z rzędu!`, null,
            redColor,
            'bold',
            HaxNotification.CHAT
        );
    } else if (winner == Team.BLUE) {
        streak = 1;
        room.sendAnnouncement(
            `✨ Niebiescy wygrali ${scores.blue} - ${scores.red}! To: ${streak} wygrana z rzędu!`, null,
            blueColor,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        streak = 0;
        room.sendAnnouncement(
            '💤 Czas na dobieranie minął!', null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    let possessionRedPct = (possession[0] / (possession[0] + possession[1])) * 100;
    let possessionBluePct = 100 - possessionRedPct;
    let possessionString = `🔴 ${possessionRedPct.toFixed(0)}% - ${possessionBluePct.toFixed(0)}% 🔵`;
    let actionRedPct = (actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])) * 100;
    let actionBluePct = 100 - actionRedPct;
    let actionString = `🔴 ${actionRedPct.toFixed(0)}% - ${actionBluePct.toFixed(0)}% 🔵`;
    let CSString = getCSString(scores);
    room.sendAnnouncement(
        `📊 Posiadanie: 🔴 ${possessionString}\n` +
        `📊 Presja: 🔴 ${actionString}\n` +
        `${CSString}`, null,
        announcementColor,
        'bold',
        HaxNotification.NONE
    );
    updateStats();
}

/* CHOOSING FUNCTIONS */

function activateChooseMode() {
    chooseMode = true;
    slowMode = chooseModeSlowMode;
    room.sendAnnouncement(
        `🐢 Tryb powolny włączony na: ${chooseModeSlowMode}s.`,
        null,
        announcementColor,
        'bold',
        HaxNotification.CHAT
    );
}

function deactivateChooseMode() {
    chooseMode = false;
    clearTimeout(timeOutCap);
    if (slowMode != defaultSlowMode) {
        slowMode = defaultSlowMode;
        room.sendAnnouncement(
            `🐢 Slow mode changed to choose mode duration of: ${defaultSlowMode}s.`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    redCaptainChoice = '';
    blueCaptainChoice = '';
}

const fallbackRankTable = [
    { max: 850, label: 'Gówienko' },
    { max: 950, label: 'Żółtodziób' },
    { max: 1050, label: 'Początkujący' },
    { max: 1199, label: 'Gracz' },
    { max: 1299, label: 'Kox' },
    { max: 1399, label: 'Mistrz' },
    { max: 1550, label: 'Legenda' },
    { max: Infinity, label: 'Nieśmiertelny' },
];

const fallbackRankBadges = {
    'Gówienko': '💩',
    'Żółtodziób': '🐣',
    'Początkujący': '⚪',
    'Gracz': '🥉',
    'Kox': '🥈',
    'Mistrz': '🥇',
    'Legenda': '👑',
    'Nieśmiertelny': '🔥',
};

function fallbackClassLabelFromRating(rating) {
    var value = Number(rating);
    if (!isFinite(value)) value = 1000;
    for (var i = 0; i < fallbackRankTable.length; i++) {
        if (value <= fallbackRankTable[i].max) {
            return fallbackRankTable[i].label;
        }
    }
    return 'Nieśmiertelny';
}

function fallbackBadgeFromLabel(label) {
    return fallbackRankBadges[label] || '😶';
}

function getSpecList(player) {
    if (player == null) return null;
    const g = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined' ? window : {});
    const ensureProfileFn = typeof g.ensureProfile === 'function' ? g.ensureProfile : null;
    const classLabelFn = typeof g.classLabel === 'function' ? g.classLabel : null;
    const rankEmojiFn = typeof g.rankEmoji === 'function' ? g.rankEmoji : null;
    var cstm = 'Gracze : ';
    for (var i = 0; i < teamSpec.length; i++) {
        var p = teamSpec[i];
        var badge = '';
        try {
            var aid = null;
            try { aid = getAuthIdByPlayer(p); } catch(e) {}
            if (!aid && typeof authArray !== 'undefined' && authArray[p.id] && authArray[p.id][0]) {
                aid = authArray[p.id][0];
            }
            if (aid) {
                // Upewnij się, że profil istnieje
                if (ensureProfileFn) {
                    try { ensureProfileFn(aid, p && p.name ? p.name : undefined); } catch(_e) {}
                }
                var store = (typeof globalThis !== 'undefined' && globalThis.__eloStore) ? globalThis.__eloStore : null;
                var ratings = store && store.ratings;
            var r = Number(ratings && ratings[aid] != null ? ratings[aid] : NaN);
            if (!isFinite(r)) r = 1000; // domyślnie 1000
            var lab = classLabelFn ? classLabelFn(r) : fallbackClassLabelFromRating(r);
            badge = rankEmojiFn && lab ? rankEmojiFn(lab) : fallbackBadgeFromLabel(lab);
            if (!badge || badge === '😶') {
                badge = fallbackBadgeFromLabel(lab);
            }
        } else {
            badge = "😶";
        }
    } catch (e) {
        // W razie błędu nie psuj listy wyboru
        badge = "😶";
    }
        if (!badge) {
            badge = "😶";
        }
        cstm += (badge ? (badge + ' ') : '') + p.name + '[' + (i + 1) + '], ';
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
}

function choosePlayer() {
    clearTimeout(timeOutCap);
    let captain;
    if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
        captain = teamRed[0];
    } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
        captain = teamBlue[0];
    }
    if (captain != null) {
        room.sendAnnouncement(
            "Żeby wybrać grajców, wpisz jego numer w liście, lub użyj 'top', 'random', 'bottom'.",
            captain.id,
            infoColor,
            'bold',
            HaxNotification.MENTION
        );
        timeOutCap = setTimeout(
            (player) => {
                room.sendAnnouncement(
                    `Szybciej ${player.name}, tylko ${Number.parseInt(String(chooseTime / 2))} sekund na wybór !`,
                    player.id,
                    warningColor,
                    'bold',
                    HaxNotification.MENTION
                );
                timeOutCap = setTimeout(
                    (player) => {
                        room.kickPlayer(
                            player.id,
                            "Nie wybrałeś na czas",
                            false
                        );
                    },
                    chooseTime * 500,
                    captain
                );
            },
            chooseTime * 1000,
            captain
        );
    }
    if (teamRed.length != 0 && teamBlue.length != 0) {
        getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
}

function chooseModeFunction(player, message) {
    var msgArray = message.split(/ +/);
    if (player.id == teamRed[0].id || player.id == teamBlue[0].id) {
        if (teamRed.length <= teamBlue.length && player.id == teamRed[0].id) {
            if (['top', 'auto'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
                redCaptainChoice = 'top';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Top !`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['random', 'rand'].includes(msgArray[0].toLowerCase())) {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
                redCaptainChoice = 'random';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} Wybiera los!`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['bottom', 'bot'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
                redCaptainChoice = 'bottom';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} wybiera dół!`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                    room.sendAnnouncement(
                        `Twój numer jest niewłaściwy!`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.setPlayerTeam(
                        teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                        Team.RED
                    );
                    room.sendAnnouncement(
                        `${player.name} chose ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} !`,
                        player.id,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else return false;
            return true;
        }
        if (teamRed.length > teamBlue.length && player.id == teamBlue[0].id) {
            if (['top', 'auto'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                blueCaptainChoice = 'top';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} wybiera górę!`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['random', 'rand'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(
                    teamSpec[getRandomInt(teamSpec.length)].id,
                    Team.BLUE
                );
                blueCaptainChoice = 'random';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} Wybiera los!`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['bottom', 'bot'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
                blueCaptainChoice = 'bottom';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} wybiera dół!`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                    room.sendAnnouncement(
                        `Twoj numer jest niewłaściwy!`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.setPlayerTeam(
                        teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                        Team.BLUE
                    );
                    room.sendAnnouncement(
                        `${player.name} wybiera ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} !`,
                        player.id,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else return false;
            return true;
        }
    }
}

function checkCaptainLeave(player) {
    if (
        (teamRed.findIndex((red) => red.id == player.id) == 0 && chooseMode && teamRed.length <= teamBlue.length) ||
        (teamBlue.findIndex((blue) => blue.id == player.id) == 0 && chooseMode && teamBlue.length < teamRed.length)
    ) {
        choosePlayer();
        capLeft = true;
        setTimeout(() => {
            capLeft = false;
        }, 10);
    }
}

function slowModeFunction(player, message) {
    if (!player.admin) {
        if (!SMSet.has(player.id)) {
            SMSet.add(player.id);
            setTimeout(
                (number) => {
                    SMSet.delete(number);
                },
                slowMode * 1000,
                player.id
            );
        } else {
            return true;
        }
    }
    return false;
}

/* PLAYER FUNCTIONS */

function updateTeams() {
    playersAll = room.getPlayerList();
    players = playersAll.filter((p) => !AFKSet.has(p.id));
    teamRed = players.filter((p) => p.team == Team.RED);
    teamBlue = players.filter((p) => p.team == Team.BLUE);
    teamSpec = players.filter((p) => p.team == Team.SPECTATORS);
}

function updateAdmins(excludedPlayerID = 0) {
    if (players.length != 0 && players.filter((p) => p.admin).length < maxAdmins) {
        let playerArray = players.filter((p) => p.id != excludedPlayerID && !p.admin);
        let arrayID = playerArray.map((player) => player.id);
        room.setPlayerAdmin(Math.min(...arrayID), true);
    }
}

function getRole(player) {
    return (
        !!masterList.find((a) => a == authArray[player.id][0]) * 2 +
        !!adminList.find((a) => a[0] == authArray[player.id][0]) * 1 +
        player.admin * 1
    );
}

function ghostKickHandle(oldP, newP) {
    var teamArrayId = getTeamArray(oldP.team, true).map((p) => p.id);
    teamArrayId.splice(teamArrayId.findIndex((id) => id == oldP.id), 1, newP.id);

    room.kickPlayer(oldP.id, 'kop ducha', false);
    room.setPlayerTeam(newP.id, oldP.team);
    room.setPlayerAdmin(newP.id, oldP.admin);
    room.reorderPlayers(teamArrayId, true);

    if (oldP.team != Team.SPECTATORS && playSituation != Situation.STOP) {
        var discProp = room.getPlayerDiscProperties(oldP.id);
        room.setPlayerDiscProperties(newP.id, discProp);
    }
}

/* ACTIVITY FUNCTIONS */

function handleActivityPlayer(player) {
    let pComp = getPlayerComp(player);
    if (pComp != null) {
        pComp.inactivityTicks++;
        if (pComp.inactivityTicks == 60 * ((2 / 3) * afkLimit)) {
            room.sendAnnouncement(
                `⛔ ${player.name}, jeśli nie dasz nam znaku życia w ${Math.floor(afkLimit / 3)} sekund, wykopię Cię!`,
                player.id,
                warningColor,
                'bold',
                HaxNotification.MENTION
            );
            return;
        }
        if (pComp.inactivityTicks >= 60 * afkLimit) {
            pComp.inactivityTicks = 0;
            if (game.scores.time <= afkLimit - 0.5) {
                setTimeout(() => {
                    !chooseMode ? instantRestart() : room.stopGame();
                }, 10);
            }
            room.kickPlayer(player.id, 'AFK', false);
        }
    }
}

function handleActivityPlayerTeamChange(changedPlayer) {
    if (changedPlayer.team == Team.SPECTATORS) {
        let pComp = getPlayerComp(changedPlayer);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
}

function handleActivityStop() {
    for (let player of players) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
}

function handleActivity() {
    if (gameState === State.PLAY && players.length > 1) {
        for (let player of teamRed) {
            handleActivityPlayer(player);
        }
        for (let player of teamBlue) {
            handleActivityPlayer(player);
        }
    }
}

/* LINEUP FUNCTIONS */

function getStartingLineups() {
    var compositions = [[], []];
    for (let player of teamRed) {
        compositions[0].push(
            new PlayerComposition(player, authArray[player.id][0], [0], [])
        );
    }
    for (let player of teamBlue) {
        compositions[1].push(
            new PlayerComposition(player, authArray[player.id][0], [0], [])
        );
    }
    return compositions;
}

function handleLineupChangeTeamChange(changedPlayer) {
    if (gameState != State.STOP) {
        var playerLineup;
        if (changedPlayer.team == Team.RED) {
            // player gets in red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
            if (ind != -1) {
                // Player goes back in
                playerLineup = game.playerComp[0][ind];
                if (playerLineup.timeExit.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    playerLineup.timeExit = playerLineup.timeExit.filter((t) => t != game.scores.time);
                } else {
                    playerLineup.timeEntry.push(game.scores.time);
                }
            } else {
                playerLineup = new PlayerComposition(
                    changedPlayer,
                    authArray[changedPlayer.id][0],
                    [game.scores.time],
                    []
                );
                game.playerComp[0].push(playerLineup);
            }
        } else if (changedPlayer.team == Team.BLUE) {
            // player gets in blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
            if (ind != -1) {
                // Player goes back in
                playerLineup = game.playerComp[1][ind];
                if (playerLineup.timeExit.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    playerLineup.timeExit = playerLineup.timeExit.filter((t) => t != game.scores.time);
                } else {
                    playerLineup.timeEntry.push(game.scores.time);
                }
            } else {
                playerLineup = new PlayerComposition(
                    changedPlayer,
                    authArray[changedPlayer.id][0],
                    [game.scores.time],
                    []
                );
                game.playerComp[1].push(playerLineup);
            }
        }
        if (teamRed.some((r) => r.id == changedPlayer.id)) {
            // player leaves red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
            playerLineup = game.playerComp[0][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[0].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        } else if (teamBlue.some((r) => r.id == changedPlayer.id)) {
            // player leaves blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
            playerLineup = game.playerComp[1][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[1].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        }
    }
}

function handleLineupChangeLeave(player) {
    if (playSituation != Situation.STOP) {
        if (player.team == Team.RED) {
            // player gets in red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[player.id][0]);
            var playerLineup = game.playerComp[0][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[0].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        } else if (player.team == Team.BLUE) {
            // player gets in blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[player.id][0]);
            var playerLineup = game.playerComp[1][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[1].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        }
    }
}

/* TEAM BALANCE FUNCTIONS */

function balanceTeams() {
    if (!chooseMode) {
        if (players.length == 0) {
            room.stopGame();
            room.setScoreLimit(scoreLimit);
            room.setTimeLimit(timeLimit);
        } else if (players.length == 1 && teamRed.length == 0) {
            instantRestart();
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!training`);
            }, 5);
            room.setPlayerTeam(players[0].id, Team.RED);
        } else if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length && teamSpec.length > 0) {
            const n = Math.abs(teamRed.length - teamBlue.length);
            if (players.length == 2) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!classic`);
                }, 5);
            }
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamSpec[i].id, Team.BLUE);
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamSpec[i].id, Team.RED);
                }
            }
        } else if (Math.abs(teamRed.length - teamBlue.length) > teamSpec.length) {
            const n = Math.abs(teamRed.length - teamBlue.length);
            if (players.length == 1) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!training`);
                }, 5);
                room.setPlayerTeam(players[0].id, Team.RED);
                return;
            } else if (teamSize > 2 && players.length == 5) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!classic`);
                }, 5);
            }
            if (players.length == teamSize * 2 - 1) {
                teamRedStats = [];
                teamBlueStats = [];
            }
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamRed[teamRed.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamBlue[teamBlue.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            }
        } else if (Math.abs(teamRed.length - teamBlue.length) < teamSpec.length && teamRed.length != teamBlue.length) {
            room.pauseGame(true);
            activateChooseMode();
            choosePlayer();
        } else if (teamSpec.length >= 2 && teamRed.length == teamBlue.length && teamRed.length < teamSize) {
            if (teamRed.length == 2) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!big`);
                }, 5);
            }
            topButton();
        }
    }
}

function handlePlayersJoin() {
    if (chooseMode) {
        if (teamSize > 2 && players.length == 6) {
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!big`);
            }, 5);
        }
        getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
    balanceTeams();
}

function handlePlayersLeave() {
    if (gameState != State.STOP) {
        var scores = room.getScores();
        if (players.length >= 2 * teamSize && scores.time >= (5 / 6) * game.scores.timeLimit && teamRed.length != teamBlue.length) {
            var rageQuitCheck = false;
            if (teamRed.length < teamBlue.length) {
                if (scores.blue - scores.red == 2) {
                    endGame(Team.BLUE);
                    rageQuitCheck = true;
                }
            } else {
                if (scores.red - scores.blue == 2) {
                    endGame(Team.RED);
                    rageQuitCheck = true;
                }
            }
            if (rageQuitCheck) {
                room.sendAnnouncement(
                    "Ktoś się spłakał i zabrał piłkę. Koniec meczu.",
                    player.id,
                    infoColor,
                    'bold',
                    HaxNotification.MENTION
                )
                stopTimeout = setTimeout(() => {
                    room.stopGame();
                }, 100);
                return;
            }
        }
    }
    if (chooseMode) {
        if (teamSize > 2 && players.length == 5) {
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!classic`);
            }, 5);
        }
        if (teamRed.length == 0 || teamBlue.length == 0) {
            room.setPlayerTeam(teamSpec[0].id, teamRed.length == 0 ? Team.RED : Team.BLUE);
            return;
        }
        if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
            deactivateChooseMode();
            resumeGame();
            var b = teamSpec.length;
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            } else {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            }
            return;
        }
        if (streak == 0 && gameState == State.STOP) {
            if (Math.abs(teamRed.length - teamBlue.length) == 2) {
                var teamIn = teamRed.length > teamBlue.length ? teamRed : teamBlue;
                room.setPlayerTeam(teamIn[teamIn.length - 1].id, Team.SPECTATORS)
            }
        }
        if (teamRed.length == teamBlue.length && teamSpec.length < 2) {
            deactivateChooseMode();
            resumeGame();
            return;
        }

        if (capLeft) {
            choosePlayer();
        } else {
            getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
        }
    }
    balanceTeams();
}

function handlePlayersTeamChange(byPlayer) {
    if (chooseMode && !removingPlayers && byPlayer == null) {
        if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
            deactivateChooseMode();
            resumeGame();
            var b = teamSpec.length;
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            } else {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            }
            return;
        } else if (
            (teamRed.length == teamSize && teamBlue.length == teamSize) ||
            (teamRed.length == teamBlue.length && teamSpec.length < 2)
        ) {
            deactivateChooseMode();
            resumeGame();
        } else if (teamRed.length <= teamBlue.length && redCaptainChoice != '') {
            if (redCaptainChoice == 'top') {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
            } else if (redCaptainChoice == 'random') {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
            } else {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
            }
            return;
        } else if (teamBlue.length < teamRed.length && blueCaptainChoice != '') {
            if (blueCaptainChoice == 'top') {
                room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
            } else if (blueCaptainChoice == 'random') {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.BLUE);
            } else {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
            }
            return;
        } else {
            choosePlayer();
        }
    }
}

function handlePlayersStop(byPlayer) {
    if (byPlayer == null && endGameVariable) {
        if (chooseMode) {
            if (players.length == 2 * teamSize) {
                chooseMode = false;
                resetButton();
                for (var i = 0; i < teamSize; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        randomButton();
                    }, 200 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 200 * teamSize);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else if (lastWinner == Team.BLUE) {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 10);
                } else {
                    resetButton();
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    topButton();
                }, 300);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 300);
            }
        } else {
            if (players.length == 2) {
                if (lastWinner == Team.BLUE) {
                    swapButton();
                }
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 3 || players.length >= 2 * teamSize + 1) {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 5);
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    topButton();
                }, 200);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 300);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 4) {
                resetButton();
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    randomButton();
                    setTimeout(() => {
                        randomButton();
                    }, 500);
                }, 500);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 2000);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 5 || players.length >= 2 * teamSize + 1) {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 5);
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 200);
                setTimeout(() => {
                    topButton();
                }, 200);
                activateChooseMode();
            } else if (players.length == 6) {
                resetButton();
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 1500);
                setTimeout(() => {
                    randomButton();
                    setTimeout(() => {
                        randomButton();
                        setTimeout(() => {
                            randomButton();
                        }, 500);
                    }, 500);
                }, 500);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            }
        }
    }
}

/* STATS FUNCTIONS */

/* GK FUNCTIONS */

function handleGKTeam(team) {
    if (team == Team.SPECTATORS) {
        return null;
    }
    let teamArray = team == Team.RED ? teamRed : teamBlue;
    let playerGK = teamArray.reduce((prev, current) => {
        if (team == Team.RED) {
            return (prev?.position.x < current.position.x) ? prev : current
        } else {
            return (prev?.position.x > current.position.x) ? prev : current
        }
    }, null);
    let playerCompGK = getPlayerComp(playerGK);
    return playerCompGK;
}

function handleGK() {
    let redGK = handleGKTeam(Team.RED);
    if (redGK != null) {
        redGK.GKTicks++;
    }
    let blueGK = handleGKTeam(Team.BLUE);
    if (blueGK != null) {
        blueGK.GKTicks++;
    }
}

function getGK(team) {
    if (team == Team.SPECTATORS) {
        return null;
    }
    let teamArray = team == Team.RED ? game.playerComp[0] : game.playerComp[1];
    let playerGK = teamArray.reduce((prev, current) => {
        return (prev?.GKTicks > current.GKTicks) ? prev : current
    }, null);
    return playerGK;
}

function getCS(scores) {
    let playersNameCS = [];
    let redGK = getGK(Team.RED);
    let blueGK = getGK(Team.BLUE);
    if (redGK != null && scores.blue == 0) {
        playersNameCS.push(redGK.player.name);
    }
    if (blueGK != null && scores.red == 0) {
        playersNameCS.push(blueGK.player.name);
    }
    return playersNameCS;
}

function getCSString(scores) {
    let playersCS = getCS(scores);
    if (playersCS.length == 0) {
        return "🥅 No CS";
    } else if (playersCS.length == 1) {
        return `🥅 ${playersCS[0]} ma czyste konto!`;
    } else {
        return `🥅 ${playersCS[0]} i ${playersCS[1]} majączyste konta`;
    }
}

/* GLOBAL STATS FUNCTIONS */

function getLastTouchOfTheBall() {
    const ballPosition = room.getBallPosition();
    updateTeams();
    let playerArray = [];
    for (let player of players) {
        if (player.position != null) {
            var distanceToBall = pointDistance(player.position, ballPosition);
            if (distanceToBall < triggerDistance) {
                if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
                playerArray.push([player, distanceToBall]);
            }
        }
    }
    if (playerArray.length != 0) {
        let playerTouch = playerArray.sort((a, b) => a[1] - b[1])[0][0];
        if (lastTeamTouched == playerTouch.team || lastTeamTouched == Team.SPECTATORS) {
            if (lastTouches[0] == null || (lastTouches[0] != null && lastTouches[0].player.id != playerTouch.id)) {
                game.touchArray.push(
                    new BallTouch(
                        playerTouch,
                        game.scores.time,
                        getGoalGame(),
                        ballPosition
                    )
                );
                lastTouches[0] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 1,
                    getGoalGame()
                );
                lastTouches[1] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 2,
                    getGoalGame()
                );
            }
        }
        lastTeamTouched = playerTouch.team;
    }
}

function getBallSpeed() {
    var ballProp = ballProps();
    return Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient;
}

function getGameStats() {
    if (playSituation == Situation.PLAY && gameState == State.PLAY) {
        lastTeamTouched == Team.RED ? possession[0]++ : possession[1]++;
        var ballPosition = room.getBallPosition();
        ballPosition.x < 0 ? actionZoneHalf[0]++ : actionZoneHalf[1]++;
        handleGK();
    }
}

/* GOAL ATTRIBUTION FUNCTIONS */

function getGoalAttribution(team) {
    var goalAttribution = Array(2).fill(null);
    if (lastTouches[0] != null) {
        if (lastTouches[0].player.team == team) {
            // Direct goal scored by player
            if (lastTouches[1] != null && lastTouches[1].player.team == team) {
                goalAttribution = [lastTouches[0].player, lastTouches[1].player];
            } else {
                goalAttribution = [lastTouches[0].player, null];
            }
        } else {
            // Own goal
            goalAttribution = [lastTouches[0].player, null];
        }
    }
    return goalAttribution;
}

function getGoalString(team) {
    var goalString;
    var scores = game.scores;
    var goalAttribution = getGoalAttribution(team);
    if (goalAttribution[0] != null) {
        if (goalAttribution[0].team == team) {
            if (goalAttribution[1] != null && goalAttribution[1].team == team) {
                goalString = `⚽ ${getTimeGame(scores.time)} Gola strzelił  ${goalAttribution[0].name} ! Asystował ${goalAttribution[1].name}. Prędkość piłki : ${ballSpeed.toFixed(2)}km/h.`;
                game.goals.push(
                    new Goal(
                        scores.time,
                        team,
                        goalAttribution[0],
                        goalAttribution[1]
                    )
                );
            } else {
                goalString = `⚽ ${getTimeGame(scores.time)} Gola strzelił   ${goalAttribution[0].name} ! Prędkość piłki : ${ballSpeed.toFixed(2)}km/h.`;
                game.goals.push(
                    new Goal(scores.time, team, goalAttribution[0], null)
                );
            }
        } else {
            goalString = `😂 ${getTimeGame(scores.time)} Samobója strzelił: ${goalAttribution[0].name} ! Prędkość piłki : ${ballSpeed.toFixed(2)}km/h.`;
            game.goals.push(
                new Goal(scores.time, team, goalAttribution[0], null)
            );
        }
    } else {
        goalString = `⚽ ${getTimeGame(scores.time)} Gol dla ${team == Team.RED ? 'red' : 'blue'} drużyny! Prędkość piłki : ${ballSpeed.toFixed(2)}km/h.`;
        game.goals.push(
            new Goal(scores.time, team, null, null)
        );
    }

    return goalString;
}

/* ROOM STATS FUNCTIONS */

function updatePlayerStats(player, teamStats) {
    var stats = new HaxStatistics(player.name);
    var pComp = getPlayerComp(player);
    if (localStorage.getItem(authArray[player.id][0])) {
        stats = JSON.parse(localStorage.getItem(authArray[player.id][0]));
    }
    stats.games++;
    if (lastWinner == teamStats) stats.wins++;
    stats.winrate = ((100 * stats.wins) / (stats.games || 1)).toFixed(1) + `%`;
    stats.goals += getGoalsPlayer(pComp);
    stats.assists += getAssistsPlayer(pComp);
    stats.ownGoals += getOwnGoalsPlayer(pComp);
    stats.CS += getCSPlayer(pComp);
    stats.playtime += getGametimePlayer(pComp);
    localStorage.setItem(authArray[player.id][0], JSON.stringify(stats));
}

function updateStats() {
    if (
        players.length >= 2 * teamSize &&
        (
            game.scores.time >= (5 / 6) * game.scores.timeLimit ||
            game.scores.red == game.scores.scoreLimit ||
            game.scores.blue == game.scores.scoreLimit
        ) &&
        teamRedStats.length >= teamSize && teamBlueStats.length >= teamSize
    ) {
        for (let player of teamRedStats) {
            updatePlayerStats(player, Team.RED);
        }
        for (let player of teamBlueStats) {
            updatePlayerStats(player, Team.BLUE);
        }
    }
}

function printRankings(statKey, id = 0) {
    var leaderboard = [];
    statKey = (statKey == "cs") ? "CS" : statKey;

    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        try {
            var raw = localStorage.getItem(k);
            if (!raw) continue;
            var obj = JSON.parse(raw);
            if (!obj || typeof obj !== 'object') continue;
            if (typeof obj.playerName !== 'string') continue;
            var val = obj[statKey];
            if (val == null || isNaN(Number(val))) continue;
            leaderboard.push([obj.playerName, Number(val)]);
        } catch (e) {
            // ignore non-JSON entries
        }
    }

    if (leaderboard.length === 0) {
        room.sendAnnouncement('Nie ma grajców!', id || null, errorColor, 'bold', HaxNotification.CHAT);
        return;
    }

    leaderboard.sort(function(a,b){ return b[1] - a[1]; });
    var limit = Math.min(5, leaderboard.length);

    var rankingString = statKey.toUpperCase() + ': ';
    for (let i = 0; i < limit; i++) {
        let playerName = leaderboard[i][0];
        let playerStat = leaderboard[i][1];
        if (statKey === 'playtime') playerStat = getTimeStats(playerStat);
        rankingString += `#${i + 1} ${playerName} : ${playerStat}, `;
    }
    rankingString = rankingString.substring(0, rankingString.length - 2);

    room.sendAnnouncement(rankingString, id || null, infoColor, 'bold', HaxNotification.CHAT);
}

/* GET STATS FUNCTIONS */

function getGamePlayerStats(player) {
    var stats = new HaxStatistics(player.name);
    var pComp = getPlayerComp(player);
    stats.goals += getGoalsPlayer(pComp);
    stats.assists += getAssistsPlayer(pComp);
    stats.ownGoals += getOwnGoalsPlayer(pComp);
    stats.playtime += getGametimePlayer(pComp);
    stats.CS += getCSPlayer(pComp);
    return stats;
}

function getGametimePlayer(pComp) {
    if (pComp == null) return 0;
    var timePlayer = 0;
    for (let j = 0; j < pComp.timeEntry.length; j++) {
        if (pComp.timeExit.length < j + 1) {
            timePlayer += game.scores.time - pComp.timeEntry[j];
        } else {
            timePlayer += pComp.timeExit[j] - pComp.timeEntry[j];
        }
    }
    return Math.floor(timePlayer);
}

function getGoalsPlayer(pComp) {
    if (pComp == null) return 0;
    var goalPlayer = 0;
    for (let goal of game.goals) {
        if (goal.striker != null && goal.team === pComp.player.team) {
            if (authArray[goal.striker.id][0] == pComp.auth) {
                goalPlayer++;
            }
        }
    }
    return goalPlayer;
}

function getOwnGoalsPlayer(pComp) {
    if (pComp == null) return 0;
    var goalPlayer = 0;
    for (let goal of game.goals) {
        if (goal.striker != null && goal.team !== pComp.player.team) {
            if (authArray[goal.striker.id][0] == pComp.auth) {
                goalPlayer++;
            }
        }
    }
    return goalPlayer;
}

function getAssistsPlayer(pComp) {
    if (pComp == null) return 0;
    var assistPlayer = 0;
    for (let goal of game.goals) {
        if (goal.assist != null) {
            if (authArray[goal.assist.id][0] == pComp.auth) {
                assistPlayer++;
            }
        }
    }
    return assistPlayer;
}

function getGKPlayer(pComp) {
    if (pComp == null) return 0;
    let GKRed = getGK(Team.RED);
    if (pComp.auth == GKRed?.auth) {
        return Team.RED;
    }
    let GKBlue = getGK(Team.BLUE);
    if (pComp.auth == GKBlue?.auth) {
        return Team.BLUE;
    }
    return Team.SPECTATORS;
}

function getCSPlayer(pComp) {
    if (pComp == null || game.scores == null) return 0;
    if (getGKPlayer(pComp) == Team.RED && game.scores.blue == 0) {
        return 1;
    } else if (getGKPlayer(pComp) == Team.BLUE && game.scores.red == 0) {
        return 1;
    }
    return 0;
}

function actionReportCountTeam(goals, team) {
    let playerActionSummaryTeam = [];
    let indexTeam = team == Team.RED ? 0 : 1;
    let indexOtherTeam = team == Team.RED ? 1 : 0;
    for (let goal of goals[indexTeam]) {
        if (goal[0] != null) {
            if (playerActionSummaryTeam.find(a => a[0].id == goal[0].id)) {
                let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[0].id);
                playerActionSummaryTeam[index][1]++;
            } else {
                playerActionSummaryTeam.push([goal[0], 1, 0, 0]);
            }
            if (goal[1] != null) {
                if (playerActionSummaryTeam.find(a => a[0].id == goal[1].id)) {
                    let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[1].id);
                    playerActionSummaryTeam[index][2]++;
                } else {
                    playerActionSummaryTeam.push([goal[1], 0, 1, 0]);
                }
            }
        }
    }
    if (goals[indexOtherTeam].length == 0) {
        let playerCS = getGK(team)?.player;
        if (playerCS != null) {
            if (playerActionSummaryTeam.find(a => a[0].id == playerCS.id)) {
                let index = playerActionSummaryTeam.findIndex(a => a[0].id == playerCS.id);
                playerActionSummaryTeam[index][3]++;
            } else {
                playerActionSummaryTeam.push([playerCS, 0, 0, 1]);
            }
        }
    }

    playerActionSummaryTeam.sort((a, b) => (a[1] + a[2] + a[3]) - (b[1] + b[2] + b[3]));
    return playerActionSummaryTeam;
}

/* PRINT FUNCTIONS */

function printPlayerStats(stats) {
    let statsString = '';
    for (let [key, value] of Object.entries(stats)) {
        if (key == 'playerName') statsString += `${value}: `;
        else {
            if (key == 'playtime') value = getTimeStats(value);
            let reCamelCase = /([A-Z](?=[a-z]+)|[A-Z]+(?![a-z]))/g;
            let statName = key.replaceAll(reCamelCase, ' $1').trim();
            statsString += `${statName.charAt(0).toUpperCase() + statName.slice(1)}: ${value}, `;
        }
    }
    statsString = statsString.substring(0, statsString.length - 2);
    return statsString;
}

/* FETCH FUNCTIONS */

function fetchGametimeReport(game) {
    var fieldGametimeRed = {
        name: '🔴        **Statystki Czerwonych**',
        value: '⌛ __**Czas gry:**__\n\n',
        inline: true,
    };
    var fieldGametimeBlue = {
        name: '🔵       **Statystyki Niebieskich**',
        value: '⌛ __**Czas gry:**__\n\n',
        inline: true,
    };
    var redTeamTimes = game.playerComp[0].map((p) => [p.player, getGametimePlayer(p)]);
    var blueTeamTimes = game.playerComp[1].map((p) => [p.player, getGametimePlayer(p)]);

    for (let time of redTeamTimes) {
        var minutes = getMinutesReport(time[1]);
        var seconds = getSecondsReport(time[1]);
        fieldGametimeRed.value += `> **${time[0].name}:** ${minutes > 0 ? `${minutes}m` : ''}` +
            `${seconds > 0 || minutes == 0 ? `${seconds}s` : ''}\n`;
    }
    fieldGametimeRed.value += `\n${blueTeamTimes.length - redTeamTimes.length > 0 ? '\n'.repeat(blueTeamTimes.length - redTeamTimes.length) : ''
        }`;
    fieldGametimeRed.value += '=====================';

    for (let time of blueTeamTimes) {
        var minutes = getMinutesReport(time[1]);
        var seconds = getSecondsReport(time[1]);
        fieldGametimeBlue.value += `> **${time[0].name}:** ${minutes > 0 ? `${minutes}m` : ''}` +
            `${seconds > 0 || minutes == 0 ? `${seconds}s` : ''}\n`;
    }
    fieldGametimeBlue.value += `\n${redTeamTimes.length - blueTeamTimes.length > 0 ? '\n'.repeat(redTeamTimes.length - blueTeamTimes.length) : ''
        }`;
    fieldGametimeBlue.value += '=====================';

    return [fieldGametimeRed, fieldGametimeBlue];
}

function fetchActionsSummaryReport(game) {
    var fieldReportRed = {
        name: '🔴        **Statystki Czerwonych**',
        value: '📊 __**Statystki grajców:**__\n\n',
        inline: true,
    };
    var fieldReportBlue = {
        name: '🔵       **Statystki Niebieskich**',
        value: '📊 __**Statystyki grajców**__\n\n',
        inline: true,
    };
    var goals = [[], []];
    for (let i = 0; i < game.goals.length; i++) {
        goals[game.goals[i].team - 1].push([game.goals[i].striker, game.goals[i].assist]);
    }
    var redActions = actionReportCountTeam(goals, Team.RED);
    if (redActions.length > 0) {
        for (let act of redActions) {
            fieldReportRed.value += `> **${act[0].team != Team.RED ? '[OG] ' : ''}${act[0].name}:**` +
                `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
                `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
                `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
        }
    }
    var blueActions = actionReportCountTeam(goals, Team.BLUE);
    if (blueActions.length > 0) {
        for (let act of blueActions) {
            fieldReportBlue.value += `> **${act[0].team != Team.BLUE ? '[OG] ' : ''}${act[0].name}:**` +
                `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
                `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
                `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
        }
    }

    fieldReportRed.value += `\n${blueActions.length - redActions.length > 0 ? '\n'.repeat(blueActions.length - redActions.length) : ''
        }`;
    fieldReportRed.value += '=====================';

    fieldReportBlue.value += `\n${redActions.length - blueActions.length > 0 ? '\n'.repeat(redActions.length - blueActions.length) : ''
        }`;
    fieldReportBlue.value += '=====================';

    return [fieldReportRed, fieldReportBlue];
}

function fetchSummaryEmbed(game) {
    var fetchEndgame = [fetchGametimeReport, fetchActionsSummaryReport];
    var logChannel = gameWebhook;
    var fields = [
        {
            name: '🔴        **Statystki Czerwonych**',
            value: '=====================\n\n',
            inline: true,
        },
        {
            name: '🔵       **Statystki Niebieskich**',
            value: '=====================\n\n',
            inline: true,
        },
    ];
    for (let i = 0; i < fetchEndgame.length; i++) {
        var fieldsReport = fetchEndgame[i](game);
        fields[0].value += fieldsReport[0].value + '\n\n';
        fields[1].value += fieldsReport[1].value + '\n\n';
    }
    fields[0].value = fields[0].value.substring(0, fields[0].value.length - 2);
    fields[1].value = fields[1].value.substring(0, fields[1].value.length - 2);

    var possR = possession[0] / (possession[0] + possession[1]);
    var possB = 1 - possR;
    var possRString = (possR * 100).toFixed(0).toString();
    var possBString = (possB * 100).toFixed(0).toString();
    var zoneR = actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1]);
    var zoneB = 1 - zoneR;
    var zoneRString = (zoneR * 100).toFixed(0).toString();
    var zoneBString = (zoneB * 100).toFixed(0).toString();
    var win = (game.scores.red > game.scores.blue) * 1 + (game.scores.blue > game.scores.red) * 2;
    var objectBodyWebhook = {
        embeds: [
            {
                title: `📝 MATCH REPORT #${getIdReport()}`,
                description:
                    `**${getTimeEmbed(game.scores.time)}** ` +
                    (win == 1 ? '**Red Team** ' : 'Red Team ') + game.scores.red +
                    ' - ' +
                    game.scores.blue + (win == 2 ? ' **Blue Team**' : ' Blue Team') +
                    '\n```c\nPossession: ' + possRString + '% - ' + possBString + '%' +
                    '\nAction Zone: ' + zoneRString + '% - ' + zoneBString + '%\n```\n\n',
                color: 9567999,
                fields: fields,
                footer: {
                    text: `Recording: ${getRecordingName(game)}`,
                },
                timestamp: new Date().toISOString(),
            },
        ],
        username: roomName
    };
    if (logChannel != '') {
        fetch(logChannel, {
            method: 'POST',
            body: JSON.stringify(objectBodyWebhook),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
}

/* EVENTS */

/* PLAYER MOVEMENT */

room.onPlayerJoin = function (player) {
    authArray[player.id] = [player.auth, player.conn];
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] ➡️ JOIN (${playersAll.length + 1}/${maxPlayers})\n**` +
                    `${player.name}** [${authArray[player.id][0]}] {${authArray[player.id][1]}}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
    room.sendAnnouncement(
        `👋 Witaj ${player.name} !\nWpisz "t" żeby pisać do swojej drużyny, lub "@@<nazwa gracza>".`,
        player.id,
        welcomeColor,
        'bold',
        HaxNotification.CHAT
    );
        room.sendAnnouncement(
        `Wpadnij na nasz discord! https://discord.gg/HBabx8b93k `,
        player.id,
        welcomeColor,
        'bold',
        HaxNotification.CHAT
    );
    updateTeams();
    updateAdmins();
    if (masterList.findIndex((auth) => auth == player.auth) != -1) {
        room.sendAnnouncement(
            `Wbił ${player.name}`,
            player.id,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    var sameAuthCheck = playersAll.filter((p) => p.id != player.id && authArray[p.id][0] == player.auth);
    if (sameAuthCheck.length > 0 && !debugMode) {
        var oldPlayerArray = playersAll.filter((p) => p.id != player.id && authArray[p.id][0] == player.auth);
        for (let oldPlayer of oldPlayerArray) {
            ghostKickHandle(oldPlayer, player);
        }
    }
    handlePlayersJoin();
};

room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
    handleLineupChangeTeamChange(changedPlayer);
    if (AFKSet.has(changedPlayer.id) && changedPlayer.team != Team.SPECTATORS) {
        room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
        room.sendAnnouncement(
            `${changedPlayer.name} jest afk!`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return;
    }
    updateTeams();
    if (gameState != State.STOP) {
        if (changedPlayer.team != Team.SPECTATORS && game.scores.time <= (3 / 4) * game.scores.timeLimit && Math.abs(game.scores.blue - game.scores.red) < 2) {
            changedPlayer.team == Team.RED ? teamRedStats.push(changedPlayer) : teamBlueStats.push(changedPlayer);
        }
    }
    handleActivityPlayerTeamChange(changedPlayer);
    handlePlayersTeamChange(byPlayer);
};

room.onPlayerLeave = function (player) {
    setTimeout(() => {
        if (!kickFetchVariable) {
            if (roomWebhook != '') {
                var stringContent = `[${getDate()}] ⬅️ LEAVE (${playersAll.length}/${maxPlayers})\n**${player.name}**` +
                    `[${authArray[player.id][0]}] {${authArray[player.id][1]}}`;
                fetch(roomWebhook, {
                    method: 'POST',
                    body: JSON.stringify({
                        content: stringContent,
                        username: roomName,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((res) => res);
            }
        } else kickFetchVariable = false;
    }, 10);
    handleLineupChangeLeave(player);
    checkCaptainLeave(player);
    updateTeams();
    updateAdmins();
    handlePlayersLeave();
};

room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
    kickFetchVariable = true;
    if (roomWebhook != '') {
        var stringContent = `[${getDate()}] ⛔ ${ban ? 'BAN' : 'KICK'} (${playersAll.length}/${maxPlayers})\n` +
            `**${kickedPlayer.name}** [${authArray[kickedPlayer.id][0]}] {${authArray[kickedPlayer.id][1]}} został ${ban ? 'zbanowany' : 'wykopany'}` +
            `${byPlayer != null ? ' dzięki **' + byPlayer.name + '** [' + authArray[byPlayer.id][0] + '] {' + authArray[byPlayer.id][1] + '}' : ''}`
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: stringContent,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
    if ((ban && ((byPlayer != null &&
        (byPlayer.id == kickedPlayer.id || getRole(byPlayer) < Role.MASTER)) || getRole(kickedPlayer) == Role.MASTER)) || disableBans
    ) {
        room.clearBan(kickedPlayer.id);
        return;
    }
    if (byPlayer != null && getRole(byPlayer) < Role.ADMIN_PERM) {
        room.sendAnnouncement(
            'Nie masz prawa wykopywać stąd ludzi!',
            byPlayer.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(byPlayer.id, false);
        return;
    }
    if (ban) banList.push([kickedPlayer.name, kickedPlayer.id]);
};

/* PLAYER ACTIVITY */

room.onPlayerChat = function (player, message) {
    if (gameState !== State.STOP && player.team != Team.SPECTATORS) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
    let msgArray = message.split(/ +/);
    if (!hideClaimMessage || msgArray[0] != '!claim') {
        if (roomWebhook != '')
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `[${getDate()}] 💬 CHAT\n**${player.name}** : ${message.replace('@', '@ ')}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
    }
    if (msgArray[0][0] == '!') {
        let command = getCommand(msgArray[0].slice(1).toLowerCase());
        console.log(msgArray, command);
        console.log(getRole(player));
        if (command != false && commands[command].roles <= getRole(player)) commands[command].function(player, message);
        else
            room.sendAnnouncement(
                `Nie masz uprawnień do takiej komendy. Użyj '!help' żeby wiedzieć, na co możesz sobie pozwolić`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        return false;
    }
    if (msgArray[0].toLowerCase() == 't') {
        teamChat(player, message);
        return false;
    }
    if (msgArray[0].substring(0, 2) === '@@') {
        playerChat(player, message);
        return false;
    }
    if (chooseMode && teamRed.length * teamBlue.length != 0) {
        var choosingMessageCheck = chooseModeFunction(player, message);
        if (choosingMessageCheck) return false;
    }
    if (slowMode > 0) {
        var filter = slowModeFunction(player, message);
        if (filter) return false;
    }
    if (!player.admin && muteArray.getByAuth(authArray[player.id][0]) != null) {
        room.sendAnnouncement(
            `Nikt cię nie chce sluchać!`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false;
    }
};

room.onPlayerActivity = function (player) {
    if (gameState !== State.STOP) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
};

room.onPlayerBallKick = function (player) {
    if (playSituation != Situation.GOAL) {
        var ballPosition = room.getBallPosition();
        if (game.touchArray.length == 0 || player.id != game.touchArray[game.touchArray.length - 1].player.id) {
            if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
            lastTeamTouched = player.team;
            game.touchArray.push(
                new BallTouch(
                    player,
                    game.scores.time,
                    getGoalGame(),
                    ballPosition
                )
            );
            lastTouches[0] = checkGoalKickTouch(
                game.touchArray,
                game.touchArray.length - 1,
                getGoalGame()
            );
            lastTouches[1] = checkGoalKickTouch(
                game.touchArray,
                game.touchArray.length - 2,
                getGoalGame()
            );
        }
    }
};

/* GAME MANAGEMENT */

room.onGameStart = function (byPlayer) {
    clearTimeout(startTimeout);
    if (byPlayer != null) clearTimeout(stopTimeout);
    game = new Game();
    possession = [0, 0];
    actionZoneHalf = [0, 0];
    gameState = State.PLAY;
    endGameVariable = false;
    goldenGoal = false;
    playSituation = Situation.KICKOFF;
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    teamRedStats = [];
    teamBlueStats = [];
    if (teamRed.length == teamSize && teamBlue.length == teamSize) {
        for (var i = 0; i < teamSize; i++) {
            teamRedStats.push(teamRed[i]);
            teamBlueStats.push(teamBlue[i]);
        }
    }
    calculateStadiumVariables();
};

room.onGameStop = function (byPlayer) {
    clearTimeout(stopTimeout);
    clearTimeout(unpauseTimeout);
    if (byPlayer != null) clearTimeout(startTimeout);
    game.rec = room.stopRecording();
    if (
        !cancelGameVariable && game.playerComp[0].length + game.playerComp[1].length > 0 &&
        (
            (game.scores.timeLimit != 0 &&
                ((game.scores.time >= 0.5 * game.scores.timeLimit &&
                    game.scores.time < 0.75 * game.scores.timeLimit &&
                    game.scores.red != game.scores.blue) ||
                    game.scores.time >= 0.75 * game.scores.timeLimit)
            ) ||
            endGameVariable
        )
    ) {
        fetchSummaryEmbed(game);
        if (fetchRecordingVariable) {
            setTimeout((gameEnd) => { fetchRecording(gameEnd); }, 500, game);
        }
    }
    cancelGameVariable = false;
    gameState = State.STOP;
    playSituation = Situation.STOP;
    updateTeams();
    handlePlayersStop(byPlayer);
    handleActivityStop();
};

room.onGamePause = function (byPlayer) {
    if (mentionPlayersUnpause && gameState == State.PAUSE) {
        const pauseMsg = byPlayer != null
            ? `Gra zatrzymana przez ${byPlayer.name}!`
            : `Gra zatrzymana!`;
        room.sendAnnouncement(
            pauseMsg,
            null,
            defaultColor,
            'bold',
            HaxNotification.NONE
        );
    }
    clearTimeout(unpauseTimeout);
    gameState = State.PAUSE;
};

room.onGameUnpause = function (byPlayer) {
    unpauseTimeout = setTimeout(() => {
        gameState = State.PLAY;
    }, 2000);
    if (mentionPlayersUnpause) {
        const unpauseMsg = byPlayer != null
            ? `Gra wznowiona przez ${byPlayer.name}!`
            : `Gra wznowiona!`;
        room.sendAnnouncement(
            unpauseMsg,
            null,
            defaultColor,
            'bold',
            HaxNotification.NONE
        );
    }
    if (
        (teamRed.length == teamSize && teamBlue.length == teamSize && chooseMode) ||
        (teamRed.length == teamBlue.length && teamSpec.length < 2 && chooseMode)
    ) {
        deactivateChooseMode();
    }
};

room.onTeamGoal = function (team) {
    const scores = room.getScores();
    game.scores = scores;
    playSituation = Situation.GOAL;
    ballSpeed = getBallSpeed();
    var goalString = getGoalString(team);
    for (let player of teamRed) {
        var playerComp = getPlayerComp(player);
        team == Team.RED ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
    }
    for (let player of teamBlue) {
        var playerComp = getPlayerComp(player);
        team == Team.BLUE ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
    }
    room.sendAnnouncement(
        goalString,
        null,
        team == Team.RED ? redColor : blueColor,
        null,
        HaxNotification.CHAT
    );
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] ${goalString}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
    if ((scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit)) || goldenGoal) {
        endGame(team);
        goldenGoal = false;
        stopTimeout = setTimeout(() => {
            room.stopGame();
        }, 1000);
    }
};

room.onPositionsReset = function () {
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    playSituation = Situation.KICKOFF;
};

/* MISCELLANEOUS */

room.onRoomLink = function (url) {
    console.log(`${url}\nmasterPassword : ${masterPassword}`);
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] 🔗 LINK ${url}\nmasterPassword : ${masterPassword}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
};

room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
    updateTeams();
    if (!changedPlayer.admin && getRole(changedPlayer) >= Role.ADMIN_TEMP) {
        room.setPlayerAdmin(changedPlayer.id, true);
        return;
    }
    updateAdmins(byPlayer != null && !changedPlayer.admin && changedPlayer.id == byPlayer.id ? changedPlayer.id : 0);
};

room.onKickRateLimitSet = function (min, rate, burst, byPlayer) {
    if (byPlayer != null) {
        room.sendAnnouncement(
            `It is not allowed to change the kickrate limit. It must stay at "6-0-0".`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setKickRateLimit(6, 0, 0);
    }
};

room.onStadiumChange = function (newStadiumName, byPlayer) {
    if (byPlayer !== null) {
        if (getRole(byPlayer) < Role.MASTER && currentStadium != 'other') {
            room.sendAnnouncement(
                `Nie mozna ręcznie zmieniać mapek bo sie serwer krzaczy! Tylko komendy:( `,
                byPlayer.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            stadiumCommand(emptyPlayer, `!${currentStadium}`);
        } else {
            room.sendAnnouncement(
                `Mapka zmieniona, ale gdy skończysz zabawę z tą mapką, proszę, przywróc komendami własciwą mapkę.`,
                byPlayer.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            currentStadium = 'other';
        }
    }
    checkStadiumVariable = true;
};

room.onGameTick = function () {
    checkTime();
    getLastTouchOfTheBall();
    getGameStats();
    handleActivity();
};

/* =========================
   ELO 3v3 — LEAN IMPLEMENTATION + AFK handling (per user spec)
   - R0 = 1000
   - K = 40 for first 20 games per user, else 24
   - Start buffer: 25s
   - Draws: standard ELO (weaker gains, stronger loses)
   - Leave after 25s: leaver gets -25 ELO; if match ends as walkover due to this leave,
     then leaver's TEAM (excluding the leaver) gets a WIN, opponent gets a LOSS, leaver gets only -25
   - Matches < 25s:
     * If ended naturally: count normally.
     * If ended as walkover: ignore (no ELO changes, no penalties).
   - Only players present at the end of the match are considered for ELO updates (except special walkover rule).
   - No time weighting.
   - "!afk" during an active match is treated as a leave-equivalent with the same rules.
   ========================= */
(function(){
  if (typeof room === "undefined" || !room) { return; }

  const ELO_R0 = 1000;
  const ELO_K_PROV = 40;
  const ELO_K_NORM = 24;
  const ELO_PROV_GAMES = 20;
  const START_BUFFER_MS = 25_000;
  const LEAVE_PENALTY = 25;

  const ELO_STORAGE_KEY = "__eloStore";

  function makeEmptyEloStore(){
    return {
      ratings: Object.create(null),
      games: Object.create(null),
      names: Object.create(null)
    };
  }

  function reviveEloStore(rawObj){
    const store = makeEmptyEloStore();
    if (!rawObj || typeof rawObj !== "object") return store;

    if (rawObj.ratings && typeof rawObj.ratings === "object"){
      for (const [key, value] of Object.entries(rawObj.ratings)){
        if (value != null) store.ratings[key] = Number(value);
      }
    }
    if (rawObj.games && typeof rawObj.games === "object"){
      for (const [key, value] of Object.entries(rawObj.games)){
        if (value != null) store.games[key] = Number(value);
      }
    }
    if (rawObj.names && typeof rawObj.names === "object"){
      for (const [key, value] of Object.entries(rawObj.names)){
        if (typeof value === "string") store.names[key] = value;
      }
    }
    return store;
  }

  function loadEloStore(){
    try{
      const raw = localStorage.getItem(ELO_STORAGE_KEY);
      if (!raw) return null;
      return reviveEloStore(JSON.parse(raw));
    }catch(_){
      return null;
    }
  }

  const persistedStore = loadEloStore();
  if (!globalThis.__eloStore){
    globalThis.__eloStore = persistedStore || makeEmptyEloStore();
  } else if (persistedStore){
    // Merge persisted data into existing store (keep live references).
    for (const [key, value] of Object.entries(persistedStore.ratings)){
      globalThis.__eloStore.ratings[key] = value;
    }
    for (const [key, value] of Object.entries(persistedStore.games)){
      globalThis.__eloStore.games[key] = value;
    }
    for (const [key, value] of Object.entries(persistedStore.names)){
      globalThis.__eloStore.names[key] = value;
    }
  }

  const elo = globalThis.__eloStore;
  if (!elo.ratings) elo.ratings = Object.create(null);
  if (!elo.games) elo.games = Object.create(null);
  if (!elo.names) elo.names = Object.create(null);
  globalThis.eloStore = elo;

  function saveEloStore(){
    try{
      const payload = {
        ratings: elo.ratings,
        games: elo.games,
        names: elo.names
      };
      localStorage.setItem(ELO_STORAGE_KEY, JSON.stringify(payload));
    }catch(_){}
  }

  // Match state
  const state = globalThis.__eloState || (globalThis.__eloState = {
    active: false,
    kickoffAt: 0,
    score: { red: 0, blue: 0 },
    settled: false,
    ranked: false
  });
  if (typeof state.ranked !== "boolean") state.ranked = false;
  // track who triggered potential walkover (leave/afk) to resolve on onGameStop if needed
  const pendingWalkover = globalThis.__eloPendingWalkover || (globalThis.__eloPendingWalkover = {
    authId: null,
    teamId: 0,
    ts: 0
  });
  // Track last known team per authId (to detect transitions 1/2 -> 0)
  const lastTeam = globalThis.__eloLastTeam || (globalThis.__eloLastTeam = Object.create(null));
  // Track who already got -25 this match to avoid double penalties (AFK -> leave)
  const penalizedThisMatch = globalThis.__eloPenalizedThisMatch || (globalThis.__eloPenalizedThisMatch = new Set());

  // Track AFK intents (just utility space)
  const afkIntent = globalThis.__eloAfkIntent || (globalThis.__eloAfkIntent = Object.create(null));

  // ---- helpers ----
  function getAuthIdByPlayer(player){
    if (!player){
      return "?";
    }
    try{
      if (typeof authArray !== "undefined" && authArray[player.id]){
        const arrEntry = authArray[player.id];
        if (Array.isArray(arrEntry) && arrEntry.length > 0){
          return arrEntry[0];
        }
      }
    }catch(_){}
    if (player.auth){
      return player.auth;
    }
    if (player.conn){
      return player.conn;
    }
    return String(player.id ?? "?");
  }
  function ensureProfile(authId, name){
    let changed = false;
    if (!(authId in elo.ratings)){
      elo.ratings[authId] = ELO_R0;
      changed = true;
    }
    if (!(authId in elo.games)){
      elo.games[authId] = 0;
      changed = true;
    }
    if (name && elo.names[authId] !== name){
      elo.names[authId] = name;
      changed = true;
    }
    if (changed) saveEloStore();
  }
  function kFactor(authId){
    const g = elo.games[authId] || 0;
    return g < ELO_PROV_GAMES ? ELO_K_PROV : ELO_K_NORM;
  }
  function getTeamPlayers(teamId){
    try{
      return room.getPlayerList().filter(p => p.team === teamId);
    }catch(_){ return []; }
  }
  function isThreeVThreeNow(){
    try{
      const rc = room.getPlayerList().filter(p=>p.team===Team.RED).length;
      const bc = room.getPlayerList().filter(p=>p.team===Team.BLUE).length;
      return rc===teamSize && bc===teamSize;
    }catch(_){ return false; }
  }
  function spectatorCount(excludeAuthId){
    try{
      const specs = getTeamPlayers(Team.SPECTATORS);
      if (!Array.isArray(specs)) return 0;
      let count = 0;
      for (const spec of specs){
        try{
          if (excludeAuthId != null && getAuthIdByPlayer(spec) === excludeAuthId) continue;
        }catch(_){}
        count += 1;
      }
      return count;
    }catch(_){ return 0; }
  }
  function hasSpectatorAvailable(excludeAuthId){
    return spectatorCount(excludeAuthId) > 0;
  }
  function shouldDeclareWalkover(teamId, excludeAuthId){
    if (!state.ranked) return false;
    if (teamId !== Team.RED && teamId !== Team.BLUE) return false;
    if (hasSpectatorAvailable(excludeAuthId)) return false;
    try{
      return getTeamPlayers(teamId).length < teamSize;
    }catch(_){
      return false;
    }
  }
  function teamAuthsAtEnd(teamId){
    return getTeamPlayers(teamId).map(p => getAuthIdByPlayer(p));
  }
  function teamAvgRating(authIds){
    if (authIds.length === 0) return ELO_R0;
    let sum = 0;
    for (const a of authIds){
      ensureProfile(a);
      sum += elo.ratings[a];
    }
    return sum / authIds.length;
  }
  function expectedScore(rA, rB){
    return 1 / (1 + Math.pow(10, (rB - rA)/400));
  }
  function elapsedMsSinceKickoff(){
    try{
      const scores = room.getScores && room.getScores();
      if (scores && typeof scores.time === "number") return Math.floor(scores.time * 1000);
    }catch(_){}
    if (state.active){
      const now = Date.now();
      return now - (state.kickoffAt || now);
    }
    return 0;
  }

  function updateEloForTeams(params){
  const exclude = params.excludeAuths || new Set();
  const A = params.teamAAuths.filter(a => !exclude.has(a));
  const B = params.teamBAuths.filter(a => !exclude.has(a));
  const rA = teamAvgRating(A);
  const rB = teamAvgRating(B);
  const eA = expectedScore(rA, rB);
  const eB = 1 - eA;
  const sA = params.scoreA;
  const sB = params.scoreB;

  // --- snapshot "stare" ELO przed aktualizacją ---
  const oldElo = Object.create(null);
  const remember = (arr) => {
    for (const a of arr){
      ensureProfile(a);
      oldElo[a] = Number(elo.ratings[a] ?? ELO_R0);
    }
  };
  remember(A); remember(B);

  // --- zaktualizuj ELO i liczbę gier (jak dotychczas) ---
  for (const a of A){
    ensureProfile(a);
    const dR = kFactor(a) * (sA - eA);
    elo.ratings[a] += dR;
    elo.games[a] += 1;
  }
  for (const b of B){
    ensureProfile(b);
    const dR = kFactor(b) * (sB - eB);
    elo.ratings[b] += dR;
    elo.games[b] += 1;
  }
  saveEloStore();

  // --- wyślij prywatne powiadomienia do graczy ---
  const fmt = (x) => Number(x).toFixed(1);

  // pomocniczo: znajdź aktywnego gracza po auth, żeby mieć jego player.id do PM
  function findPlayerIdByAuth(authId){
    try{
      const list = room.getPlayerList();
      const p = list.find(pl => {
        try { return getAuthIdByPlayer(pl) === authId; } catch(_) { return false; }
      });
      return p ? p.id : null;
    }catch(_){ return null; }
  }
// --- wynik meczu oparty o sA/sB oraz przynależność gracza do A/B ---
const Aset = new Set(A);
const Bset = new Set(B);
const winnerSide = (sA === sB) ? "draw" : (sA > sB ? "A" : "B");

function outcomeLabelForAuth(authId){
  if (winnerSide === "draw") return "Zremisowałeś";
  const inA = Aset.has(authId);
  const inB = Bset.has(authId);
  const won = (winnerSide === "A" && inA) || (winnerSide === "B" && inB);
  return won ? "Wygrałeś" : "Przegrałeś";
}
const notify = (authId) => {
  const prev  = Number(oldElo[authId] ?? ELO_R0);
  const now   = Number(elo.ratings[authId] ?? prev);
  const delta = now - prev;
  const sign  = delta > 0 ? "+" : "";

  const label = outcomeLabelForAuth(authId); // <-- wynik, nie znak ΔELO
  // opcjonalnie: pokaż wynik meczu w treści
  const scoreText = (Number.isFinite(sA) && Number.isFinite(sB)) ? ` ${sA}:${sB}` : "";

  const msg = `${label}${scoreText}. Twoje nowe ELO: ${prev.toFixed(1)}${sign}${delta.toFixed(1)}=${now.toFixed(1)}.`;
  const col = rankColor(classLabel(now));
  const pid = findPlayerIdByAuth(authId);

  if (pid != null){
    try { room.sendAnnouncement(msg, pid, col, 'bold', HaxNotification.CHAT); }
    catch { room.sendAnnouncement(msg, pid); }
  }
};

  for (const a of A) notify(a);
  for (const b of B) notify(b);
}

function classLabel(r){
  r = Number(r);
  if (!isFinite(r)) r = 1000;
  if (r <= 850)  return "Gówienko";
  if (r <= 950)  return "Żółtodziób";
  if (r <= 1050) return "Początkujący";
  if (r <= 1199) return "Gracz";
  if (r <= 1299) return "Kox";
  if (r <= 1399) return "Mistrz";
  if (r <= 1550) return "Legenda";
  return "Nieśmiertelny";
}

  // ---- Rank → Avatar mapping (emoji demo) ----
const RANK_AVATARS = {
  "Gówienko":      "💩",
  "Żółtodziób":    "🐣",
  "Początkujący":  "⚪",
  "Gracz":         "🥉",
  "Kox":           "🥈",
  "Mistrz":        "🥇",
  "Legenda":       "👑",
  "Nieśmiertelny": "🔥"
};


  // Emoji for text (same mapping as avatars)
  function rankEmoji(label){
    if (label === undefined || label === null) return "😶";
    return RANK_AVATARS.hasOwnProperty(label) ? RANK_AVATARS[label] : "😶";
  }
  // Pretty chat color for a given rank label
function rankColor(label){
  switch(label){
    case "Gówienko":      return 0x8B4513; // brąz
    case "Żółtodziób":    return 0xffff99; // żółty pastel
    case "Początkujący":  return 0xD0D0D0; // biały
    case "Gracz":         return 0xFFCB62; // niebieskawy
    case "Kox":           return 0xFFFFFF; // złoty
    case "Mistrz":        return 0xFFD700; // zieleń
    case "Legenda":       return 0x7d3cff; // fiolet
    case "Nieśmiertelny": return 0xff4500; // pomarańcz-czerwony
    default:              return infoColor;
  }
}



// === Unified stats printer ===
function formatWinrate(wins, games){
  if (!games) return "0.0%";
  return (Math.round((wins/games)*1000)/10).toFixed(1) + "%";
}
function formatPlaytime(minutes){
  minutes = Math.max(0, Math.floor(Number(minutes)||0));
  const h = Math.floor(minutes/60), m = minutes%60;
  return (h>0? `${h}h`:"") + `${m}m`;
}
function printUnifiedStatsLine(targetPlayer){
  try{
    const auth = getAuthIdByPlayer(targetPlayer);
    ensureProfile(auth, targetPlayer?.name);

    // Klucz do storage: preferuj authArray[player.id][0] jeśli jest, inaczej auth
    let key = auth;
    try{
      if (typeof authArray !== "undefined"
          && targetPlayer
          && authArray[targetPlayer.id]
          && authArray[targetPlayer.id][0]) {
        key = authArray[targetPlayer.id][0];
      }
    }catch(_){}

    // Wczytaj staty bezpiecznie
    let st = new HaxStatistics(targetPlayer?.name || "");
    try{
      if (typeof localStorage !== "undefined" && localStorage.getItem) {
        const raw = localStorage.getItem(String(key));
        if (raw) {
          const data = JSON.parse(raw);
          if (data && typeof data === "object") Object.assign(st, data);
        }
      }
    }catch(_){/* ignoruj uszkodzone JSON */}

    // Pola
    const games   = Number(st.games)    || 0;
    const wins    = Number(st.wins)     || 0;
    const goals   = Number(st.goals)    || 0;
    const assists = Number(st.assists)  || 0;
    const cs      = Number(st.CS)       || 0;
    const og      = Number(st.ownGoals) || 0;

    // Winrate i czas
    const winrate = (games > 0) ? ( (wins * 100 / games).toFixed(1) + '%' ) : '0.0%';
    const pt      = (typeof getTimeStats === "function") ? getTimeStats(Number(st.playtime)||0)
                                                         : ( () => {
                                                              const mins = Math.floor((Number(st.playtime)||0)/60);
                                                              const h = Math.floor(mins/60), m = mins%60;
                                                              return (h>0? `${h}h` : '0h') + `${m}m`;
                                                            })();

    // ELO i ranga
    const eloVal = (elo && elo.ratings && elo.ratings[auth] != null) ? elo.ratings[auth] : baseElo;
    const lab = classLabel(eloVal);
    const nick = (elo && elo.names && elo.names[auth]) ? elo.names[auth] : (targetPlayer.name || auth);

    const line = `${nick}: Games: ${games}, Wins: ${wins}, Winrate: ${winrate}, ` +
                 `Playtime: ${pt}, Goals: ${goals}, Assists: ${assists}, CS: ${cs}, Own Goals: ${og} ` +
                 `ELO: ${Number(eloVal||baseElo).toFixed(1)}${lab ? ` | ${lab}` : ""}`;

    const col = rankColor(lab);
    return { line, col };
  }catch(e){
    return { line: "Nie udało się wyświetlić statystyk.", col: errorColor };
  }
}

function pickAvatarByRankLabel(label){
    if (!label && label !== "") return "";
    return RANK_AVATARS.hasOwnProperty(label) ? RANK_AVATARS[label] : "";
  }

  function applyRankAvatarsOnKickoff(){
    try{
      if (typeof room.setPlayerAvatar !== "function") return;
      const changed = new Set();
      const players = room.getPlayerList().filter(p => p.team===1 || p.team===2);
      for (const p of players){
        const aid = getAuthIdByPlayer(p);
        ensureProfile(aid, p?.name);
        const r = elo.ratings[aid];
        const lab = classLabel(r);
        const avatarId = pickAvatarByRankLabel(lab);
        if (avatarId){
          try{ room.setPlayerAvatar(p.id, avatarId); changed.add(p.id); }catch(_){}
        }
      }
      setTimeout(function(){
        if (typeof room.setPlayerAvatar !== "function") return;
        for (const id of changed){
          try{ room.setPlayerAvatar(id, null); }catch(_){
            try{ room.setPlayerAvatar(id, ""); }catch(__){}
          }
        }
      }, 12_000);
    }catch(_){}
  }

 function finalizeNaturalMatch(){
   // Only rank if the match ends as a true 3v3 (both teams exactly 3 players).
   if (!state.ranked) {
     return;
   }
   if (!isThreeVThreeNow()) {
     return;
   }
   const redAuths = teamAuthsAtEnd(1);
   const blueAuths = teamAuthsAtEnd(2);
  // Użyj finalnej tablicy wyników z silnika, a lokalne liczniki tylko jako fallback.
  let scoresFinal = null;
  try { scoresFinal = room.getScores && room.getScores(); } catch(_){}
  const ra = (scoresFinal && typeof scoresFinal.red === "number")  ? scoresFinal.red  : state.score.red;
  const rb = (scoresFinal && typeof scoresFinal.blue === "number") ? scoresFinal.blue : state.score.blue;
  // Remis: S = 0.5 dla obu; inaczej klasycznie 1/0.
  let sRed = 0.5, sBlue = 0.5;
  if (ra > rb){ sRed = 1; sBlue = 0; }
  else if (ra < rb){ sRed = 0; sBlue = 1; }
 
   updateEloForTeams({
     teamAAuths: redAuths,
     teamBAuths: blueAuths,
     scoreA: sRed,
     scoreB: sBlue,
     excludeAuths: new Set()
   });
 }


  function finalizeWalkoverDueToLeave(leaverAuth, leaverTeamId){
    if (!shouldDeclareWalkover(leaverTeamId, leaverAuth)) {
      return;
    }
    state.ranked = false;
    // Special rule per user spec:
    // - leaver gets only -25 (applied in leave/afk handler), excluded from ELO update
    // - leaver's TEAM (excluding leaver) gets WIN (S=1)
    // - opponent team gets LOSS (S=0)
    const redAuths = teamAuthsAtEnd(Team.RED);
    const blueAuths = teamAuthsAtEnd(Team.BLUE);
    const exclude = new Set([leaverAuth]);
    const sRed = (leaverTeamId === Team.RED) ? 1 : 0;
    const sBlue = (leaverTeamId === Team.BLUE) ? 1 : 0;
    updateEloForTeams({
      teamAAuths: redAuths,
      teamBAuths: blueAuths,
      scoreA: sRed,
      scoreB: sBlue,
      excludeAuths: exclude
    });
  }

  function handleAfkTransition(authId, oldTeamId){
    // Called shortly after user's !afk is processed by existing handlers (so team likely = 0)
    try{
      const pl = room.getPlayerList().find(p => getAuthIdByPlayer(p) === authId);
      const nowTeam = pl ? pl.team : 0;
      const elapsed = elapsedMsSinceKickoff();
      if (state.active && state.ranked && nowTeam === Team.SPECTATORS && (oldTeamId === Team.RED || oldTeamId === Team.BLUE)){
        if (elapsed >= START_BUFFER_MS && !penalizedThisMatch.has(authId)){
          ensureProfile(authId);
          if (!Number.isFinite(elo.ratings[authId])) elo.ratings[authId] = 0;
          elo.ratings[authId] = Math.max(0, elo.ratings[authId] - LEAVE_PENALTY);
          saveEloStore();
          penalizedThisMatch.add(authId);
          room.sendAnnouncement(`❌ Kara za AFK po 25s: -${LEAVE_PENALTY} ELO`, null);

          pendingWalkover.authId = authId;
          pendingWalkover.teamId = oldTeamId;
          pendingWalkover.ts = Date.now();

          const attemptFinalizeWalkover = function(){
            const canWalkover = shouldDeclareWalkover(oldTeamId, authId);
            if (!state.settled && canWalkover){
              finalizeWalkoverDueToLeave(authId, oldTeamId);
              state.settled = true;
              state.active = false;
              state.ranked = false;
              pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
            } else if (!canWalkover && pendingWalkover.authId === authId){
              pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
            }
          };

          attemptFinalizeWalkover();
          if (!state.settled){
            // race-condition guard: re-check after a short delay in case other handlers moved players
            setTimeout(function(){
              try{
                attemptFinalizeWalkover();
              }catch(_){}
            }, 120);
          }
        }
      }
    }catch(_){}
  }

  // ---- event wrapping ----
  const prev_onGameStart = room.onGameStart;
  room.onGameStart = function(byPlayer){
    try{
      penalizedThisMatch.clear();
      // snapshot last team for all players at kickoff
      const pls = room.getPlayerList();
      for (const p of pls){
        const aid = getAuthIdByPlayer(p);
        lastTeam[aid] = p.team;
      }
    }catch(_){}

    try{
      state.active = true;
      state.kickoffAt = Date.now();
      state.score.red = 0;
      state.score.blue = 0;
      state.settled = false;
      try{
        const redCount = getTeamPlayers(Team.RED).length;
        const blueCount = getTeamPlayers(Team.BLUE).length;
        state.ranked = (redCount === teamSize && blueCount === teamSize);
      }catch(_){
        state.ranked = false;
      }
      pendingWalkover.authId = null;
      pendingWalkover.teamId = 0;
      pendingWalkover.ts = 0;
    }catch(_){}
    if (typeof prev_onGameStart === "function") prev_onGameStart(byPlayer);
    try{ applyRankAvatarsOnKickoff(); }catch(_){}

  };

  const prev_onTeamGoal = room.onTeamGoal;
  room.onTeamGoal = function(teamId){
    try{
      if (teamId === 1) state.score.red += 1;
      else if (teamId === 2) state.score.blue += 1;
    }catch(_){}
    if (typeof prev_onTeamGoal === "function") prev_onTeamGoal(teamId);
  };

  const prev_onGameStop = room.onGameStop;
  room.onGameStop = function(byPlayer){
    try{ penalizedThisMatch.clear(); }catch(_){}

    try{
      if (!state.settled){
        // Prefer resolving recorded walkover (covers abrupt stops)
        if (pendingWalkover.authId && (pendingWalkover.teamId === Team.RED || pendingWalkover.teamId === Team.BLUE)){
          if (shouldDeclareWalkover(pendingWalkover.teamId, pendingWalkover.authId)){
            finalizeWalkoverDueToLeave(pendingWalkover.authId, pendingWalkover.teamId);
            state.settled = true;
          }
          // clear pending
          pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
        } else if (isThreeVThreeNow() && state.ranked){
          // True 3v3 natural finish
          finalizeNaturalMatch();
          state.settled = true;
        } else {
          // Non-3v3 end without pending walkover → no ELO
        }
      }
    }catch(_){}
    finally{
      state.active = false;
      state.ranked = false;
    }
    if (typeof prev_onGameStop === "function") prev_onGameStop(byPlayer);
  };

  const prev_onPlayerJoin = room.onPlayerJoin;
  room.onPlayerJoin = function(player){
    try{
      const aid2 = getAuthIdByPlayer(player);
      lastTeam[aid2] = player.team;
    }catch(_){}

    try{
      const a = getAuthIdByPlayer(player);
      ensureProfile(a, player?.name);
    }catch(_){}
    if (typeof prev_onPlayerJoin === "function") prev_onPlayerJoin(player);
  };

  const prev_onPlayerLeave = room.onPlayerLeave;
  room.onPlayerLeave = function(player){
    let lastTeamBefore = Team.SPECTATORS;
    let authLeave = null;
    try{
      authLeave = getAuthIdByPlayer(player);
      if (authLeave != null && authLeave in lastTeam && typeof lastTeam[authLeave] === "number"){
        lastTeamBefore = lastTeam[authLeave];
      } else if (typeof player?.team === "number"){
        lastTeamBefore = player.team;
      }
      if (authLeave != null){
        delete lastTeam[authLeave];
      }
    }catch(_){}

    try{
      const a = authLeave != null ? authLeave : getAuthIdByPlayer(player);
      ensureProfile(a, player?.name);

      const effectiveTeam = (typeof lastTeamBefore === "number") ? lastTeamBefore : player.team;
      const wasSpectator = (effectiveTeam === Team.SPECTATORS);

      // Prefer authoritative game timer when available
      const elapsed = elapsedMsSinceKickoff();
      if (!wasSpectator && state.active && state.ranked && elapsed >= START_BUFFER_MS){
          // Penalty for leaving after 25s (skip if already penalized this match via AFK)
         if (!penalizedThisMatch.has(a)) {
           elo.ratings[a] -= LEAVE_PENALTY;
           saveEloStore();
           penalizedThisMatch.add(a);
           room.sendAnnouncement(`❌ Kara za wyjście po 25s: -${LEAVE_PENALTY} ELO`, null);
         }

          // mark potential walkover
          pendingWalkover.authId = a;
          pendingWalkover.teamId = effectiveTeam;
          pendingWalkover.ts = Date.now();

          const attemptFinalizeWalkover = function(){
            const canWalkover = shouldDeclareWalkover(effectiveTeam, a);
            if (!state.settled && canWalkover){
              finalizeWalkoverDueToLeave(a, effectiveTeam);
              state.settled = true;
              state.active = false;
              state.ranked = false;
              pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
            } else if (!canWalkover && pendingWalkover.authId === a){
              pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
            }
          };

          attemptFinalizeWalkover();
          if (!state.settled){
            // race-condition guard: re-check a bit later
            setTimeout(function(){
              try{
                attemptFinalizeWalkover();
              }catch(_){}
            }, 120);
          }
      } else {
          // <= 25s or spectator: ignore penalty; if the match ends as walkover here, that case is ignored by spec
      }
    }catch(_){}
    if (typeof prev_onPlayerLeave === "function") prev_onPlayerLeave(player);
  };

  const prev_onPlayerTeamChange = room.onPlayerTeamChange;
  room.onPlayerTeamChange = function(player, byPlayer){
    try{
      const aid = getAuthIdByPlayer(player);
      ensureProfile(aid, player?.name);
      const newTeam = player.team;
      const oldTeam = (aid in lastTeam) ? lastTeam[aid] : newTeam;
      // Detect transition from playing (1/2) to SPECT (0) during active match
      if (state.active && state.ranked && (oldTeam === Team.RED || oldTeam === Team.BLUE) && newTeam === Team.SPECTATORS){
        const elapsed = elapsedMsSinceKickoff();
        if (elapsed >= START_BUFFER_MS && !penalizedThisMatch.has(aid)){
          // Apply -25 only once per match
          elo.ratings[aid] -= LEAVE_PENALTY;
          saveEloStore();
          penalizedThisMatch.add(aid);
          room.sendAnnouncement(`❌ Kara za AFK po 25s: -${LEAVE_PENALTY} ELO`, null);

          // mark potential walkover; finalization happens in onGameStop to avoid engine races
          pendingWalkover.authId = aid;
          pendingWalkover.teamId = oldTeam;
          pendingWalkover.ts = Date.now();

          const canWalkover = shouldDeclareWalkover(oldTeam, aid);
          if (!state.settled && canWalkover){
            finalizeWalkoverDueToLeave(aid, oldTeam);
            state.settled = true;
            state.active = false;
            state.ranked = false;
            pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
          } else if (!canWalkover && pendingWalkover.authId === aid){
            pendingWalkover.authId = null; pendingWalkover.teamId = 0; pendingWalkover.ts = 0;
          }
        }
      }
      // update lastTeam after processing
      lastTeam[aid] = newTeam;
    }catch(_){}
    if (typeof prev_onPlayerTeamChange === "function") prev_onPlayerTeamChange(player, byPlayer);
  };
  // ---- Chat commands (minimal) ----
  const prev_onPlayerChat = room.onPlayerChat;
  room.onPlayerChat = function(player, message){
    const msg = (message || "").trim();
    const lower = msg.toLowerCase();
    const originalTeamBeforeChat = player.team;
    const authBeforeChat = getAuthIdByPlayer(player);
    try{
              if (lower === "!elo"){
          const auth = getAuthIdByPlayer(player);
          ensureProfile(auth, player?.name);
          const r = elo.ratings[auth];
          const lab = classLabel(r);
          const games = elo.games[auth] || 0;
          let kNow = 0;
          try { kNow = kFactor(auth); } catch(_){}
          const line = `ELO: ${r.toFixed(1)}${lab?` | ${lab}`:""} | gry: ${games} | K=${kNow}`;
          room.sendAnnouncement(line, player.id, rankColor(lab), 'bold', HaxNotification.CHAT);
          return false;
                }
      
                  if (lower.startsWith("!ranking")){
        // Pagination: !ranking [page] | !ranking me
        const parts = msg.trim().split(/\s+/);
        const PAGE_SIZE = 10;
        const items = Object.entries(elo.ratings).sort((a,b)=> b[1]-a[1]);
        const total = items.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

        let page = 1;
        if (parts.length >= 2){
          const arg = parts[1].toLowerCase();
          if (arg === "me"){
            const auth = getAuthIdByPlayer(player);
            const idx = items.findIndex(([aid,_r])=> aid===auth);
            page = (idx < 0) ? 1 : Math.floor(idx / PAGE_SIZE) + 1;
          } else {
            const num = parseInt(arg, 10);
            if (!isNaN(num) && num >= 1) page = num;
          }
        }
        if (page > totalPages) page = totalPages;

        const startIdx = (page - 1) * PAGE_SIZE;
        const endIdx = Math.min(total, startIdx + PAGE_SIZE);
        const slice = items.slice(startIdx, endIdx);

        // Header
        try {
          room.sendAnnouncement(`📊 Ranking — strona ${page}/${totalPages} (pozycje ${startIdx+1}–${endIdx} z ${total})`, player.id, infoColor, 'bold', HaxNotification.CHAT);
        } catch(_){}

        for (let i=0; i<slice.length; i++){
          const [aid, r] = slice[i];
          const pos = startIdx + i + 1;
          const name = (elo.names && elo.names[aid]) ? elo.names[aid] : aid;
          const lab = classLabel(r);
          const emoji = rankEmoji(lab);
          const line = `#${pos} ${emoji} ${name}: ${r.toFixed(1)} ${lab ? `| ${lab}` : ""}`;
          const col = rankColor(lab);
          try { room.sendAnnouncement(line, player.id, col, 'bold', HaxNotification.CHAT); }
          catch(_){ try { room.sendAnnouncement(line); } catch(__) {} }
        }

        // Footer with hints + your position
        const auth = getAuthIdByPlayer(player);
        const idx = items.findIndex(([aid,_r])=> aid===auth);
        if (idx >= 0){
          const myR = elo.ratings[auth];
          const myLab = classLabel(myR);
          const myEmoji = rankEmoji(myLab);
          const myCol = rankColor(myLab);
          const meLine = `• Twoja pozycja: #${idx+1} — ${myEmoji} ${player.name} | ${myR.toFixed(1)} ${myLab ? `| ${myLab}` : ""}`;
          try { room.sendAnnouncement(meLine, player.id, myCol, 'bold', HaxNotification.CHAT); }
          catch(_){ try { room.sendAnnouncement(meLine, player.id); } catch(__) {} }
        } else {
          try { room.sendAnnouncement(`• Brak pozycji (brak gier)`, player.id, infoColor, 'bold', HaxNotification.CHAT); } catch(_){}
        }

        try {
          room.sendAnnouncement(`Podpowiedź: użyj "!ranking {nr}" albo "!ranking me"`, player.id, infoColor, 'bold', HaxNotification.CHAT);
        } catch(_){}

        return false;
      }


        // ZAMIANA starego: if (lower.startsWith("!stats")) { ...tylko ELO... }
// NA:
if (
  lower === "!stats" || lower.startsWith("!stats ") ||
  lower === "!staty" || lower.startsWith("!staty ") ||
  lower === "!stat"  || lower.startsWith("!stat ")  ||
  lower === "!me"    || lower.startsWith("!me ")
){
  const parts = msg.trim().split(/\s+/);
  let target = player;
  if (parts.length >= 2){
    const name = parts.slice(1).join(" ").toLowerCase();
    const found = (room.getPlayerList && room.getPlayerList())?.find(
      p => (p.name || "").toLowerCase() === name
    );
    if (found) target = found;
  }
  try{
    const { line, col } = printUnifiedStatsLine(target);
    try {
      room.sendAnnouncement(line, player.id, col, 'bold', HaxNotification.CHAT);
    } catch(_) {
      room.sendAnnouncement(line, player.id);
    }
  }catch(e){
    try {
      room.sendAnnouncement("Nie udało się wyświetlić statystyk.", player.id, errorColor, 'bold', HaxNotification.CHAT);
    } catch(_) {
      try { room.sendAnnouncement("Nie udało się wyświetlić statystyk.", player.id); } catch(__) {}
    }
  }
  return false; // zjadamy komendę, żeby nie dublować wyjścia
}


      // Detect user's AFK command; don't block original handling; schedule post-check
      if (lower === "!afk" || lower.startsWith("!afk ")){
        setTimeout(function(){
          handleAfkTransition(authBeforeChat, originalTeamBeforeChat);
        }, 60);
      }
    }catch(_){}
    if (typeof prev_onPlayerChat === "function") return prev_onPlayerChat(player, message);
    return true;
  ;

  

  // Expose selected helpers for code defined outside this IIFE.
  try {
    const setGlobalFn = (name, fn) => {
      if (typeof fn === "function" && typeof globalThis[name] !== "function") {
        globalThis[name] = fn;
      }
    };
    setGlobalFn("getAuthIdByPlayer", getAuthIdByPlayer);
    setGlobalFn("ensureProfile", ensureProfile);
    setGlobalFn("classLabel", classLabel);
    setGlobalFn("rankEmoji", rankEmoji);
    setGlobalFn("rankColor", rankColor);
    setGlobalFn("printUnifiedStatsLine", printUnifiedStatsLine);
  } catch (_) {
    // Ignore export errors in non-browser runtimes.
  }
}
})();
/* === Command: !rangi — progi ELO, nazwy i emoji === */
function rangiCommand(player, message){
    try{
        var lines = [
            "Progi ELO i rangi:",
            "< 850 — Gówienko 💩",
            "850–950 — Żółtodziób 🐣",
            "951 — 1050 Początkujący ⚪",
            "1051–1199 — Gracz 🥉",
            "1200–1299 — Kox 🥈",
            "1300–1399 — Mistrz 🥇",
            "1400–1550 — Legenda 👑",
            "> 1550 — Nieśmiertelny 🔥"
        ];
        for (var i=0;i<lines.length;i++){
            room.sendAnnouncement(lines[i], player.id, infoColor, 'bold', HaxNotification.CHAT);
        }
    } catch(e){
        room.sendAnnouncement("Nie udało się wyświetlić tabeli rang.", player.id, errorColor, 'bold', HaxNotification.CHAT);
    }
}


// === Commands: !stats / !staty / !stat — unified ===
function unifiedStatsCommand(player, message){
  try{
    const parts = (message||"").trim().split(/\s+/);
    let target = player;
    if (parts.length>=2){
      const name = parts.slice(1).join(" ").toLowerCase();
      const found = room.getPlayerList().find(p => (p.name||"").toLowerCase() === name);
      if (found) target = found;
    }
    const {line, col} = printUnifiedStatsLine(target);
    room.sendAnnouncement(line, player.id, col, 'bold', HaxNotification.CHAT);
  }catch(e){
    try{ room.sendAnnouncement("Nie udało się wyświetlić statystyk.", player.id, errorColor, 'bold', HaxNotification.CHAT); }catch(_){}
  }
  return false;
}
