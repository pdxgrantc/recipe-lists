import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

// Firebase
import { auth, signInWithGoogle, signOutUser } from '../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

// static
import { ReactComponent as PersonIcon } from '../../SVG/Person-Icon.svg'
import { ReactComponent as Basket } from '../../SVG/Basket.svg'
import { ReactComponent as Bars } from '../../SVG/Bars.svg'


export default function MobileHeader() {
  const [user] = useAuthState(auth);

  if (user) {
    return (
      <>
        <div className="bg-dark_grey pl-[5vw]">
          <div className="flex justify-between">
            <div className="self-center w-fit">
              <Link to="/" className="text-[2.25rem] font-bold">Ez Shop</Link>
            </div>
            <div className="h-[5%] w-auto my-auto">
              <TopNav icon={<Bars />}>
                <DropdownMenu></DropdownMenu>
              </TopNav>
            </div>
          </div>
        </div>
      </>
    )
  }
  else {

    return (
      <>
        <div className="bg-dark_grey">
          <div className="flex justify-between px-[7vw]">
            <div className="self-center w-fit">
              <Link className="text-[2.25rem] font-bold h-[59px]" to="/">Ez Shop</Link>
            </div>
            <div
              onClick={signInWithGoogle}
              className="flex font-semibold text-[1.75rem] hover:bg-text_grey h-fit py-[0.1rem] my-[0.4rem] px-[.5rem] rounded-[4px] hover:bg-opacity-50 cursor-pointer">
              <h1 className="whitespace-nowrap m-auto">Sign In</h1>
              <PersonIcon className="w-[45px] h-[45px] m-auto"></PersonIcon>
            </div>
          </div>
        </div>
      </>
    )
  }
}

function TopNav(props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Link to="#" className="text-[2.25rem] w-fit" onClick={() => setOpen(!open)}>
        <div className="flex hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] h-min gap-[1vw]">
          <p className="whitespace-nowrap my-auto font-semibold">{props.name}</p>
          <div className='my-[6px] w-[55px] align-middle'>
            {props.icon}
          </div>
        </div>
      </Link>
      {open && props.children}
    </div>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');

  function DropdownItem(props) {
    if (props.route) {
      return (
        <Link to={props.route} className="menu-item hover:bg-text_white hover:bg-opacity-50 font-semibold text-[1.25rem] whitespace-nowrap" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
          <span className="icon-button">{props.leftIcon}</span>
          {props.children}
          <span className="icon-right">{props.rightIcon}</span>
        </Link>
      );
    }
    else {
      return (
        <Link to="#" className="menu-item hover:bg-text_white hover:bg-opacity-50 font-semibold text-[1.25rem] whitespace-nowrap" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
          <span className="icon-button">{props.leftIcon}</span>
          {props.children}
          <span className="icon-right">{props.rightIcon}</span>
        </Link>
      );
    }
  }

  function Home() {
    if (window.location.pathname !== "/") {
        return (
            <DropdownItem
                leftIcon={<Basket />}
                route="/">
                Home
            </DropdownItem>
        )
    }
}

  function MyRecipes() {
    if (window.location.pathname !== "/My-Recipes") {
      return (
        <DropdownItem
          leftIcon={<Basket />}
          route="/My-Recipes">
          My Recipes
        </DropdownItem>
      )
    }
  }

  function ShoppingList() {
    if (window.location.pathname !== "/Shopping-List") {
      return (
        <DropdownItem
          leftIcon={<Basket />}
          route="/Shopping-List">
          Shopping List
        </DropdownItem>
      )
    }
  }

  return (
    <div className="dropdown absolute top-[67px] right-[0px] w-[250px]">
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit>
        <div className="menu">
          <Home></Home>
          <MyRecipes></MyRecipes>
          <ShoppingList></ShoppingList>
          <div onClick={signOutUser}>
            <DropdownItem
              leftIcon={<PersonIcon />}>
              Sign Out
            </DropdownItem>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}



/*

function TopNav(props) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Link to="#" className="text-[2.25rem] w-fit" onClick={() => setOpen(!open)}>
                <div className="flex hover:bg-text_grey hover:bg-opacity-50 transition duration-[300ms] rounded-[4px] px-[1rem] h-min gap-[1vw]">
                    <p className="whitespace-nowrap my-auto font-semibold">{props.name}</p>
                    <div className='my-[6px] w-[55px] align-middle'>
                        {props.icon}
                    </div>
                </div>
            </Link>
            {open && props.children}
        </div>
    );
}

function UserPhoto() {
    const [user] = useAuthState(auth);

    return (
        <div className="m-auto">
            <img className="rounded-[100%] h-[90%] w-[90%] m-auto align-middle" src={user.photoURL} alt={PersonIcon} />
        </div>
    )
}

function DropdownMenu() {
    const [activeMenu, setActiveMenu] = useState('main');

    function DropdownItem(props) {
        if (props.route) {
            return (
                <Link to={props.route} className="menu-item hover:bg-text_white hover:bg-opacity-50 font-semibold text-[1.25rem] whitespace-nowrap" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                    <span className="icon-button">{props.leftIcon}</span>
                    {props.children}
                    <span className="icon-right">{props.rightIcon}</span>
                </Link>
            );
        }
        else {
            return (
                <Link to="#" className="menu-item hover:bg-text_white hover:bg-opacity-50 font-semibold text-[1.25rem] whitespace-nowrap" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                    <span className="icon-button">{props.leftIcon}</span>
                    {props.children}
                    <span className="icon-right">{props.rightIcon}</span>
                </Link>
            );
        }
    }

    function TopLink() {
        if (window.location.pathname !== "/") {
            return (
                <DropdownItem
                    leftIcon={<Basket />}
                    route="/">
                    Home
                </DropdownItem>
            )
        }
    }

    function MyRecipes() {
        if (window.location.pathname !== "/My-Recipes") {
            return (
                <DropdownItem
                    leftIcon={<Basket />}
                    route="/My-Recipes">
                    My Recipes
                </DropdownItem>
            )
        }
    }
    
    function ShoppingList() {
        if (window.location.pathname !== "/Shopping-List") {
            return (
                <DropdownItem
                    leftIcon={<Basket />}
                    route="/Shopping-List">
                    Shopping List
                </DropdownItem>
            )
        }
    }

    return (
        <div className="dropdown absolute top-[80px] right-[3vw]  w-[250px]">
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit>
                <div className="menu">
                    <TopLink></TopLink>
                    <MyRecipes></MyRecipes>
                    <ShoppingList></ShoppingList>
                    <div onClick={signOutUser}>
                        <DropdownItem
                            leftIcon={<PersonIcon />}>
                            Sign Out
                        </DropdownItem>
                    </div>

                </div>
            </CSSTransition>
        </div>
    );
}

*/