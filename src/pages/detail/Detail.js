import React from 'react';
import DetailPage from '../../components/layout/DetailPage';

const Detail = (props) => {
  return (
    <DetailPage
      {...props}
      onBackButtonClick={() => props.router.goBack()}
    />
  );
};

export default Detail;
