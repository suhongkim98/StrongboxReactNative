import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import EditView from '../../components/EditView';
import StyledText from '../../components/StyledText';
import ToggleSwitch from '../../components/ToggleSwitch';
import { RootState } from '../../modules';
import { updateGroupAsync } from '../../modules/groupList';
import { updateServiceAsync } from '../../modules/serviceList';
import { StrongboxDatabase } from '../../StrongboxDatabase';
import theme from '../../styles/theme';

const DraggableItemWrapper = styled.View`
  width: 100%;
  height: 50px;
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.colors.backgroundMainColor};
`;
const ItemView = styled.View`
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const GroupEditView = styled.View`
  margin: 10px 0 20px 0;
`;
const GroupEditViewItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const InputBox = styled.TextInput`
  border-style: solid;
  border-color: gray;
  border-bottom-width: 1px;
  margin: 10px 0 0 0;
  padding: 0 10px 0 10px;

  width: 100%;
`;
const SaveButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
const EditGroupScreen = (props: any) => {
    const { groupIdx, groupName } = props.route.params;
    const [count, setCount] = useState(0);
    const [targetList, setTargetList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const serviceList = useSelector((state: RootState) => state.serviceList.list);
    const dispatch = useDispatch();
    const selectedList = useRef([]);

    const [groupText, setGroupText] = useState('');

    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer: any = useRef<number>(-1);
    const [toastMessage, setToastMessage] = useState('');

    const showToastMessage = (message: string) => {
        // toast 보여주는 함수
        setToastMessage(message);
        setToastVisible(true);
        if (toastTimer.current !== -1) {
            clearTimeout(toastTimer.current);
            toastTimer.current = -1;
        }
        toastTimer.current = setTimeout(() => {
            setToastVisible(false);
        }, 2000);
    };

    useEffect(() => {
        console.log('진입');
        const unsubscribe = props.navigation.addListener('blur', () => {
            //화면 이탈 시 발생 이벤트 초기화하자
            console.log('이탈');
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, props.navigation]);

    useEffect(() => {
        //순서 뽑기
        const tmp = [];
        for (let i = 0; i < serviceList.length; i++) {
            const element = serviceList[i];

            if (element.GRP_IDX === groupIdx) {
                tmp.push(element.SORT_ORDER);
            }
        }
        setOrderList(tmp);
        const list = serviceList.filter((service) => { return service.GRP_IDX === groupIdx; });
        setTargetList(list);
    }, [serviceList]);

    const onPressDeleteService = () => {
        Alert.alert(
            '정말 삭제하시겠습니까?',
            '복구가 불가능합니다.',
            [
                {
                    text: '확인',
                    onPress: onAgreeDelete,
                },
                {
                    text: '취소',
                    onPress: () => { },
                },
            ],
            { cancelable: true },
        );
    };
    const onAgreeDelete = () => {
        const database = StrongboxDatabase.getInstance();
        if (selectedList.current.length > 0) {
            database
                .deleteService(selectedList.current)
                .then(() => {
                    dispatch(updateServiceAsync());
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        props.navigation.goBack();
    }
    const onDragEnd = (newData: any) => {
        const serviceIdx = [];
        for (let i = 0; i < newData.length; i++) {
            serviceIdx.push(newData[i].SERVICE_IDX);
            newData[i].SORT_ORDER = orderList[i];
        }
        setTargetList(newData);
        const database = StrongboxDatabase.getInstance();
        database
            .updateSortOrder('SERVICES_TB', serviceIdx, orderList)
            .then(() => {
                dispatch(updateServiceAsync());
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const changeName = () => {
        if (groupText != null && groupText !== '') {
            const database = StrongboxDatabase.getInstance();
            database.changeGroupName(groupIdx, groupText).then((result) => {
                if (result === true) {
                    showToastMessage("변경 완료");
                    dispatch(updateGroupAsync());
                } else {
                    showToastMessage("이미 존재하는 그룹입니다");
                }
            });
        }
    }
    const renderItem = ({ item, drag }) => {
        return (
            <DraggableItemWrapper>
                <ItemView>
                    <TouchableOpacity onLongPress={drag}>
                        <Icon name="drag-handle" size={20} />
                    </TouchableOpacity>
                    <StyledText>{item.SERVICE_NAME}</StyledText>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('EditServiceScreen', {
                            groupIdx: groupIdx,
                            serviceIdx: item.SERVICE_IDX,
                            serviceName: item.SERVICE_NAME,
                        })
                    }}>
                        <Icon name="edit" size={20} />
                    </TouchableOpacity>
                </ItemView>
                <ToggleSwitch navigation={props.navigation}
                    onTrue={() => {
                        setCount(count + 1);
                        selectedList.current.push(item.SERVICE_IDX);
                    }}
                    onFalse={() => {
                        setCount(count - 1);
                        for (let i = 0; i < selectedList.current.length; i++) {
                            if (i === item.SERVICE_IDX) {
                                selectedList.current.splice(i, 1);
                            }
                        }
                    }} />
            </DraggableItemWrapper>
        );
    };
    return <EditView onPressBackButton={() => { props.navigation.goBack() }} onPressDeleteButton={onPressDeleteService} isSelected={count > 0}>
        <Toast
            visible={toastVisible}
            position={Toast.positions.BOTTOM}
            shadow={true}
            animation={true}
            hideOnPress={true}>
            {toastMessage}
        </Toast>
        <GroupEditView>
            <GroupEditViewItem>
                <StyledText fontWeight="700">그룹 이름 수정</StyledText>
                <SaveButton onPress={() => { changeName(); }}><StyledText>이름 변경</StyledText></SaveButton>
            </GroupEditViewItem>
            <InputBox placeholder={groupName} onChangeText={(text) => setGroupText(text)} />
        </GroupEditView>
        <StyledText fontWeight="700">서비스 리스트</StyledText>
        <DraggableFlatList
            data={targetList}
            renderItem={renderItem}
            onDragEnd={({ data }) => onDragEnd(data)}
            keyExtractor={(item) => `draggable-service-item-${item.SERVICE_IDX}`}
        />
    </EditView>;
};

export default EditGroupScreen;
