//계정리스트 상태관리 redux

const UPDATE = 'accountList/UPDATE' as const;

export const updateAccount = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});

type accountListAction = ReturnType<typeof updateAccount>;

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
    default:
      return state;
  }
};

export default accountList;
