//그룹 리스트 상태관리 redux

const UPDATE = 'serviceList/UPDATE' as const;
const ADD = 'serviceList/ADD' as const;
const DELETE = 'serviceList/DELETE' as const;
const UPDATE_SERVICE = 'serviceList/UPDATE_SERVICE' as const;

export const updateService = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});
export const addService = (item: any) => ({
  type: ADD,
  payload: item,
});
export const deleteService = (item: any) => ({
  type: DELETE,
  payload: item,
});
export const updateServiceByIdx = (itemList: any) => ({
  type: UPDATE_SERVICE,
  payload: itemList,
});

type serviceListAction =
  | ReturnType<typeof updateService>
  | ReturnType<typeof addService>
  | ReturnType<typeof deleteService>
  | ReturnType<typeof updateServiceByIdx>;

type serviceListState = {
  list: any;
};

const initialState: serviceListState = {
  list: [],
};

const serviceList = (
  state: serviceListState = initialState,
  action: serviceListAction,
) => {
  switch (action.type) {
    case UPDATE:
      return {list: action.payload}; // 새로운 배열로 교체
    case ADD:
      return {list: [...state.list, action.payload]}; // 새로운 아이템 추가
    case DELETE:
      const newList = state.list.filter((row: any) => {
        return row.SERVICE_IDX !== action.payload;
      });
      return {list: newList};
    case UPDATE_SERVICE:
      //배열 삭제 후 다시 추가하는 방법으로 업데이트
      const [before, target] = [state.list, action.payload];

      for (let i = 0; i < before.length; i++) {
        for (let j = 0; j < target.length; j++) {
          if (before[i].SERVICE_IDX === target[j].SERVICE_IDX) {
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

export default serviceList;
