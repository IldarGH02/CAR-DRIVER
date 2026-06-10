import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Users, Shield, User } from 'lucide-react';

interface StatisticsCardsProps {
    totalUsers: number;
    totalAdmins: number;
    totalRegularUsers: number;
}

export const StatisticsCards = ({ totalUsers, totalAdmins, totalRegularUsers }: StatisticsCardsProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
            <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Всего пользователей
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{totalUsers}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Администраторов
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{totalAdmins}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Обычных пользователей
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{totalRegularUsers}</div>
            </CardContent>
        </Card>
    </div>
);