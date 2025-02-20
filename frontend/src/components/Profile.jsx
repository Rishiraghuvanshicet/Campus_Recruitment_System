import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-xl'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <Avatar className='w-20 h-20'>
                            <AvatarImage src={user?.profile?.image || '/default-avatar.png'} alt={user?.fullname} />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-2xl'>{user?.fullname}</h1>
                            <p className='text-gray-500'>{user?.profile?.bio || 'No bio available'}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} variant="outline" className="bg-gray-200 hover:bg-gray-300 text-right p-2 rounded-lg">
                        <Pen />
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span className="text-gray-700">{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span className="text-gray-700">{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='text-xl font-semibold'>Skills</h1>
                    <div className='flex items-center gap-2 flex-wrap'>
                        {user?.profile?.skills?.length > 0 ? (
                            user?.profile?.skills.map((skill, index) => <Badge key={index} className="bg-blue-100 text-blue-700">{skill}</Badge>)
                        ) : <span className="text-gray-500">NA</span>}
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='text-xl font-semibold'>Resume</h1>
                    {isResume ? (
                        <a href={user?.profile?.resume} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                            {user?.profile?.resumeOriginalName}
                        </a>
                    ) : (
                        <span className="text-gray-500">NA</span>
                    )}
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-5'>
                <h1 className='font-bold text-2xl my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
