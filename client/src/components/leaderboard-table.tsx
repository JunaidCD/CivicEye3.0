import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Zap, Shield, Star, Lock } from "lucide-react";
import { User } from "@shared/schema";

interface LeaderboardTableProps {
  users: User[];
  currentUser?: User;
}

export function LeaderboardTable({ users, currentUser }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-medium">{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Urban Guardian":
        return "bg-yellow-500";
      case "Community Hero":
        return "bg-blue-500";
      case "Civic Champion":
        return "bg-purple-500";
      case "Rising Star":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getInitials = (username: string) => {
    return username.split('_').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };

  // Function to get report count for each user
  const getReportCount = (username: string) => {
    const reportCounts: { [key: string]: number } = {
      "sarah_martinez": 43,
      "emily_chen": 38,
      "alex_morgan": 36,
      "michael_brown": 32,
      "lisa_wang": 28,
      "david_kim": 25,
      "junaid": 16,
    };
    return reportCounts[username] || Math.floor((users.find(u => u.username === username)?.points || 0) / 50);
  };

  const achievements = [
    { name: "First Report", icon: Award, earned: true, color: "bg-secondary" },
    { name: "Quick Reporter", icon: Zap, earned: true, color: "bg-yellow-500" },
    { name: "Urban Guardian", icon: Shield, earned: false, color: "bg-gray-300" },
    { name: "Top Contributor", icon: Star, earned: false, color: "bg-gray-300" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Leaderboard */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              Top Contributors This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 3).map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700' :
                    index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-gray-200 dark:border-gray-600' :
                    'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold capitalize">{user.username.replace('_', ' ')}</h4>
                        <p className="text-sm text-muted-foreground">{user.badge}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{user.points?.toLocaleString()} pts</div>
                    <div className="text-sm text-muted-foreground">
                      {getReportCount(user.username)} reports
                    </div>
                  </div>
                </div>
              ))}

              {/* Other ranks */}
              <div className="space-y-2">
                {users.slice(3).map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 flex items-center justify-center text-muted-foreground font-medium">
                        {index + 4}
                      </span>
                      <span className="capitalize">{user.username.replace('_', ' ')}</span>
                    </div>
                    <span className="text-muted-foreground">{user.points?.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button>View Full Leaderboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile & Achievements */}
      <div className="space-y-6">
        {/* User Profile Card */}
        {currentUser && (
          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white/20">
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {getInitials(currentUser.username)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{currentUser.username.replace('_', ' ')}</h3>
                <p className="text-blue-100">{currentUser.badge}</p>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">551</div>
                    <div className="text-blue-100 text-sm">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">#{currentUser.rank}</div>
                    <div className="text-blue-100 text-sm">Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">16</div>
                    <div className="text-blue-100 text-sm">Reports</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievement Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-xl border transition-all ${
                    achievement.earned ? 'bg-background shadow-sm' : 'bg-muted/50 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    achievement.earned ? achievement.color : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {achievement.earned ? (
                      <achievement.icon className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <h4 className="font-medium text-sm">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {achievement.earned ? 'Earned' : 'Locked'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress to Next Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress to Next Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Urban Guardian → Community Hero</span>
                  <span className="font-medium">551 / 1,000</span>
                </div>
                <Progress value={55.1} className="h-3" />
                <p className="text-xs text-muted-foreground mt-2">449 points to go!</p>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Earn More Points:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Submit verified report: +50 pts</li>
                    <li>• First report of the day: +25 pts</li>
                    <li>• Report leads to penalty: +200 pts</li>
                    <li>• Weekly streak bonus: +100 pts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
