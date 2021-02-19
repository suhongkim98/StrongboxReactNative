//그룹 리스트 상태관리 redux
import {StrongboxDatabase} from '../StrongboxDatabase';
import {GroupType} from '../modules/jsonInterface';

const UPDATE = 'groupList/UPDATE' as const;

export const updateGroup = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});

export const updateGroupAsync = () => (dispatch) => {
  const database = StrongboxDatabase.getInstance();

  database
    .getGroup() // group redux 업데이트
    .then((result) => {
      const tmp = [];
      for (let i = 0; i < result.length; i++) {
        const row = result.item(i);
        const group: GroupType = {
          GRP_IDX: row.IDX,
          GRP_NAME: row.GRP_NAME,
          SORT_ORDER: row.SORT_ORDER,
        };
        tmp.push(group);
      }
      dispatch(updateGroup(tmp)); // 업데이트하자~~~~
    })
    .catch((error) => {
      console.log(error);
    });
};
type groupListAction = ReturnType<typeof updateGroup>;

type groupListState = {
  list: any; //
};

const initialState: groupListState = {
  list: [],
};

const groupList = (
  state: groupListState = initialState,
  action: groupListAction,
) => {
  switch (action.type) {
    case UPDATE:
      return {list: action.payload}; // 새로운 배열로 교체
    default:
      return state;
  }
};

export default groupList;
