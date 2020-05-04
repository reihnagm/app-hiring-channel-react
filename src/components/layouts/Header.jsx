import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    InputBase,
    IconButton,
    Menu,
    MenuItem,
    fade,
    makeStyles  } from '@material-ui/core';
import AvatarComponent from '../Avatar/Index';
import SearchIcon from '@material-ui/icons/Search';
import logo from '../../images/logo.png';
import { logout } from '../../actions/auth';
import { getCurrentProfileCompany } from '../../actions/company';
import { getCurrentProfileEngineer } from '../../actions/engineer';
const Header = ({
    engineer,
    company,
    location,
    logout,
    user,
    isAuthenticated,
    getCurrentProfileEngineer,
    getCurrentProfileCompany,
    handleSearchEngineer,
    handleSearchCompany,
    querySearchEngineer,
    querySearchCompany
    }) => {
        const logout_user = () => {
            logout();
            handleMenuClose();
        }
        const useStyles = makeStyles(theme => ({
            grow: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            large: {
                width: theme.spacing(4),
                height: theme.spacing(4)
            },
            title: {
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                    display: 'block',
                },
            },
            search: {
                position: 'relative',
                borderRadius: theme.shape.borderRadius,
                backgroundColor: fade(theme.palette.common.white, 0.15),
                '&:hover': {
                    backgroundColor: fade(theme.palette.common.white, 0.25),
                },
                marginRight: theme.spacing(2),
                marginLeft: 0,
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                    marginLeft: theme.spacing(3),
                    width: 'auto',
                },
            },
            searchIcon: {
                width: theme.spacing(7),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            inputRoot: {
                color: 'inherit',
            },
            inputInput: {
                padding: theme.spacing(1, 1, 1, 7),
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                    width: 200,
                },
            },
            sectionDesktop: {
                display: 'none',
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                },
            },
            sectionMobile: {
                display: 'flex',
                [theme.breakpoints.up('md')]: {
                    display: 'none',
                },
            },
        }));
        const user_role_id = user && user.data && user.data.role_id;
        const classes = useStyles();
        const [anchorEl, setAnchorEl] = useState(null);
        const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
        const menuId = 'primary-search-account-menu';
        const isMenuOpen = Boolean(anchorEl);
        const handleProfileMenuOpen = event => {
             setAnchorEl(event.currentTarget);
        };
        const handleMenuClose = () => {
            setAnchorEl(null);
        };
        const renderMenu = (
            <Menu
                keepMounted
                elevation={1}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                anchorEl={anchorEl}
                id={menuId}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                { user_role_id === 1 &&
                    <div>
                        <MenuItem className="text-black" component={ Link } to="/engineer/profile">Profile</MenuItem>
                        <MenuItem  className="text-black" component={ Link } to="/engineer/profile/me/edit">Edit Profile</MenuItem>
                    </div>
                }
                { user_role_id === 2 &&
                    <div>
                        <MenuItem className="text-black" component={ Link } to="/company/profile">Profile</MenuItem>
                        <MenuItem className="text-black" component={ Link } to="/company/profile/me/edit">Edit Profile</MenuItem>
                    </div>
                }
                <MenuItem onClick={logout_user}>Logout</MenuItem>
            </Menu>
        );
        useEffect(() => {
            const fetchData = async () => {
                if(typeof user_role_id === "undefined") {
                    return false;
                } else {
                    if(user_role_id === 1) {
                        await getCurrentProfileEngineer();
                    }
                    if(user_role_id === 2) {
                        await getCurrentProfileCompany();
                    }
                }
            }
            fetchData();
        },[getCurrentProfileEngineer, getCurrentProfileCompany, user_role_id]);
        const authLinks = (
            <div className={classes.grow}>
                <AppBar elevation={1} color="transparent" position="static">
                    <Toolbar>
                        <div className={classes.grow}>
                            <img className="logo" src={logo} alt={logo} />
                        </div>
                        { location.pathname === "/engineers" &&
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search Name or Skills Here..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    onChange={event => handleSearchEngineer(event.target.value)}
                                />
                            </div>
                        }
                        { location.pathname === "/companies" &&
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search Name or Location Here..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    onChange={event => handleSearchCompany(event.target.value)}
                                />
                            </div>
                        }
                        <div className={classes.grow}>
                            <Link className="text-black mx-3" to="/">Home</Link>
                            <Link className="text-black mx-3" to="/engineers">Engineers</Link>
                            <Link className="text-black mx-3" to="/companies">Companies</Link>
                        </div>
                        <div className={classes.grow}>
                            { user_role_id === 1 &&
                                <span className="mx-3 cursor-pointer" onClick={handleProfileMenuOpen}>
                                    { engineer && engineer.data && engineer.data.name }
                                </span>
                            }
                            { user_role_id === 2 &&
                                <span className="mx-3 cursor-pointer" onClick={handleProfileMenuOpen}>
                                    { company && company.data && company.data.name }
                                </span>
                            }
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                color="inherit"
                                aria-controls={menuId}
                                onClick={handleProfileMenuOpen}
                            >
                                { user_role_id  === 1 &&
                                    <AvatarComponent 
                                        imageSource={engineer && engineer.data && engineer.data.avatar} 
                                        altName={engineer && engineer.data && engineer.data.name}
                                        type="avatar" 
                                        width="30"
                                        height="30"
                                    />
                                }
                                { user_role_id === 2 &&
                                    <AvatarComponent 
                                        imageSource={company && company.data && company.data.logo} 
                                        altName={company && company.data && company.data.name}
                                        type="logo" 
                                        width="30"
                                        height="30"
                                    />
                                }
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                {renderMenu}
            </div>
        )
        const guestLinks = (
            <div className={classes.grow}>
                <AppBar elevation={1} color="transparent" position="static">
                    <Toolbar>
                        <div className={classes.grow}>
                            <img className="logo" src={logo} alt={logo} />
                        </div>
                        { location.pathname === "/engineers" &&
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search Name or Skills Here..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    onChange={event => handleSearchEngineer(event.target.value)}
                                />
                            </div>
                        }
                        { location.pathname === "/companies" &&
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search Name or Location Here..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    onChange={event => handleSearchCompany(event.target.value)}
                                />
                            </div>
                        }
                        <div className={classes.grow}>
                          <Link className="text-black mx-3" to="/">Home</Link>
                          <Link className="text-black mx-3" to="/engineers">Engineers</Link>
                          <Link className="text-black mx-3" to="/companies">Companies</Link>
                          <Link className="text-black mx-3" to="/login">Login</Link>
                          <Link className="text-black mx-3" to="/register">Register</Link>
                        </div>
                    </Toolbar>
                </AppBar>
                {renderMenu}
            </div>
        )
        return (
          <Fragment>
            { isAuthenticated ? authLinks : guestLinks }
          </Fragment>
        )
    }
const mapStateToProps = state => ({
  engineer: state.engineer.engineer,
  company: state.company.company,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  { getCurrentProfileEngineer, getCurrentProfileCompany, logout }
)(withRouter(Header))
