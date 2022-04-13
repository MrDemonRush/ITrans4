import React, { useContext, useEffect, useState } from "react";
import 'react-bootstrap';
import useHttp from "../Hooks/httpHook";
import { Context } from "../context/Context";

const columns = ["Name", "ID", "Email", "Banned", "Registration Date", "Last Login Date"]

export default function Table() {

    const { request } = useHttp()

    const [inBan, setBan] = useState(false)
    const [checked, setCheck] = useState(false)
    const auth = useContext(Context)

    let [users, setUsers] = useState([])


    useEffect(() => {

        if (!inBan) {
            try {

                const getData = async () => {
                    try {
                        const data = await request('/api/auth/getDbData', 'GET')

                        setUsers(data)
                        return data
                    } catch (error) {
                        console.log(error)
                    }
                }

                const data = getData()

                return data
            }
            catch (e) {
                console.log(e.message)
            }
        } else {
            auth.logout()
        }
    }, [])


    const changeBox = (User) => {

        if (!inBan) {
            setUsers(users.map(user => {
                if (user == User) {
                    user.isSelected = !(user.isSelected)
                }
                return user
            }))
        } else {
            auth.logout()
        }
    }

    const lockUser = async (email, type) => {

        let url
        if (type) {
            url = '/api/auth/update/' + email + '/ban'
        } else {
            url = '/api/auth/update/' + email + '/unban'
        }
        await request(url, 'PUT')
    }

    const unBanUsers = () => {


        if (!inBan) {

            setUsers(users.map(user => {

                if (user) {
                    if (user.isSelected) {
                        user.isBanned = false;
                        lockUser(user.email, false).then(response => console.log('The user is unblocked'))
                    }
                    return user
                }
            }))
        } else {
            auth.logout()
        }
    }

    const banUsers = () => {

        if (!inBan) {

            setUsers(users.map(user => {

                if (user) {
                    if (user.isSelected) {
                        if (user._id == auth.userId) {
                            console.log('ban yourself')
                            auth.logout()
                        }

                        user.isBanned = true;
                        lockUser(user.email, true).then(response => console.log('The user is blocked'))
                    }
                    return user
                }
            }))
        } else {
            auth.logout()
        }
    }

    const delUser = async (email) => {

        const url = '/api/auth/delete/' + email
        const data = await request(url, 'DELETE')
        return data
    }

    const DeleteUsers = () => {

        if (!inBan) {

            setUsers(users.map(user => {
                if (user) {
                    if (user.isSelected) {
                        delUser(user.email)
                        if (user._id == auth.userId) {
                            auth.logout()
                        }
                    } else {
                        return user
                    }
                }
            }))
        } else {
            auth.logout()
        }
    }

    const selectAll = () => {

        if (!inBan) {
            setCheck(!checked)
            setUsers(users.map(user => {
                if (user && !checked) {
                    user.isSelected = true
                } else if (user && checked) {
                    user.isSelected = false
                }
                return user
            }))
        } else {
            auth.logout()
        }
    }

    return (
        <>
            <div className="bg-dark" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <button className="btn btn-primary" onClick={() => auth.login()}>SignOut</button>
            </div>
            <div className="container">
                <div className="d-flex mt-5  justify-content-start">
                    <div >
                        <button className="btn btn-danger " onClick={() => DeleteUsers()}>Delete</button>
                        <button className="btn btn-warning" onClick={() => banUsers()}>Block</button>
                        <button className="btn btn-success" onClick={() => unBanUsers()}>Unblock</button>
                    </div>
                </div>
                <div className="table-responsive ">
                    <table className="table table-bordered table-hover ">
                        <thead className="bg-white">
                            <tr style={{ textAlign: 'center' }}>
                                <th>
                                    <input type="checkbox" checked={checked} onChange={() => selectAll()} />
                                </th>
                                {
                                    columns.map(column => <th >{column}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {users.map((user) => {
                                if (user) {
                                    return (
                                        <tr style={{ textAlign: 'center' }}>
                                            <td>
                                                <input type="checkbox" checked={user.isSelected} onChange={() => changeBox(user)} />
                                            </td>
                                            <td>
                                                {user.name}
                                            </td>
                                            <td>
                                                {user._id}
                                            </td>
                                            <td>
                                                {user.email}
                                            </td>
                                            {
                                                user.isBanned ? <td className="bg-warning">true</td> : <td >false</td>
                                            }
                                            <td>
                                                {user.registrationDate}
                                            </td>
                                            <td>
                                                {user.lastLoginDate}
                                            </td>
                                        </tr>
                                    )
                                } else {
                                    return null
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    )
}
