import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    // email:{
    //     type:String,
    //     required:true,
    //     trim:true
    // },
    regNo:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        required:true
    },
    school:{
        type:String,
        required:true,
        trim:true
    },
    programme:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        enum:["Indian","NRI","Foreign"],
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Other"]
    },
    issue:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:String,
        enum:["Open","Resolved"],
        default:"Open"
    },
    assignedFaculty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    handler:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    remark:{
        type:String,
        trim:true,
        default:null
    },
    resolvedAt:{
        type:Date,
        default:null
    }

},{timestamps:true});

export default mongoose.model("Issue",issueSchema);