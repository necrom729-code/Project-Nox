#include "VitalsComponent.h"
#include "Net/UnrealNetwork.h"

UVitalsComponent::UVitalsComponent()
{
	PrimaryComponentTick.bCanEverTick = true;
	PrimaryComponentTick.TickInterval = 0.25f;
	SetIsReplicatedByDefault(true);
}

void UVitalsComponent::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(UVitalsComponent, Health);
	DOREPLIFETIME(UVitalsComponent, Stamina);
	DOREPLIFETIME(UVitalsComponent, Hygiene);
	DOREPLIFETIME(UVitalsComponent, Sleep);
}

void UVitalsComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
	Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
	if (!GetOwner() || !GetOwner()->HasAuthority() || bDead)
	{
		return;
	}

	Stamina = FMath::Min(100.f, Stamina + StaminaRegenPerSec * DeltaTime);
	Hygiene = FMath::Max(0.f, Hygiene - HygieneDecayPerSec * DeltaTime);
	Sleep = FMath::Max(0.f, Sleep - SleepDecayPerSec * DeltaTime);

	// Exhaustion and filth hurt slowly.
	if (Sleep <= 0.f || Hygiene <= 0.f)
	{
		ApplyDamage(0.2f * DeltaTime);
	}
}

void UVitalsComponent::ApplyDamage(float Amount)
{
	if (!GetOwner() || !GetOwner()->HasAuthority() || bDead || Amount <= 0.f)
	{
		return;
	}

	Health = FMath::Max(0.f, Health - Amount);

	const bool bCritical = Health <= CriticalThreshold;
	if (bCritical != bWasCritical)
	{
		bWasCritical = bCritical;
		OnHealthCritical.Broadcast(bCritical);
	}

	if (Health <= 0.f)
	{
		bDead = true;
		OnDeath.Broadcast();
	}
}

bool UVitalsComponent::ConsumeStamina(float Amount)
{
	if (Stamina < Amount)
	{
		return false;
	}
	Stamina -= Amount;
	return true;
}

float UVitalsComponent::GetCriticalAlpha() const
{
	return FMath::Clamp(1.f - Health / FMath::Max(1.f, CriticalThreshold), 0.f, 1.f);
}
