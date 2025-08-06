import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@project/ui/components/card';
import { formatDate } from '@project/shared/utils';
import { getMessage, getVersion } from '@project/shared/helpers';

export function InfoCard() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>System Information</CardTitle>
        <CardDescription>
          Current system status and @project/shared package data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Message</p>
            <p className="text-lg">{getMessage()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Version</p>
            <p className="text-lg">{getVersion()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="text-lg">{formatDate(new Date())}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
