import CryptoJS from "react-native-crypto-js";
import SQLite from 'react-native-sqlite-storage';
import { sha256 } from 'react-native-sha256';

export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;
    private static DB_PATH = "test.db";

    public static getInstance = () => {
        if(!StrongboxDatabase.strongboxDatabase){
            StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
        }
        return StrongboxDatabase.strongboxDatabase;
    }
    public connectDatabase = (failToOpenDB:any) =>{
        return SQLite.openDatabase({
      name:StrongboxDatabase.DB_PATH, // assets/www 안에 있음
      createFromLocation:1,
    },
    ()=>{},
    failToOpenDB,
    );
    }

    private executeQuery = (db:any, query:string, params = []) => { // 쿼리를 날리고 비동기로 받자
        return new Promise((succ, fail) =>{
            db.transaction((trans)=>{
                 trans.executeSql(query,params,(trans,results)=>{
                    succ(results);
                },(error)=>{
                    fail(error);
                });
            });
        });
    }
    
    public async createUser(password:string){ // 사용자 등록 함수
        let db = null;
        let key = null;
        let encryptedPassword, salt;

        const onFail = () =>{
            
        }

        db = await this.connectDatabase(onFail);
        await sha256((new Date()).toUTCString()).then(hash => salt = hash); // salt 구하기
        await sha256(password+salt).then(hash => encryptedPassword = hash); // db에 저장할 키의 해시값
        key = password + salt; // 실제로 데이터를 암복호화 할 키

        const val = "('" + encryptedPassword + "', '" + salt + "')";
        let singleInsert = await this.executeQuery(db, "INSERT INTO USERS_TB(PASSWORD, SALT) VALUES" + val);
        console.log(singleInsert);
        return key;
    }
}