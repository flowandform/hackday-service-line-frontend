import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useRouter, generateURL } from 'router';

function RouterLink({ to, params, children }) {
  const router = useRouter();
  return (
    <a
      onClick={e => {
        e.preventDefault();
        router.transitionTo(to, ...params);
      }}
      href={generateURL(to, ...params)}
    >
      {children}
    </a>
  );
}

RouterLink.propTypes = {
  // Object because the shape depends on router
  // eslint-disable-next-line react/forbid-prop-types
  to: PropTypes.object.isRequired,
  params: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

RouterLink.defaultProps = {
  children: '',
  params: [],
};

export default memo(RouterLink);
