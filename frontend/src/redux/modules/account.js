import ws from "../../shared/socket_io";

// < Actions >
// --------------------------------------------------

const SAVE_TOKEN 	= "SAVE_TOKEN";
const LOGOUT 		= "LOGOUT";
const PASS_DATA		= "PASS_DATA";

// < Actions Creators >
// --------------------------------------------------

function saveToken(token) {
	return {
		type: SAVE_TOKEN,
		token
	};
}

function logout() {
	return {
		type: LOGOUT
	};
}

function passData(data) {
	return {
		type: PASS_DATA,
		data
	};
}

// < API Actions >
// --------------------------------------------------

function defaultLogin(email, password) {
	return (dispatch, getState) => {
		const { socket } = getState();

		fetch("/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"email" 	: email,
				"password"	: password
			})
		})
		.then(response => response.json())
		.then(json => {
			if (json.data) {
				ws.socket.emit('login_report', json.data.access_token);
				dispatch(saveToken(json.data));
			}
		})
		.catch(err => console.log(err));
	};
}

function createAccount(data) {
	return dispatch => {

		fetch("/auth/registration", {
			method: "POST",
			body: data
		})
		.then(response =>  response.json())
		.then(json => {
			if (json.data) {
				dispatch(saveToken(json.data));
			}
		})
		.catch(err => console.log(err));
	};
}

// < Initial State >
// --------------------------------------------------

const initialState = {
	isLoggedIn: localStorage.getItem("AccessToken") ? true : false,
	AccessToken: localStorage.getItem("AccessToken"),
	RefreshToken: localStorage.getItem("RefeshToken"),
	PK: localStorage.getItem("PK")
};

// < Reducer >
// --------------------------------------------------

function reducer(state = initialState, action) {
	switch(action.type) {
		case SAVE_TOKEN:
			return applySetToken(state, action);
		case LOGOUT:
			return applyLogout(state, action);
		case PASS_DATA:
			return applyGetData(state, action);
		default:
			return state;
	}
}

// < Reducer Functions >
// --------------------------------------------------

function applySetToken(state, action) {

	const { access_token, refresh_token, pk } = action.token;

	localStorage.setItem("AccessToken", access_token);
	localStorage.setItem("RefreshToken", refresh_token);
	localStorage.setItem("PK", pk);

	return {
		...state,
		isLoggedIn		: true,
		AccessToken		: access_token,
		RefreshToken	: refresh_token,
		PK				: pk,
	};
}

function applyLogout(state, action) {

	localStorage.removeItem("AccessToken");
	localStorage.removeItem("RefreshToken");
	localStorage.removeItem("PK");

	return {
		isLoggedIn: false,
		AccessToken: undefined,
		RefreshToken: undefined,
		PK: undefined
	};
}

function applyGetData(state, action) {
	const { data } = action;

	return {
		...state,
		info: data
	};
}

// < Exports >
// --------------------------------------------------

const actionCreators = {
	defaultLogin,
	createAccount,
	logout,
};

export { actionCreators };

// export reducer by default

export default reducer;