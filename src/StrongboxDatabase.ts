import SQLite from 'react-native-sqlite-storage';
import {sha256} from 'react-native-sha256';

export class StrongboxDatabase {
  private static strongboxDatabase: StrongboxDatabase;
  private static DB_PATH = 'test.db';

  public static getInstance = () => {
    if (!StrongboxDatabase.strongboxDatabase) {
      StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
    }
    return StrongboxDatabase.strongboxDatabase;
  };
  public connectDatabase = () => {
    return SQLite.openDatabase(
      {
        name: StrongboxDatabase.DB_PATH, // assets/www 안에 있음
        createFromLocation: 1,
      },
      () => {},
      this.onFailConnectDB,
    );
  };

  private executeQuery = (db: any, query: string, params = []) => {
    // 쿼리를 날리고 비동기로 받자
    return new Promise((succ, fail) => {
      db.transaction((trans) => {
        trans.executeSql(
          query,
          params,
          (tx, results) => {
            succ(results);
          },
          (error) => {
            fail(error);
          },
        );
      });
    });
  };

  private onFailConnectDB = () => {};

  public async createUser(password: string) {
    // 사용자 등록 함수
    let db = null;
    let key = null;
    let encryptedPassword, salt;

    db = await this.connectDatabase();
    await sha256(new Date().toUTCString()).then((hash) => (salt = hash)); // salt 구하기
    await sha256(password + salt).then((hash) => (encryptedPassword = hash)); // db에 저장할 키의 해시값
    key = password + salt; // 실제로 데이터를 암복호화 할 키

    const val = "('" + encryptedPassword + "', '" + salt + "')";
    let singleInsert = await this.executeQuery(
      db,
      'INSERT INTO USERS_TB(PASSWORD, SALT) VALUES' + val,
    );
    console.log(singleInsert);
    return key;
  }

  public async checkUser() {
    //사용자 있는지 여부 검사 후 true / false 반환
    let db = null;
    db = await this.connectDatabase();
    let selectQuery = await this.executeQuery(db, 'SELECT * FROM USERS_TB');
    const rows = selectQuery.rows;
    if (rows.length <= 0) {
      return false;
    }
    return true;
  }

  public async validUser(password: string) {
    let db = null;

    db = await this.connectDatabase();
    let selectQuery = await this.executeQuery(db, 'SELECT * FROM USERS_TB');
    const rows = selectQuery.rows; // 무조건 첫번째 row를 대상으로 하자(앱은 싱글사용자모드니깐)
    if (rows.length <= 0) {
      return false;
    } // 사용자가 없다면 로그인 실패

    const salt = rows.item(0).SALT;
    let encryptedPassword;
    await sha256(password + salt).then((hash) => (encryptedPassword = hash));

    if (encryptedPassword !== rows.item(0).PASSWORD) {
      return false;
    } // 일치하지 않으면 로그인 실패
    return password + salt; // 로그인 성공 시 key 반환
  }

  public async addGroup(groupName: string) {
    let db = null;
    db = await this.connectDatabase();
    let singleInsert = await this.executeQuery(
      db,
      'INSERT INTO GROUPS_TB(OWNER_IDX, GRP_NAME) VALUES(?, ?)',
      [0, groupName],
    );
    return {rowid: singleInsert.insertId, groupName: groupName};
  }

  public async getGroup() {
    let db = null;
    db = await this.connectDatabase();
    let selectQuery = await this.executeQuery(
      db,
      'SELECT IDX, GRP_NAME FROM GROUPS_TB',
      [],
    );
    return selectQuery.rows;
  }
}
