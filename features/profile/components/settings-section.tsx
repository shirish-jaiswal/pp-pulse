import { Badge } from "@/components/ui/badge";
import Toggle from "@/features/profile/components/toggle";

type Props = {
  isEditing: boolean;
  settings: any;
  onChange: (updated: any) => void;
};

export default function SettingsSection({
  isEditing,
  settings,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Settings</div>

      {/* DO YOU KNOW */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div>
          <div className="font-medium">Do You Know</div>
          <div className="text-xs text-muted-foreground">
            Feature: doyouknow
          </div>
        </div>

        {isEditing ? (
          <Toggle
            enabled={!!settings?.doYouKnow?.on}
            onChange={(val) =>
              onChange({
                ...settings,
                doYouKnow: { title: "doyouknow", on: val },
              })
            }
          />
        ) : (
          <Badge variant={settings?.doYouKnow?.on ? "default" : "secondary"}>
            {settings?.doYouKnow?.on ? "ON" : "OFF"}
          </Badge>
        )}
      </div>

      {/* QNA */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div>
          <div className="font-medium">QnA</div>
          <div className="text-xs text-muted-foreground">
            Feature: qna
          </div>
        </div>

        {isEditing ? (
          <Toggle
            enabled={!!settings?.qna?.on}
            onChange={(val) =>
              onChange({
                ...settings,
                qna: { title: "qna", on: val },
              })
            }
          />
        ) : (
          <Badge variant={settings?.qna?.on ? "default" : "secondary"}>
            {settings?.qna?.on ? "ON" : "OFF"}
          </Badge>
        )}
      </div>
    </div>
  );
}