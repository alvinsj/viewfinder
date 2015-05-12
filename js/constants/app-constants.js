var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
  	INSTAGRAM_CODE: null,
  	INSTAGRAM_ACCESS_TOKEN: null,

  	FETCH_TIMELINE: null,
  	FETCH_USER_TIMELINE: null,

  	VIEW_USER: null,
  	VIEW_DETAILS: null,
    VIEW_SETTINGS: null,
    BACK_TO_HOME: null,
    LOGOUT: null
  })
};