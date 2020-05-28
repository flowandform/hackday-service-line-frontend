import React, { memo } from 'react';
import { useRouter } from 'router';
import PropTypes from 'prop-types';

import './ServiceList.scss';

function ServiceList() {
  const router = useRouter();

  return <div>map trough items</div>;
}

ServiceList.propTypes = {};

ServiceList.defaultProps = {};

export default memo(ServiceList);
