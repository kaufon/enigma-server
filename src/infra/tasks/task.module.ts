import { Module } from "@nestjs/common";
import { VaultTasksModule } from "@/infra/tasks/vault/vault-task.module";

@Module({
	imports: [VaultTasksModule],
})
export class TasksModule {}
