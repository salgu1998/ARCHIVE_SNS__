import { connect } from "react-redux";
import Container from "./container";

import { actionCreators as commentAct } from "../../redux/modules/comment";

const mapStateToProps = (state, ownProps) => {
	const { comment: { comment_list } } = state;

	return { comment_list };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        CommentList: (post_pk, offset, limit, order_by) => {
            dispatch(commentAct.CommentList(post_pk, offset, 0, order_by));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
