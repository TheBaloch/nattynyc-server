import { Router } from "express";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController";

const router = Router();

router.get("/settings", getSiteSettings);
router.put("/settings", updateSiteSettings);

export default router;
