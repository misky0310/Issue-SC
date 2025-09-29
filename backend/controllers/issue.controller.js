import {validationResult} from 'express-validator';
import Issue from "../models/issues.js";
import User from "../models/users.js";

// here import send email function 

export const createIssue = async (req,res) => {
    try {
        
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            regNo,
            date, // expected as YYYY-MM-DD or ISO
            school,
            programme,
            category,
            gender,
            issue,
            assignedFacultyId // optional
        } = req.body;

        const handler = req.user._id; // from authenticateJWT middleware

        const issueDoc = new Issue({
            name,
            regNo,
            date,
            school,
            programme,
            category,
            gender,
            issue,
            handler,
            assignedFaculty: assignedFacultyId || null
        });

        await issueDoc.save();

        if(assignedFacultyId){
            const faculty = await User.findById(assignedFacultyId).select("-password");
            if(!faculty || faculty.role !== 'faculty'){
                return res.status(400).json({ message: "Assigned faculty not found or invalid" });
            }
            // send email to assigned faculty here
        }

        return res.status(201).json({ message: "Issue created successfully", issue: issueDoc });

    } catch (error) {
        return res.status(500).json({ message: "Server error while creating issue", error: error.message });
    }
}

export const getIssues = async (req, res) => {
    try {
      const {
        status,
        name,
        regNo,
        school,
        programme,
        date,
        dateFrom,
        dateTo,
        assigned,
        mine, // 👈 new query param to get only current faculty’s issues
        page = 1,
        limit = 25,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;
  
      const filter = {};
      if (status) filter.status = status;
      if (name) filter.name = { $regex: name, $options: "i" };
      if (regNo) filter.regNo = regNo;
      if (school) filter.school = school;
      if (programme) filter.programme = programme;
      if (assigned === "true") filter.assignedFaculty = { $ne: null };
      if (assigned === "false") filter.assignedFaculty = null;
  
      // 🔹 Filter only current faculty’s assigned issues
      if (mine === "true" && req.user.role === "faculty") {
        filter.assignedFaculty = req.user.id;
      }
  
      // date exact day
      if (date) {
        const dStart = new Date(date + "T00:00:00");
        const dEnd = new Date(date + "T23:59:59.999");
        filter.date = { $gte: dStart, $lte: dEnd };
      } else if (dateFrom || dateTo) {
        filter.date = {};
        if (dateFrom) filter.date.$gte = new Date(dateFrom + "T00:00:00");
        if (dateTo) filter.date.$lte = new Date(dateTo + "T23:59:59.999");
      }
  
      // pagination + sorting
      const p = Math.max(1, parseInt(page, 10));
      const lim = Math.min(200, parseInt(limit, 10) || 25);
      const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  
      const total = await Issue.countDocuments(filter);
      const issues = await Issue.find(filter)
        .populate("assignedFaculty", "name email role school")
        .populate("handler", "name email role")
        .sort(sort)
        .skip((p - 1) * lim)
        .limit(lim)
        .lean();
  
      return res.status(200).json({ total, page: p, limit: lim, issues });
    } catch (error) {
      return res.status(500).json({
        message: "Server error while fetching issues",
        error: error.message,
      });
    }
  };

//faculty pick issue
export const pickIssue = async (req,res) => {
    try {
        
        const { id } = req.params;
        const facultyId = req.user._id; // from authenticateJWT middleware

        const issue = Issue.findById(id);
        if(!issue)
            return res.status(404).json({ message: "Issue not found" });

        if(issue.assignedFaculty)
            return res.status(400).json({ message: "Issue already assigned" });

        if(issue.status !== 'Open')
            return res.status(400).json({ message: "Only open issues can be picked" });

        issue.assignedFaculty = facultyId;
        await issue.save();

        return res.status(200).json({ message: "Issue picked successfully", issue });

    } catch (error) {
        return res.status(500).json({ message: "Server error while picking issue", error: error.message });
    }
}

//faculty resolve issue
export const resolveIssue = async (req,res) => {
    try {
        
        const { id } = req.params;
        const facultyId = req.user._id; // from authenticateJWT middleware
        const { remark } = req.body;

        const issue = await Issue.findById(id);
        if(!issue)
            return res.status(404).json({ message: "Issue not found" });

        if(!issue.assignedFaculty || issue.assignedFaculty.toString() !== facultyId.toString()){
            return res.status(403).json({ message: "You are not assigned to this issue" });
        }

        if(issue.status !== 'Open')
            return res.status(400).json({ message: "Only open issues can be resolved" });

        issue.status = 'Resolved';
        issue.remark = remark || "";
        issue.resolvedAt = new Date();

        await issue.save();
        return res.status(200).json({ message: "Issue resolved successfully", issue });

    } catch (error) {
        return res.status(500).json({ message: "Server error while resolving issue", error: error.message });
    }
}

// get single issue by id
export const  getIssueById = async (req,res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id).populate("assignedFaculty", "name email role school").populate("handler", "name email role");

        if(!issue)
            return res.status(404).json({ message: "Issue not found" });

        return res.status(200).json({ issue });

    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching issue by id", error: error.message });
    }
}