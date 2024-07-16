import {useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';
import {Community, User} from '../interfaces';
import "./UserCommunityRelationshipManager.css";
import {toast} from 'react-hot-toast';
import Leaderboard from './Leaderboard';

interface MutationData {
    userId: string;
    communityId: string;
}

const UserCommunityRelationshipManager = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

    const {data: users, isLoading: usersLoading} = useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('http://localhost:8080/user').then(res => res.data)
    });

    const {data: communities, isLoading: communitiesLoading} = useQuery({
        queryKey: ['communities'],
        queryFn: () => axios.get('http://localhost:8080/community').then(res => res.data)
    });

    const joinMutation = useMutation({
        mutationFn: (data: MutationData) => axios.post(`http://localhost:8080/user/${data.userId}/join/${data.communityId}`),
        onSuccess: () => {
            if (selectedUser && selectedCommunity) {
                selectedUser.community = selectedCommunity;
                setSelectedUser({ ...selectedUser });
            }
            toast.success('Successfully joined the community');
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });
    const leaveMutation = useMutation({
        mutationFn: (data: MutationData) => axios.delete(`http://localhost:8080/user/${data.userId}/leave`),
        onSuccess: () => {
            if (selectedUser) {
                selectedUser.community = undefined;
                setSelectedUser({ ...selectedUser });
            }
            toast.success('Successfully left the community');
        },
        onError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
        }
    });

    const handleJoinClick = () => {
        if (selectedUser && selectedCommunity) {
            joinMutation.mutate({userId: selectedUser._id, communityId: selectedCommunity._id});
        }
    };

    const handleLeaveClick = () => {
        if (selectedUser && selectedCommunity) {
            leaveMutation.mutate({userId: selectedUser._id, communityId: selectedCommunity._id});
        }
    };

    /**
     * Handles user selection change.
     * @param event - The change event from the user select element.
     */
    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId: string = event.target.value;
        const user: User | undefined = users?.find((user: User) => user._id === userId) || null;
        setSelectedUser(user || null);
        console.log(user);
    };
    /**
     * Handles user selection change.
     * @param event - The change event from the user select element.
     */
    const handleCommunityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const communityId: string = event.target.value;
        const community: Community | undefined = communities?.find((community: Community) => community._id === communityId) || null;
        setSelectedCommunity(community || null);
        console.log(community);
    };


    if (usersLoading || communitiesLoading) return 'Loading...';

    return (
        <div>
            <CenteredWrapper>
                <Leaderboard />
            </CenteredWrapper>
            <CenteredWrapper>
                <UserFrame>
                    {selectedUser ? (
                        <>
                            <ProfilePicture src={selectedUser.profilePicture} alt={selectedUser.email}/>
                            <UserInfo>
                                <h3>User Details</h3>
                                <p>Email: {selectedUser.email}</p>
                                <p>ID: {selectedUser._id}</p>
                                <p>Experience Points: {selectedUser.totalExperience}</p>
                                <p>Community: {selectedUser.community ? selectedUser.community.name : 'No community'}</p>
                            </UserInfo>
                        </>
                    ) : (
                        <p>Select a user to see details</p>
                    )}
                </UserFrame>
            </CenteredWrapper>
            <label>
                User: &nbsp;
                <select onChange={handleUserChange}>
                    <option value="">Select User</option>
                    {users?.map((user: User) => <option key={user._id} value={user._id}>{user.email}</option>)}
                </select>
            </label>

            <CenteredWrapper>
                <CommunityFrame>
                    {selectedCommunity ? (
                        <>
                            <ProfilePicture src={selectedCommunity.logo} alt={selectedCommunity.name}/>
                            <CommunityInfo>
                                <h3>Community Details</h3>
                                <p>Name: {selectedCommunity.name}</p>
                                <p>ID: {selectedCommunity._id}</p>
                            </CommunityInfo>
                        </>
                    ) : (
                        <p>Select a community to see details</p>
                    )}
                </CommunityFrame>
            </CenteredWrapper>

            <label>
                Community: &nbsp;
                <select onChange={handleCommunityChange}>
                    <option value="">Select Community</option>
                    {communities?.map((community: Community) => <option key={community._id}
                                                                        value={community._id}>{community.name}</option>)}
                </select>
            </label>


            <button
                className="join-button"
                onClick={handleJoinClick}
                disabled={!selectedCommunity || selectedUser?.community !== undefined}
            >
                Join
            </button>

            <button
                className="leave-button"
                onClick={handleLeaveClick}
                disabled={selectedUser?.community?._id !== selectedCommunity?._id || !selectedCommunity}
            >
                Leave
            </button>
        </div>
    );
};

// Styled Components

const CenteredWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
`;

const UserFrame = styled.div`
    display: flex;
    align-items: flex-start;
    border: 1px solid #746cd3;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 1rem;
    width: 400px;
    height: 200px;
`;

const CommunityFrame = styled.div`
    display: flex;
    align-items: flex-start;
    border: 1px solid #746cd3;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 1rem;
    width: 400px;
    height: 200px;
`;

const ProfilePicture = styled.img`
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 1rem;
`;

const UserInfo = styled.div`
    flex: 1;
    text-align: left;

    h3 {
        margin-top: 0;
    }
`;
const CommunityInfo = styled.div`
    flex: 1;
    text-align: left;

    h3 {
        margin-top: 0;
    }
`;


export default UserCommunityRelationshipManager;
