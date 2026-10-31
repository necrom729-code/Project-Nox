#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "VitalsComponent.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthCritical, bool, bCritical);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnDeath);

/** Server-authoritative Health / Stamina / Hygiene / Sleep. Drives low-HP audio distortion. */
UCLASS(ClassGroup = (Survival), meta = (BlueprintSpawnableComponent))
class FINALISTARENA_API UVitalsComponent : public UActorComponent
{
	GENERATED_BODY()

public:
	UVitalsComponent();

	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;
	virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

	UFUNCTION(BlueprintCallable, Category = "Vitals") void ApplyDamage(float Amount);
	UFUNCTION(BlueprintCallable, Category = "Vitals") bool ConsumeStamina(float Amount);

	/** 0..1, 1 = critical. Feed this into the MetaSound 'Critical' parameter. */
	UFUNCTION(BlueprintPure, Category = "Vitals") float GetCriticalAlpha() const;

	UPROPERTY(BlueprintAssignable) FOnHealthCritical OnHealthCritical;
	UPROPERTY(BlueprintAssignable) FOnDeath OnDeath;

	UPROPERTY(EditDefaultsOnly, Replicated, BlueprintReadOnly, Category = "Vitals") float Health = 100.f;
	UPROPERTY(EditDefaultsOnly, Replicated, BlueprintReadOnly, Category = "Vitals") float Stamina = 100.f;
	UPROPERTY(EditDefaultsOnly, Replicated, BlueprintReadOnly, Category = "Vitals") float Hygiene = 100.f;
	UPROPERTY(EditDefaultsOnly, Replicated, BlueprintReadOnly, Category = "Vitals") float Sleep = 100.f;

	UPROPERTY(EditDefaultsOnly, Category = "Vitals") float CriticalThreshold = 25.f;
	UPROPERTY(EditDefaultsOnly, Category = "Vitals") float StaminaRegenPerSec = 8.f;
	UPROPERTY(EditDefaultsOnly, Category = "Vitals") float HygieneDecayPerSec = 0.02f;
	UPROPERTY(EditDefaultsOnly, Category = "Vitals") float SleepDecayPerSec = 0.03f;

private:
	bool bWasCritical = false;
	bool bDead = false;
};
