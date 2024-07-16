import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

interface LeaderboardEntry {
    communityId: string;
    totalPoints: number;
    logo: string;
    userCount: number;
    name: string;
}

const Leaderboard = () => {
    const { data: leaderboard, isLoading, error } = useQuery<LeaderboardEntry[]>({
        queryKey: ['leaderboard'],
        queryFn: () => axios.get('http://localhost:8080/community/leaderboard').then(res => res.data)
    });

    if (isLoading) return <p>Loading leaderboard...</p>;
    if (error) return <p>Error loading leaderboard</p>;

    const half = Math.ceil((leaderboard?.length || 0) / 2);
    const firstColumn = leaderboard?.slice(0, half) || [];
    const secondColumn = leaderboard?.slice(half) || [];

    return (
        <LeaderboardWrapper>
            <h2>Top Community Leaderboard</h2>
            <LeaderboardContainer>
                <LeaderboardColumn>
                    <HeaderRow>
                        <RankHeader>Rank</RankHeader>
                        <CommunityHeader>Community</CommunityHeader>
                        <MemberHeader>Members</MemberHeader>
                        <PointsHeader>EXP</PointsHeader>
                    </HeaderRow>
                    {firstColumn.map((entry, index) => (
                        <LeaderboardEntry key={entry.communityId} isEven={index % 2 === 0}>
                            <Rank>{index + 1}</Rank>
                            <CommunityInfo>
                                <Logo src={entry.logo} alt="Community Logo"/>
                                <span>
                                    {entry.name}
                                </span>
                                <span>
                                    {index === 0 && <Emoji>🥇</Emoji>}
                                    {index === 1 && <Emoji>🥈</Emoji>}
                                    {index === 2 && <Emoji>🥉</Emoji>}
                                </span>
                            </CommunityInfo>
                            <Points>{entry.userCount}</Points>
                            <Points>{entry.totalPoints}</Points>
                        </LeaderboardEntry>
                    ))}
                </LeaderboardColumn>
                <LeaderboardColumn>
                    <HeaderRow>
                    <RankHeader>Rank</RankHeader>
                        <CommunityHeader>Community</CommunityHeader>
                        <MemberHeader>Members</MemberHeader>
                        <PointsHeader>EXP</PointsHeader>
                    </HeaderRow>
                    {secondColumn.map((entry, index) => (
                        <LeaderboardEntry key={entry.communityId} isEven={index % 2 === 0}>
                            <Rank>{half + index + 1}</Rank>
                            <CommunityInfo>
                                <Logo src={entry.logo} alt="Community Logo" />
                                <span>{entry.name}</span>
                            </CommunityInfo>
                            <Points>{entry.userCount}</Points>
                            <Points>{entry.totalPoints}</Points>
                        </LeaderboardEntry>
                    ))}
                </LeaderboardColumn>
            </LeaderboardContainer>
        </LeaderboardWrapper>
    );
};

// Styled Components for Leaderboard
const LeaderboardWrapper = styled.div`
    text-align: center;
    margin: 2rem 0;
`;

const LeaderboardContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
`;

const LeaderboardColumn = styled.div`
    flex: 1;
    width: 500px;
`;

const LeaderboardEntry = styled.div<{ isEven: boolean }>`
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: ${({ isEven }) => (isEven ? '#000000' : '#242424')};
`;

const Rank = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    width: 50px;
    text-align: center;
`;

const CommunityInfo = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`;

const Logo = styled.img`
    border-radius: 10px;
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 1rem;
`;

const Points = styled.div`
    font-size: 1rem;
    font-weight: bold;
    width: 100px;
    text-align: center;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 2px solid #ddd;
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
    font-weight: bold;
`;

const RankHeader = styled.div`
    width: 50px;
    text-align: center;
`;

const CommunityHeader = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MemberHeader = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PointsHeader = styled.div`
  width: 100px;
  text-align: center;
`;

const Emoji = styled.span`
  font-size: 1.5rem;
  margin-left: 0.5rem;
`;

export default Leaderboard;
