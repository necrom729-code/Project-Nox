using UnrealBuildTool;

public class FinalistArena : ModuleRules
{
	public FinalistArena(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore", "NetCore", "GameplayAbilities", "GameplayTags", "GameplayTasks" });
	}
}
