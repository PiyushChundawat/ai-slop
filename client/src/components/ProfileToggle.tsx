import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileToggle() {
  const { profile, setProfile } = useProfile();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setProfile("piyush")}
        data-testid="toggle-piyush"
        className={cn(
          "rounded-md px-4 transition-all",
          profile === "piyush"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground"
        )}
      >
        Piyush
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setProfile("shruti")}
        data-testid="toggle-shruti"
        className={cn(
          "rounded-md px-4 transition-all",
          profile === "shruti"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground"
        )}
      >
        Shruti
      </Button>
    </div>
  );
}
