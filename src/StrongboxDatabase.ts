import CryptoJS from "react-native-crypto-js";
import SQLite from 'react-native-sqlite-storage';

export class StrongboxDatabase{
    private static strongboxDatabase: StrongboxDatabase;
    private static DB_PATH = "test.db";

    public static getInstance = () => {
        if(!StrongboxDatabase.strongboxDatabase){
            StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
        }
        return StrongboxDatabase.strongboxDatabase;
    }
    public connectDatabase = (successToOpenDB:any, failToOpenDB:any) =>{
        return SQLite.openDatabase({
      name:StrongboxDatabase.DB_PATH, // assets/www 안에 있음
      createFromLocation:1,
    },
    successToOpenDB,
    failToOpenDB,
    );
    }
    public testCrypto = () =>{
        // Encrypt
        let ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
        return ciphertext;
    }
    public testConnectDB = () =>{
        const testSuccess = () =>{
            alert("success");
        }
        const testFail = () =>{

        }
        let db = this.connectDatabase(testSuccess,testFail);

        db.close();
    }
}