import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import defaultImage from '../../images/default.png';
import logo from '../../images/logo.png';
import { logout } from '../../actions/auth';
import { getCurrentProfileCompany } from '../../actions/company';
import { getCurrentProfileEngineer,  getSkillsBasedOnProfileEngineer} from '../../actions/engineer';
const Header = ({
        engineer,
        skills_engineer,
        company,
        location,
        getCurrentProfileEngineer,
        getSkillsBasedOnProfileEngineer,
        getCurrentProfileCompany,
        logout,
        handleSearchEngineer,
        handleSearchCompany,
        searchEngineer,
        searchCompany,
        isAuthenticated,
        user
    }) => {
        const [visible, setVisible] = useState(false);
        let name_engineer = engineer && engineer.data && engineer.data.name;
        let avatar_engineer = engineer && engineer.data && engineer.data.avatar;
        let name_company = company && company.data && company.data.name;
        let logo_company = company && company.data && company.data.logo;
        useEffect(() => {
            const fetchData = async () => {
                await getCurrentProfileEngineer();
                await getCurrentProfileCompany();
            }
            fetchData();
        },[getCurrentProfileEngineer, getCurrentProfileCompany, name_engineer, name_company, avatar_engineer, logo_company]);
        const dropdownBtn = () => {
            setVisible(!visible)
        }
        let engineer_imageSource = avatar_engineer ? `http://localhost:5000/images/engineer/${avatar_engineer}`: defaultImage;
        let company_imageSource = logo_company ? `http://localhost:5000/images/company/${logo_company}`: defaultImage;
        let check_role_id = user && user.data && user.data.role_id;
        const CompaniesMenu = (
            <Fragment>
                <span className='mx-10'>  <img className='is-avatar' src={company_imageSource} alt={name_company} /> </span>
                <span className='text-black text-black mx-10 cursor-pointer' onClick={(e) => dropdownBtn(e)}>{ name_company }</span>
                { visible &&
                    <ul id="dropdown-header">
                        <li><Link to={`companies`}>Companies</Link></li>
                        <li><Link to={`engineers`}>Engineers</Link></li>
                        <li><Link to={`company/profile`}>Profile</Link></li>
                        <li><Link to={`company/profile/me/edit`}>Edit Profile</Link></li>
                        <li><span className='text-black cursor-pointer ml-5' onClick={logout}>Logout</span></li>
                    </ul>
                }
            </Fragment>
        )
        const EngineersMenu = (
            <Fragment>
                <span className='mx-10'> <img className='is-avatar' src={engineer_imageSource} alt={name_engineer} /> </span>
                <span className='mx-10 text-black cursor-pointer' onClick={(e) => dropdownBtn(e)}>  { name_engineer } </span>
                { visible &&
                    <ul id='dropdown-header'>
                        <li><Link to={`companies`}>Companies</Link></li>
                        <li><Link to={`engineers`}>Engineers</Link></li>
                        <li><Link to={`engineer/profile`}>Profile</Link></li>
                        <li><Link to={`engineer/profile/me/edit`}>Edit Profile</Link></li>
                        <li><span className='text-black cursor-pointer ml-5' onClick={logout}>Logout</span></li>
                    </ul>
                }
            </Fragment>
        )
        const authLinks = (
            <header className='navbar is-shadow'>
                <img src={logo} alt="Logo" />
                { location.pathname === "/" &&
                    <div className='column is-half'></div>
                }
                { location.pathname !== "/" &&
                    <Fragment>
                         { location.pathname === "/engineers" &&
                            <div className='column is-half'>
                                <div className='field'>
                                    <input
                                        onChange={e => handleSearchEngineer(e)}
                                        value={searchEngineer}
                                        id='search-header'
                                        placeholder='Search by Skill and Name here...'
                                        name='search'
                                        type='text'
                                    />
                                </div>
                            </div>
                        }
                        { location.pathname === "/companies" &&
                            <div className='column is-half'>
                                <div className='field'>
                                    <input
                                        onChange={e => handleSearchCompany(e)}
                                        value={searchCompany}
                                        id='search-header'
                                        placeholder='Search by Name and Location here...'
                                        name='search'
                                        type='text'
                                    />
                                </div>
                            </div>
                        }
                    </Fragment>
                }
                <ul className='is-relative'>
                    <li className='is-flex is-items-center'>
                        <span className='mx-10'> <Link className='text-black' to='/'>Home</Link> </span>
                        { check_role_id === 2 ? CompaniesMenu : EngineersMenu }
                    </li>
                </ul>
            </header>
        )
        const guestLinks = (
            <header className='navbar is-shadow'>
                <img src={logo} alt='Logo' />
                { location.pathname === "/" &&
                    <div className='column is-half'></div>
                }
                { location.pathname !== "/" &&
                    <Fragment>
                         { location.pathname === "/engineers" &&
                            <div className='column is-half'>
                                <div className='field'>
                                    <input
                                        onChange={e => handleSearchEngineer(e)}
                                        value={searchEngineer}
                                        id='search-header'
                                        placeholder='Search by Skill and Name here...'
                                        name='search'
                                        type='text'
                                    />
                                </div>
                            </div>
                        }
                        { location.pathname === "/companies" &&
                            <div className='column is-half'>
                                <div className='field'>
                                    <input
                                        onChange={e => handleSearchCompany(e)}
                                        value={searchCompany}
                                        id='search-header'
                                        placeholder='Search by Name and Location here...'
                                        name='search'
                                        type='text'
                                    />
                                </div>
                            </div>
                        }
                    </Fragment>
                }
                <ul className='is-relative'>
                    <li className='is-flex is-items-center'>
                        <span className='mx-10'> <Link className='text-black'to='/'>Home</Link> </span>
                        <span className='mx-10'> <Link className='text-black'to='/companies'>Companies</Link> </span>
                        <span className='mx-10'> <Link className='text-black'to='/engineers'>Engineers</Link> </span>
                        <span className='mx-10 text-black cursor-pointer' onClick={(e) => dropdownBtn(e)}> Guest </span>
                    </li>
                    { visible &&
                        <ul id="dropdown-header">
                            <li><Link to={`login`}>Login</Link></li>
                            <li><Link to={`register`}>Register</Link></li>
                        </ul>
                    }
                </ul>
            </header>
        )
        return (
            <Fragment>
                { isAuthenticated ? authLinks : guestLinks }
            </Fragment>
        )
    }
const mapStateToProps = state => ({
    engineer: state.engineer.engineer,
    skills_engineer: state.engineer.skills_engineer,
    company: state.company.company,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});
export default connect(
    mapStateToProps,
    { getCurrentProfileEngineer, getCurrentProfileCompany, getSkillsBasedOnProfileEngineer, logout }
)(withRouter(Header))
