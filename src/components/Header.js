import { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  Button
 } from 'reactstrap';

class Header extends Component {
render() {
  return(
    <div>
        <Navbar color="dark" light expand="md">
          <NavbarBrand><p className="text-light bg-dark">Library</p></NavbarBrand>
        </Navbar>
      </div>
       )
    }
}

export default Header;