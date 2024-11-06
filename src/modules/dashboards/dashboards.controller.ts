import type { Request, Response } from "express";
import type { DashboardsService } from "./dashboards.service";
import { HTTPStatusEnum } from "../../constants";

export class DashboardsController {
	constructor(private readonly dashboardsService: DashboardsService) {}

	async getDashboardStats(req: Request, res: Response) {
		const stats = await this.dashboardsService.getMeetingsStats(req.userId);
		res.status(HTTPStatusEnum.OK).json(stats);
	}
}

export default DashboardsController;
