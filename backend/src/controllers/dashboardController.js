import Job from "../models/Job.js";
import mongoose from "mongoose";

/**
 * Return summary metrics for the authenticated user.
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Total applications
    const totalCountPromise = Job.countDocuments({ userId });

    // Count by status
    const statusBreakdownPromise = Job.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$jobStatus",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobstatuses",
          localField: "_id",
          foreignField: "_id",
          as: "status"
        }
      },
      { $unwind: "$status" },
      {
        $project: {
          _id: 0,
          status: "$status.name",
          count: 1
        }
      }
    ]);

    // Recent applications within the last 14 days.
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentCountPromise = Job.countDocuments({
      userId,
      createdAt: { $gte: fourteenDaysAgo }
    });

    const [totalApplications, byStatus, recentCount] =
      await Promise.all([
        totalCountPromise,
        statusBreakdownPromise,
        recentCountPromise
      ]);

    res.json({
      totalApplications,
      byStatus,
      recentCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
};
