import { useSettings } from "@features/settings/hooks/useSettings";
import { ProfileCard } from "@features/settings/components/ProfileCard";
import { UnitsCard } from "@features/settings/components/UnitsCard";
import { CalculationsCard } from "@features/settings/components/CalculationsCard";
import { PreferencesCard } from "@features/settings/components/PreferencesCard";
import { ActionsCard } from "@features/settings/components/ActionsCard";

export function Settings() {
  const {
    profileData,
    setProfileData,
    currency,
    setCurrency,
    distanceUnit,
    setDistanceUnit,
    fuelUnit,
    setFuelUnit,
    amortizationRate,
    setAmortizationRate,
    darkMode,
    setDarkMode,
    notifications,
    setNotifications,
    autoSave,
    setAutoSave,
    isLoading,
    handleSaveSettings,
    handleResetSettings,
  } = useSettings();

  return (
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-2">Настройки</h2>
            <p className="text-muted-foreground">
              Настройте параметры приложения под свои потребности
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProfileCard
                  name={profileData.name}
                  email={profileData.email}
                  carModel={profileData.carModel}
                  carYear={profileData.carYear}
                  licensePlate={profileData.licensePlate}
                  onNameChange={(value) => setProfileData({ ...profileData, name: value })}
                  onCarModelChange={(value) => setProfileData({ ...profileData, carModel: value })}
                  onCarYearChange={(value) => setProfileData({ ...profileData, carYear: value })}
                  onLicensePlateChange={(value) => setProfileData({ ...profileData, licensePlate: value })}
              />

              <UnitsCard
                  currency={currency}
                  distanceUnit={distanceUnit}
                  fuelUnit={fuelUnit}
                  onCurrencyChange={setCurrency}
                  onDistanceUnitChange={setDistanceUnit}
                  onFuelUnitChange={setFuelUnit}
              />

              <CalculationsCard
                  amortizationRate={amortizationRate}
                  currency={currency}
                  distanceUnit={distanceUnit}
                  onAmortizationRateChange={setAmortizationRate}
              />

              <PreferencesCard
                  darkMode={darkMode}
                  notifications={notifications}
                  autoSave={autoSave}
                  onDarkModeChange={setDarkMode}
                  onNotificationsChange={setNotifications}
                  onAutoSaveChange={setAutoSave}
              />
            </div>

            <div className="space-y-6">
              <ActionsCard
                  isLoading={isLoading}
                  currency={currency}
                  distanceUnit={distanceUnit}
                  fuelUnit={fuelUnit}
                  amortizationRate={amortizationRate}
                  onSave={handleSaveSettings}
                  onReset={handleResetSettings}
              />
            </div>
          </div>
        </div>
      </div>
  );
}