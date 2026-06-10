import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Separator } from "@shared/ui/separator";
import { User } from "lucide-react";

interface ProfileCardProps {
    name: string;
    email: string;
    carModel: string;
    carYear: string;
    licensePlate: string;
    onNameChange: (value: string) => void;
    onCarModelChange: (value: string) => void;
    onCarYearChange: (value: string) => void;
    onLicensePlateChange: (value: string) => void;
}

export const ProfileCard = ({
                                name,
                                email,
                                carModel,
                                carYear,
                                licensePlate,
                                onNameChange,
                                onCarModelChange,
                                onCarYearChange,
                                onLicensePlateChange,
                            }: ProfileCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Профиль водителя
                </CardTitle>
                <CardDescription>Информация о вас и вашем автомобиле</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Имя и Email - на мобильных в колонку, на планшетах и выше в ряд */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            disabled
                            value={email}
                            className="w-full bg-muted/50 cursor-not-allowed"
                        />
                    </div>
                </div>

                <Separator />

                {/* Данные автомобиля - на мобильных в колонку, на планшетах в 2 колонки, на десктопе в 3 */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="carModel">Модель авто</Label>
                        <Input
                            id="carModel"
                            placeholder="Например: Toyota Camry"
                            value={carModel}
                            onChange={(e) => onCarModelChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="carYear">Год выпуска</Label>
                        <Input
                            id="carYear"
                            placeholder="Например: 2020"
                            value={carYear}
                            onChange={(e) => onCarYearChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="licensePlate">Госномер</Label>
                        <Input
                            id="licensePlate"
                            placeholder="Например: А123БВ 777"
                            value={licensePlate}
                            onChange={(e) => onLicensePlateChange(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};