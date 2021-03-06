import React from 'react';
import PropTypes from "prop-types";

export const CommentView = props => (
    <div>
        작성자 : {props.comment.writer.name} <br/>
        {props.comment.content}
        <button
                        onClick = {props.delete_handler}
                        type = "submit">
                        <span>delete</span>
                    </button>
        <hr/>
        
    </div>
)

const Comment = props => (
    
    <div className = "Comment">

        <br/>
        
        <form
            className = "comment"
            onSubmit={props.submit_handler}
            method="post">

            <input 
                type = "comment"
                name = "comment"
                placeholder = "댓글을 입력해주세요." 
                value = {props.comment}
                onChange = {props.comment_input_handler} 
            />

            <input
                type = "submit"
                />
        </form>

        <br/>

        <hr/>

        { props.draw_handler() }

    </div>

);

Comment.propTypes = {
    comment_input_handler   : PropTypes.func.isRequired,
    submit_handler		    : PropTypes.func.isRequired,
};

export default Comment;