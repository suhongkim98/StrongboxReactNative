import SQLite from 'react-native-sqlite-storage';
import {sha256} from 'react-native-sha256';
import CryptoJS from 'react-native-crypto-js';
export class StrongboxDatabase {
  private static strongboxDatabase: StrongboxDatabase;
  private static DB_NAME = 'accong.db';

  public static getInstance = () => {
    if (!StrongboxDatabase.strongboxDatabase) {
      StrongboxDatabase.strongboxDatabase = new StrongboxDatabase();
    }
    return StrongboxDatabase.strongboxDatabase;
  };
  public connectDatabase = () => {
    const db = SQLite.openDatabase(
      {
        name: 'a', // assets/www 안에 있음
        location: 'Library',
        createFromLocation: '~www/' + StrongboxDatabase.DB_NAME,
      },
      () => {},
      this.onFailConnectDB,
    );
    db.executeSql(
      'PRAGMA foreign_keys = ON;', //foreign key 사용 하기 위해 PRAGRA
      [],
      (_) => {
        console.log(`Enable foreign keys success`);
      },
      ({}, error) => {
        console.log(`Enable foreign keys error: ${error}`);
      },
    );
    return db;
  };

  private getColumnMaxValue = (db, column: string, table: string) => {
    let query = 'SELECT MAX(' + column + ') AS COUNT FROM ' + table;
    return new Promise((succ, fail) => {
      db.transaction((trans) => {
        trans.executeSql(
          query,
          [],
          (tx, results) => {
            if (results.rows.item(0).COUNT === null) {
              results.rows.item(0).COUNT = 0;
            }
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

  public async updateSortOrder(table: string, idx: any, order: any) {
    //idx, order은 배열로 받고 그만큼 반복하며 update
    let db = await this.connectDatabase();
    let query;
    for (let i = 0; i < idx.length; i++) {
      query =
        'UPDATE ' +
        table +
        ' SET SORT_ORDER = ' +
        order[i] +
        ' WHERE IDX = ' +
        idx[i];
      await this.executeQuery(db, query, []);
    }
    return true;
  }

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
    let selectQuery: any = await this.executeQuery(db, 'SELECT * FROM USERS_TB');
    const rows = selectQuery.rows;
    if (rows.length <= 0) {
      return false;
    }
    return true;
  }

  public async validUser(password: string) {
    let db = null;

    db = await this.connectDatabase();
    let selectQuery: any = await this.executeQuery(db, 'SELECT * FROM USERS_TB');
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
    let singleInsert: any = await this.executeQuery(
      db,
      'INSERT INTO GROUPS_TB(GRP_NAME, SORT_ORDER) VALUES(?, (SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM GROUPS_TB))',
      [groupName],
    );
    let countSelect: any = await this.getColumnMaxValue(
      db,
      'SORT_ORDER',
      'GROUPS_TB',
    );
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
    let selectQuery: any = await this.executeQuery(
      db,
      'SELECT IDX, GRP_NAME, SORT_ORDER FROM GROUPS_TB ORDER BY SORT_ORDER ASC',
      [],
    );
    return selectQuery.rows;
  }

  public async addService(groupIdx: number, name: string) {
    let db = null;
    db = await this.connectDatabase();
    let singleInsert: any = await this.executeQuery(
      db,
      'INSERT INTO SERVICES_TB(GRP_IDX, SERVICE_NAME, SORT_ORDER) VALUES(?,?,(SELECT IFNULL(MAX(SORT_ORDER), 0) + 1 FROM SERVICES_TB))',
      [groupIdx, name],
    );
    let countSelect: any = await this.getColumnMaxValue(
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
    let selectQuery: any = await this.executeQuery(
      db,
      'SELECT IDX, SERVICE_NAME, GRP_IDX, SORT_ORDER FROM SERVICES_TB ORDER BY SORT_ORDER ASC',
      [],
    );
    return selectQuery.rows;
  }

  public async addAccount(account: {
    accountName: string;
    serviceIDX: number;
    OAuthAccountIDX?: number;
    id?: string;
    password?: string;
  }) {
    //db에 계정 추가만 한다, 출력은 mainScreen에서 계속 db에서 데이터를 뽑아 출력하는 것으로 바꿀 것이기 때문에
    const db = await this.connectDatabase();
    let query = null;
    let params = [];
    let accountCount: any = await this.getColumnMaxValue(
      db,
      'SORT_ORDER',
      'ACCOUNTS_TB',
    );
    let OauthAccountCount: any = await this.getColumnMaxValue(
      db,
      'SORT_ORDER',
      'OAUTH_ACCOUNTS_TB',
    );
    //sort order count
    let count =
      accountCount.rows.item(0).COUNT >= OauthAccountCount.rows.item(0).COUNT
        ? accountCount.rows.item(0).COUNT + 1
        : OauthAccountCount.rows.item(0).COUNT + 1;

    if (account.OAuthAccountIDX) {
      // oauth 계정 추가
      query =
        'INSERT INTO OAUTH_ACCOUNTS_TB(ACCOUNT_IDX, ACCOUNT_NAME, SERVICE_IDX, SORT_ORDER, DATE) ' +
        "VALUES(?,?,?,?,datetime('now', 'localtime'))";
      params = [
        account.OAuthAccountIDX,
        account.accountName,
        account.serviceIDX,
        count,
      ];
    } else {
      // 일반 계정 추가
      const key = global.key;
      let ciphertext = CryptoJS.AES.encrypt(account.password, key).toString(); // AES암호화
      query =
        'INSERT INTO ACCOUNTS_TB(SERVICE_IDX,ACCOUNT_NAME,ID,PASSWORD, SORT_ORDER, DATE) ' +
        "VALUES(?,?,?,?,?,datetime('now', 'localtime'))";
      params = [
        account.serviceIDX,
        account.accountName,
        account.id,
        ciphertext,
        count,
      ];
    }
    let singleQuery = await this.executeQuery(db, query, params);
    return singleQuery;
  }

  public async getAccount(serviceIdx: number) {
    //일반계정tb, oauth계정tb에서 모든 데이터를 뽑아온다.
    //oauth계정은 accounttb, servicetb와 join을 해서 뽑는다.
    //sort order순으로 나열한다.
    const db = await this.connectDatabase();
    let query =
      'SELECT * FROM ACCOUNTS_TB WHERE SERVICE_IDX = ' +
      serviceIdx +
      ' ORDER BY SORT_ORDER ASC';
    const accountQuery: any = await this.executeQuery(db, query, []); // 일반계정 뽑아내기, 복호화는 메인화면에서 하자
    const accountRows = accountQuery.rows;

    //oauth의 account idx를 이용해 뽑아야할 것은 id, pw, oauth service idx -> oauth service name
    query =
      'SELECT OTB.IDX, OTB.ACCOUNT_NAME, OTB.SORT_ORDER, OTB.DATE, STB.SERVICE_NAME AS OAUTH_SERVICE_NAME, ATB.ID, ATB.PASSWORD ' +
      'FROM OAUTH_ACCOUNTS_TB OTB ' +
      'JOIN ACCOUNTS_TB ATB ON OTB.ACCOUNT_IDX = ATB.IDX ' +
      'JOIN SERVICES_TB STB ON ATB.SERVICE_IDX = STB.IDX ' +
      'WHERE OTB.SERVICE_IDX = ' +
      serviceIdx +
      ' ORDER BY OTB.SORT_ORDER ASC';

    const oauthQuery: any = await this.executeQuery(db, query, []);
    const oauthRows = oauthQuery.rows;

    //account, oauth 모두 오름차순으로 뽑았기 때문에 번갈아가며 둘을 합쳐 sort하자
    const result = [];
    let [i, j] = [0, 0];
    while (accountRows.length > i && oauthRows.length > j) {
      const accountElement = accountRows.item(i);
      const oauthAccountElement = oauthRows.item(j);
      if (accountElement.SORT_ORDER > oauthAccountElement.SORT_ORDER) {
        result.push(oauthAccountElement);
        j++;
      } else {
        result.push(accountElement);
        i++;
      }
    }
    while (accountRows.length > i) {
      result.push(accountRows.item(i));
      i++;
    }
    while (oauthRows.length > j) {
      result.push(oauthRows.item(j));
      j++;
    }
    //
    return result;
  }
  public async deleteAccount(table: string, idx: number[]) {
    //배열로 받아 동기식으로 처리
    let value = '(';
    for (let i = 0; i < idx.length; i++) {
      const element = idx[i];
      value += element;
      if (i + 1 < idx.length) {
        value += ',';
      }
    }
    value += ')';
    const db = await this.connectDatabase();
    const query = 'DELETE FROM ' + table + ' WHERE IDX IN ' + value;
    const result = await this.executeQuery(db, query, []);
    return result;
  }
  public async deleteGroup(idx: number[]) {
    let value = '(';
    for (let i = 0; i < idx.length; i++) {
      const element = idx[i];
      value += element;
      if (i + 1 < idx.length) {
        value += ',';
      }
    }
    value += ')';
    const db = await this.connectDatabase();
    const query = 'DELETE FROM GROUPS_TB WHERE IDX IN ' + value;
    const result = await this.executeQuery(db, query, []);
    return result;
  }
  public async deleteService(idx: number[]) {
    let value = '(';
    for (let i = 0; i < idx.length; i++) {
      const element = idx[i];
      value += element;
      if (i + 1 < idx.length) {
        value += ',';
      }
    }
    value += ')';
    console.log(value);
    const db = await this.connectDatabase();
    const query = 'DELETE FROM SERVICES_TB WHERE IDX IN ' + value;
    const result = await this.executeQuery(db, query, []);
    return result;
  }
  public async isExistGroupName(grpName: string) {
    const query = "SELECT * FROM GROUPS_TB WHERE GRP_NAME = '" + grpName + "'";

    const db = await this.connectDatabase();
    const result: any = await this.executeQuery(db, query, []);
    const rows = result.rows;
    if (rows.length > 0) {
      return rows.item(0).IDX;
    }
    return -1;
  }
  public async isExistServiceName(serviceName: string, groupIndex: number) {
    const query =
      'SELECT * FROM SERVICES_TB STB ' +
      'JOIN GROUPS_TB GTB ON STB.GRP_IDX = GTB.IDX ' +
      'WHERE GTB.IDX = ' +
      groupIndex +
      " AND STB.SERVICE_NAME = '" +
      serviceName +
      "'";

    const db = await this.connectDatabase();
    const result: any = await this.executeQuery(db, query, []);
    const rows = result.rows;
    if (rows.length > 0) {
      return rows.item(0).IDX;
    }
    return -1;
  }
  public async isExistAccountName(accountName: string, serviceIndex: number) {
    const query =
      'SELECT * FROM ACCOUNTS_TB ATB ' +
      'JOIN SERVICES_TB STB ON STB.IDX = ATB.SERVICE_IDX ' +
      'WHERE STB.IDX = ' +
      serviceIndex +
      " AND ATB.ACCOUNT_NAME = '" +
      accountName +
      "'";

    const db = await this.connectDatabase();
    const result: any = await this.executeQuery(db, query, []);
    const rows = result.rows;
    if (rows.length > 0) {
      return rows.item(0).IDX;
    }
    return -1;
  }
  public async isExistOauthAccountName(
    oauthAccountName: string,
    serviceIndex: number,
    accountIndex: number,
  ) {
    const query =
      'SELECT * FROM OAUTH_ACCOUNTS_TB OTB ' +
      'JOIN SERVICES_TB STB ON STB.IDX = OTB.SERVICE_IDX ' +
      'WHERE STB.IDX = ' +
      serviceIndex +
      " AND OTB.ACCOUNT_NAME = '" +
      oauthAccountName +
      "' AND OTB.ACCOUNT_IDX = " +
      accountIndex;

    const db = await this.connectDatabase();
    const result: any = await this.executeQuery(db, query, []);
    const rows = result.rows;
    if (rows.length > 0) {
      return rows.item(0).IDX;
    }
    return -1;
  }
  public async getAllSyncData() {
    // 그룹리스트 뽑기
    const groupQuery = "SELECT IDX, GRP_NAME FROM GROUPS_TB";
    // 서비스 리스트 뽑기
    const serviceQuery = "SELECT IDX, GRP_IDX, SERVICE_NAME "
    + "FROM SERVICES_TB" ;
    // 계정리스트 뽑기
    const accountQuery = "SELECT IDX, DATE, SERVICE_IDX, ACCOUNT_NAME, ID, PASSWORD FROM ACCOUNTS_TB "
    + "ORDER BY DATE ASC "
    // oauth계정 뽑기"
    const oauthAccountQuery = "SELECT IDX, ACCOUNT_IDX, ACCOUNT_NAME, SERVICE_IDX, DATE FROM OAUTH_ACCOUNTS_TB "
    + "ORDER BY DATE ASC ";
    const db = this.connectDatabase();
    const groups: any = await this.executeQuery(db, groupQuery, []);
    const services: any = await this.executeQuery(db, serviceQuery, []);
    const accounts: any = await this.executeQuery(db, accountQuery, []);
    const oauths: any = await this.executeQuery(db, oauthAccountQuery, []);

    const result = {
      groups: groups.rows.raw(),
      services: services.rows.raw(),
      accounts: accounts.rows.raw(),
      oauthAccounts: oauths.rows.raw(),
    }
    return result;
  }
  public async syncData(data: any) {
    const groups = data.groups;
    const services = data.services;
    const accounts = data.accounts;
    const oauthAccounts = data.oauthAccounts;
    
    const addGroupData = (group: any) => {
      return new Promise((succ, fail) => {
        this.addGroup(group.GRP_NAME).then((result) => {
          succ(result.rowid);
        }).catch((error) => {
          fail(error);
        });
      });
    }
    const addServiceData = (service: any, targetGroupIdx: number) => {
      return new Promise((succ, fail) => {
        this.addService(targetGroupIdx, service.SERVICE_NAME).then((result) => {
          succ(result.rowid);
          console.log('키는' + result.rowid);
        }).catch((error) => {
          fail(error);
        });
      });
    }
    const addAccountData = (account: any, targetServiceIdx: number) => {
      return new Promise((succ, fail) => {
        this.addAccount({accountName: account.ACCOUNT_NAME, id: account.ID, password: account.PASSWORD, serviceIDX: targetServiceIdx}).then((result: any) => {
          succ(result.insertId);
        }).catch((error) => {
          fail(error);
        });
      });
    }
    const addOauthAccountData = (oauthAccount: any, targetServiceIdx: number, targetAccountIdx: number) => {
      return new Promise((succ, fail) => {
        this.addAccount({accountName: oauthAccount.ACCUNT_NAME, serviceIDX: targetServiceIdx, OAuthAccountIDX: targetAccountIdx}).then((result: any) => {
          succ(result.insertId);
        }).catch((error) => {
          fail(error);
        });
      });
    }
    const updateAccountData = (account: any, targetAccountIdx: number) => {
      const id = account.ID;
      const encrypedPassword = CryptoJS.AES.encrypt(account.PASSWORD, global.key).toString();

      const query = "UPDATE ACCOUNTS_TB SET (ID, PASSWORD, DATE) = ('" + id + "', '" + encrypedPassword + "', datetime('now', 'localtime')) "
      + "WHERE IDX = " + targetAccountIdx;

      const db = this.connectDatabase();
      return this.executeQuery(db, query, []);
    }
    const updateOauthAccountData = (oauthAccount: any, targetServiceIdx: number, targetAccountIdx: number) => {
      //target서비스idx, target계정idx로 oauth 계정 업데이트
      const query = "UPDATE OAUTH_ACCOUNTS_TB SET (ACCOUNT_NAME, DATE) = (" + oauthAccount.ACCOUNT_NAME + ", datetime('now', 'localtime')) "
      + "WHERE ACCOUNT_IDX = " + targetAccountIdx + " AND SERVICE_IDX = " + targetServiceIdx;

      const db = this.connectDatabase();
      return this.executeQuery(db, query, []);
    }
    const splitDate = (date: string) => {
        //문자열 가져와 잘라 json 반환
        const split = date.split(' ');
        const [calendar, time] = [split[0].split('-'), split[1].split(':')];
        return {year: parseInt(calendar[0]), month: parseInt(calendar[1]), day: parseInt(calendar[2]), hour: parseInt(time[0]), min: parseInt(time[1]), sec: parseInt(time[2])};
    }

    const db = this.connectDatabase();
    for(let i = 0 ; i < groups.length ; i++) {
      if (groups[i] === undefined) continue; //delete된 요소라면 통과

      const groupIdx: number = await this.isExistGroupName(groups[i].GRP_NAME);
      if(groupIdx > 0) { // 그룹이 존재
          for(let j = 0 ; j < services.length ; j++) {
              if (services[j] === undefined) continue; //delete된 요소라면 통과

              const serviceIdx: number = await this.isExistServiceName(services[j].SERVICE_NAME, groupIdx);
              if(serviceIdx > 0) { //서비스 존재
                  for(let k = 0 ; k < accounts.length ; k++) {
                      if (accounts[k] === undefined) continue; //delete된 요소라면 통과

                      const accountIdx: number = await this.isExistAccountName(accounts[k].ACCOUNT_NAME, serviceIdx);
                      if(accountIdx > 0) {
                          // 가져온 데이터가 date최신이면 그 데이터로 계정 업데이트하기
                          const select: any = await this.executeQuery(db,'SELECT DATE FROM ACCOUNTS_TB WHERE IDX = ' + accountIdx,[]); // date꺼내오기
                          const [previousDataSplitDate, newDataSplitDate] = [splitDate(select.rows.item(0).DATE), splitDate(accounts[k].DATE)];
                          const previousDataDate = new Date(previousDataSplitDate.year, previousDataSplitDate.month, previousDataSplitDate.day, previousDataSplitDate.hour, previousDataSplitDate.min, previousDataSplitDate.sec);
                          const newDataDate = new Date(newDataSplitDate.year, newDataSplitDate.month, newDataSplitDate.day, newDataSplitDate.hour, newDataSplitDate.min, newDataSplitDate.sec);
                          
                          if(previousDataDate.getTime() < newDataDate.getTime()) {
                              //새로운 데이터가 더 최신인 경우 업데이트
                              await updateAccountData(accounts[k], accountIdx); 
                          }
                          //oauth계정 검사
                          for(let q = 0 ; q < oauthAccounts.length ; q++) {
                              if (oauthAccounts[q] === undefined) continue; //delete된 요소라면 통과

                              const oauthAccountIdx: number = await this.isExistOauthAccountName(oauthAccounts[q].ACCOUNT_NAME, serviceIdx, accountIdx);
                              if(oauthAccountIdx > 0) {
                                  await updateOauthAccountData(oauthAccounts[q], serviceIdx, accountIdx); //date만 최신으로 업데이트

                                  delete oauthAccounts[q]; // 업데이트된 요소는 다시는 추가 안 되게 undefined 처리
                              }
                          }
                          delete accounts[k]; // 업데이트된 요소는 다시는 추가 안 되게 undefined 처리
                      }
                  }
                  delete services[j]; // 업데이트된 요소는 다시는 추가 안 되게 undefined 처리
              }
          }
          delete groups[i]; // 업데이트된 요소는 다시는 추가 안 되게 undefined 처리
      }
    }
    //중복된 것은 다 업데이트 되었고 아직도 남아있는 그룹, 서비스, 계정, oauth계정 요소들은 검사 없이 새로 추가해야할 데이터임
    const addServiceKeyMap: any = {}; // keyIndex: newDataIndex
    const addAccountKeyMap: any = {};
    for(let i = 0 ; i < groups.length; i++) {
        if(groups[i] === undefined) continue;

        const groupKey = groups[i].IDX;
        const newGroupIdx: any = await addGroupData(groups[i]);
        for(let j = 0 ; j < services.length ; j++) {
            if(services[j] === undefined) continue;

            if(services[j].GRP_IDX === groupKey) {
                const serviceKey = services[j].IDX;
                const newServiceIdx: any = await addServiceData(services[j], newGroupIdx);
                addServiceKeyMap['key' + serviceKey] = newServiceIdx;

                for(let k = 0 ; k < accounts.length ; k++) {
                    if(accounts[k] === undefined) continue;

                    if(accounts[k].SERVICE_IDX === serviceKey) {
                        const accountKey = accounts[k].IDX;
                        const newAccountIdx = await addAccountData(accounts[k], newServiceIdx);
                        addAccountKeyMap['key' + accountKey] = newAccountIdx;

                    }
                }
            }
        }
    }
    ///keyMap 이용해 oauth 계정 추가
    for(let i = 0 ; i < oauthAccounts.length ; i++) {
        if(oauthAccounts[i] === undefined) continue;

        const serviceKey = oauthAccounts[i].SERVICE_IDX;
        const accountKey = oauthAccounts[i].ACCOUNT_IDX;
        await addOauthAccountData(oauthAccounts[i], addServiceKeyMap['key' + serviceKey], addAccountKeyMap['key' + accountKey]);
    }
    //나중엔 업데이트, 추가 모두 위처럼 key value 형태로 알고리즘을 개선하자

  }
}
