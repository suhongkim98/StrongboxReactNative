import SQLite from 'react-native-sqlite-storage';
import {sha256} from 'react-native-sha256';
import CryptoJS from 'react-native-crypto-js';
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

  private getColumnCount = (db, column: string, table: string) => {
    let query = 'SELECT MAX(' + column + ') AS COUNT FROM ' + table;
    return new Promise((succ, fail) => {
      db.transaction((trans) => {
        trans.executeSql(
          query,
          [],
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
      'INSERT INTO GROUPS_TB(OWNER_IDX, GRP_NAME, SORT_ORDER) VALUES(?, ?, (SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM GROUPS_TB))',
      [0, groupName],
    );
    let countSelect = await this.getColumnCount(db, 'SORT_ORDER', 'GROUPS_TB');
    const count = countSelect.rows.item(0).COUNT;
    return {
      rowid: singleInsert.insertId,
      groupName: groupName,
      sortOrder: count,
    };
  }

  public async getGroup() {
    let db = null;
    db = await this.connectDatabase();
    let selectQuery = await this.executeQuery(
      db,
      'SELECT IDX, GRP_NAME, SORT_ORDER FROM GROUPS_TB ORDER BY SORT_ORDER ASC',
      [],
    );
    return selectQuery.rows;
  }

  public async addService(groupIdx: number, name: string) {
    let db = null;
    db = await this.connectDatabase();
    let singleInsert = await this.executeQuery(
      db,
      'INSERT INTO SERVICES_TB(GRP_IDX, SERVICE_NAME, SORT_ORDER) VALUES(?,?,(SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM SERVICES_TB))',
      [groupIdx, name],
    );
    let countSelect = await this.getColumnCount(
      db,
      'SORT_ORDER',
      'SERVICES_TB',
    );
    const count = countSelect.rows.item(0).COUNT;
    return {
      rowid: singleInsert.insertId,
      serviceName: name,
      sortOrder: count,
    };
  }

  public async getService() {
    let db = null;
    db = await this.connectDatabase();
    let selectQuery = await this.executeQuery(
      db,
      'SELECT IDX, SERVICE_NAME, GRP_IDX, SORT_ORDER FROM SERVICES_TB ORDER BY SORT_ORDER ASC',
      [],
    );
    return selectQuery.rows;
  }

  public async addAccount(
    serviceIDX: number,
    accountName: string,
    account: {OAuthAccountIDX?: number; id?: string; password?: string},
  ) {
    //
    let db = await this.connectDatabase();
    let query = null;
    let params = [];
    let [id, password] = [account.id, account.password];
    if (account.OAuthAccountIDX) {
      query =
        'INSERT INTO ACCOUNTS_TB(ACCOUNT_NAME, SERVICE_IDX, OAUTH_LOGIN_IDX, SORT_ORDER) VALUES(?,?,?,(SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM ACCOUNTS_TB))';
      params = [accountName, serviceIDX, account.OAuthAccountIDX];
    } else {
      const key = global.key;
      let ciphertext = CryptoJS.AES.encrypt(account.password, key).toString(); // AES암호화
      query =
        'INSERT INTO ACCOUNTS_TB(SERVICE_IDX,ACCOUNT_NAME,ID,PASSWORD, SORT_ORDER) VALUES(?,?,?,?,(SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM ACCOUNTS_TB))';
      params = [serviceIDX, accountName, account.id, ciphertext];
    }

    let singleQuery = await this.executeQuery(db, query, params);

    let selectQuery;
    if (account.OAuthAccountIDX) {
      query =
        'SELECT ID, PASSWORD FROM ACCOUNTS_TB WHERE IDX = ' +
        account.OAuthAccountIDX;
      selectQuery = await this.executeQuery(db, query, []);
      [id, password] = [
        selectQuery.rows.item(0).ID,
        selectQuery.rows.item(0).PASSWORD,
      ];
    }
    //출력 순서를 위한 정렬 순서 뽑기
    const countSelect = await this.getColumnCount(
      db,
      'SORT_ORDER',
      'ACCOUNTS_TB',
    );
    const count = countSelect.rows.item(0).COUNT;

    const date = new Date();
    const now =
      date.getFullYear() +
      '-' +
      date.getMonth() +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds();
    const result = {
      ROWID: singleQuery.insertId,
      DATE: now,
      NAME: accountName,
      SERVICE_IDX: serviceIDX,
      OAuthIDX: account.OAuthAccountIDX,
      ID: id,
      PASSWORD: password,
      ORDER: count,
    };
    return result;
  }
  public async getAccount() {
    let db = this.connectDatabase();
    let query =
      'SELECT ACCOUNTS_TB.IDX,SERVICE_IDX,ACCOUNT_NAME,DATE,OAUTH_LOGIN_IDX,ID,PASSWORD,ACCOUNTS_TB.SORT_ORDER AS ACCOUNT_ORDER FROM ACCOUNTS_TB ' +
      'JOIN SERVICES_TB ON ACCOUNTS_TB.SERVICE_IDX = SERVICES_TB.IDX ' +
      'JOIN GROUPS_TB ON SERVICES_TB.GRP_IDX = GROUPS_TB.IDX ' +
      'ORDER BY ACCOUNTS_TB.SORT_ORDER ASC';
    let allAccountSelectQuery = await this.executeQuery(db, query, []);
    const allAccountRows = allAccountSelectQuery.rows;

    const list = []; // OAUTH 계정만 뽑아내기
    for (let i = 0; i < allAccountRows.length; i++) {
      if (allAccountRows.item(i).OAUTH_LOGIN_IDX) {
        list.push(allAccountRows.item(i).OAUTH_LOGIN_IDX);
      }
    }

    if (list.length > 0) {
      let idx = '(';
      for (let i = 0; i < list.length; i++) {
        idx += list[i];
        if (i !== list.length - 1) {
          idx += ',';
        } else {
          idx += ')';
        }
      }
      query =
        'SELECT ATB.IDX,STB.SERVICE_NAME,ATB.ACCOUNT_NAME,ATB.ID,ATB.PASSWORD FROM ACCOUNTS_TB ATB,SERVICES_TB STB ' +
        'WHERE ATB.IDX IN ' +
        idx +
        ' AND ATB.SERVICE_IDX = STB.IDX';
      const oauthAccountSelectQuery = await this.executeQuery(db, query, []);
      const oauthAccountRows = oauthAccountSelectQuery.rows;

      for (let i = 0; i < allAccountRows.length; i++) {
        for (let j = 0; j < oauthAccountRows.length; j++) {
          // 나중에 SQL문으로 한번에 뽑아보자
          if (
            allAccountRows.item(i).OAUTH_LOGIN_IDX ===
            oauthAccountRows.item(j).IDX
          ) {
            allAccountRows.item(i).OAUTH_SERVICE_NAME = oauthAccountRows.item(
              j,
            ).SERVICE_NAME;
            allAccountRows.item(i).ID = oauthAccountRows.item(j).ID;
            allAccountRows.item(i).PASSWORD = oauthAccountRows.item(j).PASSWORD;
          }
        }
      }
    }
    return allAccountRows;
  }
}
