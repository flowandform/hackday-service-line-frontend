import React, { memo } from 'react';
import { useRouter } from 'router';

function Services() {
  const router = useRouter();

  return (
    <div>
      <h1>Services index page</h1>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          router.transitionTo(router.routes.login);
        }}
      >
        Join
      </div>
    </div>
  );
}

Services.propTypes = {};

Services.defaultProps = {};

export default memo(Services);
