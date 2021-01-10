//drawer편집 redux임 선택카운트, 선택그룹리스트, 선택서비스리스트 관리
const PUSH_GROUP = 'editDrawerRedux/PUSH_GROUP' as const;
const POP_GROUP = 'editDrawerRedux/POP_GROUP' as const;
const PUSH_SERVICE = 'editDrawerRedux/PUSH_SERVICE' as const;
const POP_SERVICE = 'editDrawerRedux/POP_SERVICE' as const;
const INIT = 'editDrawerRedux/INIT' as const;

export const pushGroup = (idx: number) => ({
  type: PUSH_GROUP,
  payload: idx,
});
export const popGroup = (idx: number) => ({
  type: POP_GROUP,
  payload: idx,
});
export const pushService = (idx: number) => ({
  type: PUSH_SERVICE,
  payload: idx,
});
export const popService = (idx: number) => ({
  type: POP_SERVICE,
  payload: idx,
});
export const initRedux = () => ({type: INIT});

type EditDrawerReduxAction =
  | ReturnType<typeof pushGroup>
  | ReturnType<typeof popGroup>
  | ReturnType<typeof pushService>
  | ReturnType<typeof popService>
  | ReturnType<typeof initRedux>;

type EditDrawerReduxState = {
  count: number;
  selectedGroup: object;
  selectedService: object;
};

const initialState: EditDrawerReduxState = {
  count: 0,
  selectedGroup: [],
  selectedService: [],
};

function counter(
  state: EditDrawerReduxState = initialState,
  action: EditDrawerReduxAction,
) {
  switch (action.type) {
    case PUSH_GROUP:
      return {
        selectedGroup: [...state.selectedGroup, action.payload],
        count: state.count + 1,
      };
    case POP_GROUP:
      const groupNewList = state.selectedGroup.filter((idx) => {
        return idx !== action.payload;
      });
      return {selectedGroup: groupNewList, count: state.count - 1};
    case PUSH_SERVICE:
      return {
        selectedService: [...state.selectedService, action.payload],
        count: state.count + 1,
      };
    case POP_SERVICE:
      const serviceNewList = state.selectedService.filter((idx) => {
        return idx !== action.payload;
      });
      return {selectedService: serviceNewList, count: state.count - 1};
    case INIT:
      return {selectedService: [], selectedGroup: [], count: 0};
    default:
      return state;
  }
}

export default counter;
