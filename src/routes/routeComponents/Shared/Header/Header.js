import React, { memo } from 'react';

import './Header.scss';

function Header() {
  return <header className="page-container">Header</header>;
}

Header.propTypes = {};

Header.defaultProps = {};

export default memo(Header);
