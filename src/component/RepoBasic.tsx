import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { RepoModel } from "../backend/models/RepoModel";
const RepoBasic = ({
  repo,
  isSubscribed,
  buttonClicked,
}: {
  repo: RepoModel;
  isSubscribed: boolean;
  buttonClicked: Function;
}) => {
  return (
    <Card title={repo.name} subTitle={repo.description} className="mt-2">
      <Button
        label={isSubscribed === true ? "Unsubscribe" : "Subscribe"}
        onClick={() => buttonClicked(repo)}
      />
    </Card>
  );
};
export default RepoBasic;
