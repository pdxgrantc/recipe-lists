import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

// Firebase
import { auth, signInWithGoogle, signOutUser } from '../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

// static
import { ReactComponent as PersonIcon } from '../../SVG/Person-Icon.svg'
import { ReactComponent as Basket } from '../../SVG/Basket.svg'

export default function DesktopHeader() {
    const [user] = useAuthState(auth);

    if (user) {
        return (
            <>
                <div className="bg-dark_grey w-[100%] h-[80px]">
                    <div className="h-[100%] flex justify-between pr-[3vw]">
                        <Link to="/">
                            <div className='flex gap-7 h-[100%] w-[28rem] bg-black pl-[2vw]'>
                            <Basket className='h-[4.5rem] my-auto'></Basket>
                                <h1 className="align-middle text-[3.25rem] font-bold cursor-pointer" to="/">Home</h1>
                            </div>
                        </Link>
                        <div className="my-auto flex justify-around">
                            <TopNav icon={<UserPhoto />} name={user.displayName}>
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
            <div className="bg-dark_grey w-[100%] h-80px">
                <div className="h-[100%] flex justify-between pr-[3vw]">
                    <Link to="/">
                        <div className='flex gap-7 h-[100%] w-[25vw] bg-black pl-[2vw]'>
                            <Basket className='h-[4.5rem] my-auto'></Basket>
                            <h1 className="align-middle text-[3.25rem] font-bold cursor-pointer" to="/">Sign In</h1>
                        </div>
                    </Link>
                    <div
                        onClick={signInWithGoogle}
                        className="flex font-semibold text-[1.75rem] hover:bg-text_grey h-fit my-auto py-[0.1rem] px-[.5rem] rounded-[4px] hover:bg-opacity-50 cursor-pointer">
                        <h1 className="whitespace-nowrap m-auto">Sign In</h1>
                        <PersonIcon className="w-[45px] h-[45px] m-auto"></PersonIcon>
                    </div>
                </div>
            </div>
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
        if (window.location.pathname === "/") {
            return (
                <DropdownItem
                    leftIcon={<Basket />}
                    route="/Ingredients">
                    Lists
                </DropdownItem>
            )
        }
        else {
            return (
                <DropdownItem
                    leftIcon={<Basket />}
                    route="/">
                    Home
                </DropdownItem>
            )
        }
    }

    return (
        <div className="dropdown translate-x-[26%] top-[80px] w-[250px]">
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit>
                <div className="menu">
                    <TopLink></TopLink>
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
