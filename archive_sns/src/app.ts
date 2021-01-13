import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { appendFile } from "fs";
import { db_conn } from "./db_connection";

var indexRouter = require(__dirname+'/../src/routes/index');
var signupRouter = require('./routes/SignUp');
var AuthRouter = require('./routes/Auth');
var FeedRouter = require(__dirname+'/../src/routes/Feed');
var profileRouter = require(__dirname+'/../src/routes/profile');
var feedlikeRouter = require('./routes/feedlike');
var commentlikeRouter = require('./routes/commentlike');
var commentRouter = require(__dirname+'/../src/routes/comment');

// npm install --save helmet  보안
var helmet = require('helmet');
// 압축
var compression = require('compression');

// npm install nsp -g 쿠키관련보안
// nsp check

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initDB();

    //@TODO : Integrate Routers
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(bodyParser.json());
    this.app.use(helmet());
    this.app.use(compression());
    
    this.app.use('/', indexRouter);
    this.app.use('/signup', signupRouter);
    
    // Authentifications
    this.app.use('/auth/login', AuthRouter);

    this.app.use('/Feed', FeedRouter);
    this.app.use('/profile', profileRouter);
    this.app.use('/feedlike', feedlikeRouter);
    this.app.use('/commentlike', commentlikeRouter);
  }

  /**
   * DB Initializer
   */

  private async initDB(): Promise<void> {
    try {
      await db_conn();
    } 
    catch (error) {
      console.log("didn't connect Database : \n", error);
    }
  }

  /**
   * Run Express Server
   * 
   * @param port Server Port Number
   */
  public async run(port: number) : Promise<void> {
    try {
      this.app.listen(port, () => {
        console.log('Conneted ', port, ' port');
      });
    }
    catch (error) {
      console.log("error : ", error);
    }
  }
}