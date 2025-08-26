import { Module } from '@nestjs/common';
import { HttpModule } from 'src/infra/http/http.module';

@Module({
  imports: [HttpModule],
})
export class AppModule {}
