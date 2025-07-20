import { LeaderboardTable } from "@/components/leaderboard-table";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function Leaderboard() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  // Mock current user - in a real app this would come from auth context
  const currentUser: User = {
    id: 1,
    username: "junaid",
    email: "junaid@example.com",
    password: "",
    points: 551,
    rank: 12,
    badge: "Urban Guardian",
    createdAt: new Date(),
  };

  // Create the new leaderboard data with the updated rankings
  const updatedUsers: User[] = [
    {
      id: 1,
      username: "rahul_deshmukh",
      email: "rahul.deshmukh@example.com",
      password: "",
      points: 2156,
      rank: 1,
      badge: "Community Hero",
      createdAt: new Date(),
    },
    {
      id: 2,
      username: "amit_mehra",
      email: "amit.mehra@example.com",
      password: "",
      points: 1923,
      rank: 2,
      badge: "Civic Champion",
      createdAt: new Date(),
    },
    {
      id: 3,
      username: "priya_sawant",
      email: "priya.sawant@example.com",
      password: "",
      points: 847,
      rank: 3,
      badge: "Rising Star",
      createdAt: new Date(),
    },
    {
      id: 4,
      username: "siddharth_patil",
      email: "siddharth.patil@example.com",
      password: "",
      points: 756,
      rank: 4,
      badge: "Community Hero",
      createdAt: new Date(),
    },
    {
      id: 5,
      username: "karan_malhotra",
      email: "karan.malhotra@example.com",
      password: "",
      points: 689,
      rank: 5,
      badge: "Civic Champion",
      createdAt: new Date(),
    },
    {
      id: 6,
      username: "sneha_joshi",
      email: "sneha.joshi@example.com",
      password: "",
      points: 612,
      rank: 6,
      badge: "Rising Star",
      createdAt: new Date(),
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            Celebrating our most active civic contributors. Earn points, badges, and recognition for making a difference.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <LeaderboardTable users={updatedUsers} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}
