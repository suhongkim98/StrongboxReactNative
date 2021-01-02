import React from 'react';
import EditView from '../../components/EditView';
import StyledText from '../../components/StyledText';
const EditDrawerScreen = ({navigation}) => {
  return (
    <EditView
      isSelected={false}
      onPressBackButton={() => {
        navigation.goBack();
      }}
      onPressDeleteButton={() => {}}>
      <StyledText>drawer편집 란</StyledText>
    </EditView>
  );
};

export default EditDrawerScreen;
