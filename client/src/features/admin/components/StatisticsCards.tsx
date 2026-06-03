import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Users, Shield, User } from 'lucide-react';

interface StatisticsCardsProps {
    totalUsers: number;
    totalAdmins: number;
    totalRegularUsers: number;
}

export const StatisticsCards = ({ totalUsers, totalAdmins, totalRegularUsers }: StatisticsCardsProps) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Всего пользователей
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Администраторов
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalAdmins}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Обычных пользователей
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalRegularUsers}</div>
            </CardContent>
        </Card>
    </div>
);