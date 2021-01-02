import React from 'react';
import EditView from '../../components/EditView';
import StyledText from '../../components/StyledText';
const EditAccountScreen = ({navigation}) => {
  return (
    <EditView
      onPressBackButton={() => {
        navigation.goBack();
      }}
      onPressApplyButton={() => {}}
      onPressDeleteButton={() => {}}>
      <StyledText>계정편집 란</StyledText>
    </EditView>
  );
};

export default EditAccountScreen;
