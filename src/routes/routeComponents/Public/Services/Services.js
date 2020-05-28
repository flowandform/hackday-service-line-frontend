import React, { memo } from 'react';
import { useRouter } from 'router';

import { ServiceList } from 'components';

function Services() {
  const router = useRouter();

  return <ServiceList />;
}

Services.propTypes = {};

Services.defaultProps = {};

export default memo(Services);
