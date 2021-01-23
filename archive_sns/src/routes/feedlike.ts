/**
 *  게시물 좋아요 관련 라우트
 */
import * as express from "express";
const router = express.Router();

import { VerifyAccessToken } from "../Middleware/JWT_Auth";

import { PostLikeService } from '../services/LikeService';

/**
 * 
 * @param result 라우트 처리 결과
 * @param res 상태 처리 결과
 */
const status = function(result, res){
    if(!result){
        return res.status(403).send({
            status : 403,
            success : true,
            message : "Forbidden"
        });
    };
    return res.status(200).send({
        status : 200,
        success : true,
        message : "success"
    });  
}

// /**
//  * 좋아요 수 보기
//  */
// router.get(
//     '/',
//     function(req, res) {
//     const likeInfo = req.body;


// });

// /**
//  * 좋아요 누른 사람  목록 보기
//  */
// router.get('/list/:feedNum', function(req, res) {
//     const like_Info = req.body;
// });

/**
 * 좋아요 눌렀나 안눌렀나?
 */
router.get(
    '/list/:feedNum', 
    VerifyAccessToken,
    async function(req, res) {
    const liketoggle_Info = req.body;
    const target_pk = liketoggle_Info.feed_pk;
    const pk = res.locals.jwt_payload.pk;

    const Like_Service = new PostLikeService();

    const Like_toggle = Like_Service.IsLike(
        pk,
        target_pk
    );
    return status(Like_toggle, res);
});

/**
 * 좋아요 입력, 삭제
 */
router.post(
    '/:feedNum', 
    async function(req, res) {
    const like_Info = req.body;
    const pk = res.locals.jwt_payload.pk;
    const giver = like_Info.Feed_pk;

    const PostLike = new PostLikeService();

    const Post_Like = await PostLike.ToggleLike(
        pk,
        giver
    );
    return status(Post_Like, res);
});

module.exports = router;