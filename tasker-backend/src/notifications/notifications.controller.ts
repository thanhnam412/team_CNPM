import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController { constructor(private notifications: NotificationsService) {} @Get() findAll() { return this.notifications.findAll(); } @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) { return this.notifications.update(id, dto); } }
