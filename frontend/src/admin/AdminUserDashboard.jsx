import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import Navbar from '../Components/Navbar'
import Loader from '../Components/Loader'
import { PageTitle } from '../Components/PageTitle'
import {
    getAdminUsers,
    updateUserRoleAdmin,
    deleteUserAdmin,
    removeErrors,
    resetAdminUserState,
} from '../features/user/userSlice'

const AdminUserDashboard = () => {
    const dispatch = useDispatch();
    const { adminUsers, adminUsersLoading, error, roleUpdateSuccess, userDeleteSuccess, user: loggedInUser } = useSelector((state) => state.user);

    //Calling getAdminUsers userSlice
    useEffect(() => {
        dispatch(getAdminUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (roleUpdateSuccess) {
            toast.success("User role updated", { position: "top-center", autoClose: 2000 });
            dispatch(resetAdminUserState());
        }
        if (userDeleteSuccess) {
            toast.success("User deleted", { position: "top-center", autoClose: 2000 });
            dispatch(resetAdminUserState());
        }
    }, [error, roleUpdateSuccess, userDeleteSuccess, dispatch]);

    //Calling updateUserRoleAdmin userSlice
    const roleChangeHandler = (id, role) => {
        dispatch(updateUserRoleAdmin({ id, role }));
    };

    //Calling deleteHandler userSlice
    const deleteHandler = (id, name) => {
        if (window.confirm(`Delete user "${name}"? This cannot be undone.`)) {
            dispatch(deleteUserAdmin(id));
        }
    };

    return (
        <>
            <PageTitle title="Quantum Play | Admin - Users" />
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-6xl mx-auto'>
                    <h2 className='text-2xl font-extrabold text-black mb-6'>All Users</h2>

                    {adminUsersLoading ? (
                        <Loader />
                    ) : (
                        <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead className='bg-gray-100 text-gray-600 uppercase text-xs'>
                                    <tr>
                                        <th className='p-3 text-left'>Avatar</th>
                                        <th className='p-3 text-left'>Name</th>
                                        <th className='p-3 text-left'>Email</th>
                                        <th className='p-3 text-left'>Role</th>
                                        <th className='p-3 text-left'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.map((user) => {
                                        const isSelf = user._id === loggedInUser?._id;
                                        return (
                                            <tr key={user._id} className='border-t border-gray-100'>
                                                <td className='p-3'>
                                                    <img src={user.avatar?.url} alt={user.name}
                                                        className='w-10 h-10 rounded-full object-cover border border-gray-200' />
                                                </td>
                                                <td className='p-3 font-semibold text-gray-800'>{user.name}</td>
                                                <td className='p-3 text-gray-600'>{user.email}</td>
                                                <td className='p-3'>
                                                    <select
                                                        value={user.role}
                                                        disabled={isSelf}
                                                        onChange={(e) => roleChangeHandler(user._id, e.target.value)}
                                                        title={isSelf ? "You can't change your own role" : ""}
                                                        className='border border-gray-200 rounded-lg px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed'
                                                    >
                                                        <option value="user">user</option>
                                                        <option value="admin">admin</option>
                                                    </select>
                                                </td>
                                                <td className='p-3'>
                                                    <button
                                                        onClick={() => deleteHandler(user._id, user.name)}
                                                        disabled={isSelf}
                                                        title={isSelf ? "You can't delete your own account" : ""}
                                                        className='text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-red-500'
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {adminUsers.length === 0 && (
                                <div className='text-center py-16 text-gray-500'>No users found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminUserDashboard