import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RepoModel } from "../backend/models/RepoModel";
import { InputSwitch } from "primereact/inputswitch";

const RepoBasic = ({
  repo,
  isSubscribed,
  buttonClicked,
  onIsEnabledChanged,
}: {
  repo: RepoModel;
  isSubscribed: boolean;
  buttonClicked: Function;
  onIsEnabledChanged: Function;
}) => {
  return (
    <Card title={repo.name} subTitle={repo.description} className="mt-2">
      {isSubscribed && (
        <div className="flex items-center mb-2">
          <span className="mr-2">Enabled: </span>
          <InputSwitch
            title={repo.isEnabled === "TRUE" ? "Disable" : "Enable"}
            checked={repo.isEnabled === "TRUE"}
            onChange={(e) => onIsEnabledChanged(repo.id, e.value)}
          />
        </div>
      )}
      <Button
        severity={isSubscribed === true ? "danger" : "info"}
        icon={isSubscribed === true ? "pi pi-power-off" : "pi pi-lock"}
        label={isSubscribed === true ? "Unsubscribe" : "Subscribe"}
        onClick={() => buttonClicked(repo)}
        rounded
      />
    </Card>
  );
};
export default RepoBasic;
