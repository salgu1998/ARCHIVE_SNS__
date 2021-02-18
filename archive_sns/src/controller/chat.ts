/**
 * 채팅 관련 라우트
 */
import { Response } from "express";
import sanitizeHtml from 'sanitize-html';
import { VerifyAccessToken } from "../Middleware/JWT_Auth";
import { ChatMsgDTO } from '../Models/DTOs/ChatDTO';
import { ChatService } from '../services/ChatService';

import {
    JsonController,
    Get,
    Param,
    Body,
    Post,
    Put,
    UseBefore,
    Req,
    Res,
    Delete,
    HttpCode,
    QueryParams,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";

@JsonController("/chat")
export class ChatControl {
    constructor( private chat_service : ChatService ) {}

    @HttpCode(200)
    @Post()
    @OpenAPI({
        summary: "SendMsg",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(VerifyAccessToken)
    public async SendMsg(
        @Body() ChatMsg_DTO: ChatMsgDTO,
        @Req() req,
        @Res() res: Response,
    ) {
        if(!ChatMsg_DTO.content){
            return res.status(400).send({
                status : 400,
                success : false,
                message : "no ChatMsg_DTO Content"
            });
        }

        const SendMsg_Result = await this.chat_service.SendMsg(
            res.locals.jwt_payload.pk, 
            req.body.group_pk, 
            ChatMsg_DTO
        );

        if(!SendMsg_Result)
        return res.status(400).send({
        status: 400, 
        success: false, 
        message: "fail to SendMsg"
        });

        const ws = req.app.get('socket_io');
        console.log(ws.socket.rooms);

        SendMsg_Result.notify.map( elem => {
            ws.io.to(elem.listener_pk)
                .emit('chat_notify', elem);
        });

        return SendMsg_Result.chat;
    }

    @HttpCode(200)
    @Get('/:group_pk')
    @OpenAPI({
        summary: "GetChatContents",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(VerifyAccessToken)
    public async GetChatContents(
        @Param("group_pk") group_pk: string,
        @Res() res: Response
        ) {
        const user_pk = res.locals.jwt_payload.pk;

        const GetChatContents_Result = await this.chat_service.GetChatContents(
            group_pk, 
            0, 
            10
        );

        if(!GetChatContents_Result){
            return res.status(400).send({
            status: 400, 
            success: false, 
            message: "fail to GetChatContents"
            });
        }

        return GetChatContents_Result;
    }

    @HttpCode(200)
    @Delete()
    @OpenAPI({
        summary: "GetChatContents",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(VerifyAccessToken)
    public async ExitChatGroup(
        @Req() req,
        @Res() res: Response
        ) {
        const user_pk = res.locals.jwt_payload.pk;

        const ExitChatGroup_Result = await this.chat_service.ExitChatGroup(
            req.body.account_pk,
            req.body.group_pk
        );

        if(!ExitChatGroup_Result){
            return res.status(400).send({
            status: 400, 
            success: false, 
            message: "fail to ExitChatGroup"
            });
        }

        return ExitChatGroup_Result;
    }
}