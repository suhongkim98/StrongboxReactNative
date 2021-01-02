import React from 'react';
import EditView from '../../components/EditView';
import {EditCode} from '../../modules/enumList';
import {View} from 'react-native';
import StyledText from '../../components/StyledText';
const EditScreen = ({navigation, route}) => {
  const {editType} = route.params;

  const printEdit = () => {
    let editView;
    switch (editType) {
      case EditCode.account:
        editView = (
          <EditView
            onPressBackButton={() => {
              navigation.goBack();
            }}
            onPressApplyButton={() => {}}
            onPressDeleteButton={() => {}}>
            <StyledText>계정편집 란</StyledText>
          </EditView>
        );
        break;
      case EditCode.drawer:
        editView = (
          <EditView
            onPressBackButton={() => {
              navigation.goBack();
            }}
            onPressApplyButton={() => {}}
            onPressDeleteButton={() => {}}>
            <StyledText>drawer편집 란</StyledText>
          </EditView>
        );
        break;
      default:
        editView = (
          <View>
            <StyledText>없음</StyledText>
          </View>
        );
        break;
    }
    return editView;
  };

  return printEdit();
};

export default EditScreen;
