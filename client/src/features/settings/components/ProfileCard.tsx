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
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            disabled
                            value={email}
                        />
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="carModel">Модель автомобиля</Label>
                        <Input
                            id="carModel"
                            placeholder="Например: Toyota Camry"
                            value={carModel}
                            onChange={(e) => onCarModelChange(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="carYear">Год выпуска</Label>
                        <Input
                            id="carYear"
                            placeholder="Например: 2020"
                            value={carYear}
                            onChange={(e) => onCarYearChange(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="licensePlate">Гос. номер</Label>
                        <Input
                            id="licensePlate"
                            placeholder="Например: А123БВ 777"
                            value={licensePlate}
                            onChange={(e) => onLicensePlateChange(e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};