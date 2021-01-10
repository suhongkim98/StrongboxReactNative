//그룹 리스트 상태관리 redux

const UPDATE = 'groupList/UPDATE' as const;
const ADD = 'groupList/ADD' as const;
const DELETE = 'groupList/DELETE' as const;
const DELETE_ARRAY = 'groupList/DELETE_ARRAY' as const;

export const updateGroup = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});
export const addGroup = (item: any) => ({
  type: ADD,
  payload: item,
});
export const deleteGroup = (groupIDX: number) => ({
  type: DELETE,
  payload: groupIDX,
});
export const deleteGroupByIdx = (idx: number[]) => ({
  type: DELETE_ARRAY,
  payload: idx,
});

type groupListAction =
  | ReturnType<typeof updateGroup>
  | ReturnType<typeof addGroup>
  | ReturnType<typeof deleteGroup>
  | ReturnType<typeof deleteGroupByIdx>;

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
    case ADD:
      return {list: [...state.list, action.payload]}; // 새로운 아이템 추가
    case DELETE:
      const newList = state.list.filter((row: any) => {
        return row.GRP_IDX !== action.payload;
      });
      return {list: newList}; // 해당 IDX 삭제
    case DELETE_ARRAY: {
      const deleteList = action.payload;

      for (let i = 0; i < state.list.length; i++) {
        for (let j = 0; j < deleteList.length; j++) {
          if (state.list[i].GRP_IDX === deleteList[j]) {
            delete state.list[i];
            break;
          }
        }
      }
      const after = state.list.filter((row) => {
        return row !== null;
      });
      return {list: after};
    }
    default:
      return state;
  }
};

export default groupList;
