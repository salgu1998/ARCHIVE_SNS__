
// < Actions >
// --------------------------------------------------

const GET_COMMENT_LIST = "GET_COMMENT_LIST";
const SAVE_NEW_COMMENT = "SAVE_NEW_COMMENT";

// < Actions Creators >
// --------------------------------------------------

function getCommentList(data) {
	return {
		type: GET_COMMENT_LIST,
		data
	}
}

function saveNewComment(data) {
	return {
		type: SAVE_NEW_COMMENT,
		data
	}
}

// < API Actions >
// --------------------------------------------------


function createComment(comment) {

    return (dispatch, getState) => {
		const { account : { AccessToken }} = getState();
		
		fetch("/comment/commentCreate", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${AccessToken}`
			},
			body: JSON.stringify({
				content     : comment
			})
		})
		.then(res => res.json())
		.then(json => {
			console.log(json.data)
			if (json.data) {
				dispatch(saveNewComment(json.data));
			}
		})
		.catch(err => console.log(err));
    };
    
};

function commentList(post_pk, offset, limit, order_by) {

	return (dispatch, getState) => {
		const { account : { AccessToken }} = getState();
		
		fetch("/comment/", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${AccessToken}`
			},
			body: JSON.stringify({
                post_pk : post_pk,
				offset 	: offset,
				limit	: limit,
				order_by: order_by,
			})
		})
		.then(response => response.json())
		.then(json => {
			if (json.data) {
				dispatch(getCommentList(json.data));
			}
		})
		.catch(err => console.log(err));
    };

}

// < Initial State >
// --------------------------------------------------

const initialState = {
	comment_list : []
}

// < Reducer >
// --------------------------------------------------

function reducer(state = initialState, action) {
	switch(action.type) {
		case SAVE_NEW_COMMENT:
			return applySaveNewComment(state, action);

		case GET_COMMENT_LIST:
			return applyGetCommentList(state, action);
		default:
			return state;
	}
}

function applySaveNewComment(state, action) {
	
	const {data} = action;

	return {
		...state
	}
}
            
function applyGetCommentList(state, action) {

	const { data } = action;

	return {
		...state,
		comment_list : data
	};
}

// < Exports >
// --------------------------------------------------

const actionCreators = {
	createComment,
	commentList
};

export { actionCreators };

export default reducer;