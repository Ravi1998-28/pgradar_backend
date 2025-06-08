// controllers/pgController.js
import PG from '../models/PG.js';

// Add PG (Owner Only)
export const addPG = async (req, res) => {
  try {
    const pg = new PG({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedPG = await pg.save();
    res.status(201).json(savedPG);
  } catch (err) {
    console.error('Add PG Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUnverifiedPGs = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const searchRegex = new RegExp(search, 'i');

    const pipeline = [
      {
        $match: {
          isVerified: false
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $match: {
          'creator.role': 'owner',
          $or: [
            { pgName: { $regex: searchRegex } },
            { 'creator.business_name': { $regex: searchRegex } },
            { 'creator.email': { $regex: searchRegex } },
            { 'creator.phone': { $regex: searchRegex } }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          pgName: 1,
          createdAt: 1,
          businessName: '$creator.business_name',
          email: '$creator.email',
          phone: '$creator.phone'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $facet: {
          metadata: [
            { $count: 'total' },
            { $addFields: { page: pageNumber, limit: pageSize } }
          ],
          data: [
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize }
          ]
        }
      }
    ];

    const results = await PG.aggregate(pipeline);

    const metadata = results[0].metadata[0] || { total: 0, page: pageNumber, limit: pageSize };
    const data = results[0].data;

    res.status(200).json({
      success: true,
      total: metadata.total,
      page: metadata.page,
      limit: metadata.limit,
      data
    });

  } catch (err) {
    console.error('Get Unverified PGs Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

