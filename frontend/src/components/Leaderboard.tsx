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
                        <PointsHeader>EXP</PointsHeader>
                    </HeaderRow>
                    {firstColumn.map((entry, index) => (
                        <LeaderboardEntry key={entry.communityId}>
                            <Rank>{index + 1}</Rank>
                            <CommunityInfo>
                                <Logo src={entry.logo} alt="Community Logo"/>
                                <span>
                                    {index === 0 && ' 🥇'}
                                    {index === 1 && ' 🥈'}
                                    {index === 2 && ' 🥉'}
                                </span>
                                <span>
                                    {entry.name}
                                </span>
                            </CommunityInfo>
                            <Points>{entry.totalPoints}</Points>
                        </LeaderboardEntry>
                    ))}
                </LeaderboardColumn>
                <LeaderboardColumn>
                    <HeaderRow>
                    <RankHeader>Rank</RankHeader>
                        <CommunityHeader>Community</CommunityHeader>
                        <PointsHeader>EXP</PointsHeader>
                    </HeaderRow>
                    {secondColumn.map((entry, index) => (
                        <LeaderboardEntry key={entry.communityId}>
                            <Rank>{half + index + 1}</Rank>
                            <CommunityInfo>
                                <Logo src={entry.logo} alt="Community Logo" />
                                <span>{entry.name}</span>
                            </CommunityInfo>
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

const LeaderboardEntry = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #746cd3;
    border-radius: 10px;
    padding: 1rem;
    margin: 0.5rem 0;
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

const PointsHeader = styled.div`
  width: 100px;
  text-align: center;
`;

export default Leaderboard;
