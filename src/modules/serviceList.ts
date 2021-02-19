//그룹 리스트 상태관리 redux
import {StrongboxDatabase} from '../StrongboxDatabase';
import {ServiceType} from '../modules/jsonInterface';

const UPDATE = 'serviceList/UPDATE' as const;

export const updateService = (newList: any) => ({
  type: UPDATE,
  payload: newList,
});

export const updateServiceAsync = () => (dispatch) => {
  const database = StrongboxDatabase.getInstance();

  database
    .getService()
    .then((result) => {
      const tmp = [];
      for (let i = 0; i < result.length; i++) {
        const row = result.item(i);
        const service: ServiceType = {
          GRP_IDX: row.GRP_IDX,
          SERVICE_IDX: row.IDX,
          SERVICE_NAME: row.SERVICE_NAME,
          SORT_ORDER: row.SORT_ORDER,
        };
        tmp.push(service);
      }
      dispatch(updateService(tmp)); // 서비스 리스트 업데이트하자~~~~
    })
    .catch((error) => {
      console.log(error);
    });
};
type serviceListAction = ReturnType<typeof updateService>;

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
    default:
      return state;
  }
};

export default serviceList;
