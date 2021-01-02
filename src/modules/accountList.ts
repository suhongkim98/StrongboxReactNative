//계정리스트 상태관리 redux

const UPDATE = 'accountList/UPDATE' as const;
const ADD = 'accountList/ADD' as const;
const DELETE = 'accountList/DELETE' as const;
const UPDATE_ACCOUNT = 'accountList/UPDATE_ACCOUNT' as const;

export const updateAccount = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});
export const addAccount = (item: any) => ({
  type: ADD,
  payload: item,
});
export const deleteAccount = (item: any) => ({
  type: DELETE,
  payload: item,
});
export const updateAccountByIdx = (itemList: any) => ({
  type: UPDATE_ACCOUNT,
  payload: itemList,
});

type accountListAction =
  | ReturnType<typeof updateAccount>
  | ReturnType<typeof addAccount>
  | ReturnType<typeof deleteAccount>
  | ReturnType<typeof updateAccountByIdx>;

type accountListState = {
  list: any;
};

const initialState: accountListState = {
  list: [],
};

const accountList = (
  state: accountListState = initialState,
  action: accountListAction,
) => {
  switch (action.type) {
    case UPDATE:
      return {list: action.payload}; // 새로운 배열로 교체

    case ADD:
      return {list: [...state.list, action.payload]}; // 새로운 아이템 추가

    case DELETE:
      const newList = state.list.filter((row: any) => {
        return row.ACCOUNT_IDX !== action.payload;
      });
      return {list: newList};

    case UPDATE_ACCOUNT:
      //배열 삭제 후 다시 추가하는 방법으로 업데이트
      const [before, target] = [state.list, action.payload];

      for (let i = 0; i < before.length; i++) {
        for (let j = 0; j < target.length; j++) {
          if (before[i].ACCOUNT_IDX === target[j].ACCOUNT_IDX) {
            delete before[i];
            break;
          }
        }
      }
      const after = before.filter((row) => {
        return row !== null;
      });
      return {list: [...after, ...action.payload]};
    default:
      return state;
  }
};

export default accountList;
