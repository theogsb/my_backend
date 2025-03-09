import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: false,
    }
});

const scheduleSchema = new mongoose.Schema ({
    platform: {
        type: String,
        required: true,
    },
    postText: {
        type: String,
        required: false,
    },
    postDate: {
        type: Date,
        required: true,
    },
    postTime: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String, 
        required: false
    }
  }
);

const ScheduleModel = mongoose.model("Schedule", scheduleSchema);
const TemplateModel = mongoose.model("Template", templateSchema);

export {ScheduleModel, TemplateModel};